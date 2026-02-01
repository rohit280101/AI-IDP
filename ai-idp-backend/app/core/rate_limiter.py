"""
Rate limiting for API endpoints
"""
from fastapi import HTTPException, Request
from typing import Dict, Tuple
import time
from collections import defaultdict
import threading
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    """
    In-memory rate limiter using sliding window algorithm
    Stores request timestamps per IP address
    """
    
    def __init__(self):
        # Store: {ip_address: {endpoint: [timestamps]}}
        self.requests: Dict[str, Dict[str, list]] = defaultdict(lambda: defaultdict(list))
        self.lock = threading.Lock()
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        # Check for proxy headers first
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to client host
        if request.client:
            return request.client.host
        return "unknown"
    
    def _clean_old_requests(self, timestamps: list, window: int) -> list:
        """Remove timestamps older than the time window"""
        current_time = time.time()
        cutoff = current_time - window
        return [ts for ts in timestamps if ts > cutoff]
    
    def check_rate_limit(
        self, 
        request: Request, 
        max_requests: int, 
        window: int,
        endpoint_key: str = None
    ) -> Tuple[bool, Dict[str, str]]:
        """
        Check if request should be rate limited
        
        Args:
            request: FastAPI request object
            max_requests: Maximum number of requests allowed
            window: Time window in seconds
            endpoint_key: Optional endpoint identifier (defaults to path)
            
        Returns:
            Tuple of (is_allowed, headers_dict)
        """
        client_ip = self._get_client_ip(request)
        endpoint = endpoint_key or request.url.path
        current_time = time.time()
        
        with self.lock:
            # Get and clean old requests for this client/endpoint
            timestamps = self.requests[client_ip][endpoint]
            timestamps = self._clean_old_requests(timestamps, window)
            self.requests[client_ip][endpoint] = timestamps
            
            # Check if limit exceeded
            if len(timestamps) >= max_requests:
                # Calculate retry after
                oldest_timestamp = timestamps[0]
                retry_after = int(window - (current_time - oldest_timestamp)) + 1
                
                headers = {
                    "X-RateLimit-Limit": str(max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(oldest_timestamp + window)),
                    "Retry-After": str(retry_after)
                }
                
                logger.warning(
                    f"Rate limit exceeded for {client_ip} on {endpoint}. "
                    f"Limit: {max_requests}/{window}s"
                )
                
                return False, headers
            
            # Add current request timestamp
            timestamps.append(current_time)
            
            # Calculate remaining requests
            remaining = max_requests - len(timestamps)
            
            headers = {
                "X-RateLimit-Limit": str(max_requests),
                "X-RateLimit-Remaining": str(remaining),
                "X-RateLimit-Reset": str(int(current_time + window))
            }
            
            return True, headers


# Global rate limiter instance
rate_limiter = RateLimiter()


def rate_limit(max_requests: int = 10, window: int = 60):
    """
    Rate limiting decorator for FastAPI endpoints
    
    Args:
        max_requests: Maximum number of requests allowed
        window: Time window in seconds
        
    Usage:
        @app.get("/endpoint")
        @rate_limit(max_requests=5, window=60)
        async def my_endpoint():
            pass
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract request from kwargs
            request = kwargs.get('request')
            if not request:
                # Try to find request in args
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
            
            if not request:
                logger.warning("Rate limiter: No request object found")
                return await func(*args, **kwargs)
            
            # Check rate limit
            is_allowed, headers = rate_limiter.check_rate_limit(
                request, 
                max_requests, 
                window
            )
            
            if not is_allowed:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window} seconds allowed.",
                    headers=headers
                )
            
            # Execute the endpoint
            response = await func(*args, **kwargs)
            
            # Add rate limit headers to response if possible
            if hasattr(response, 'headers'):
                for key, value in headers.items():
                    response.headers[key] = value
            
            return response
        
        return wrapper
    return decorator


class RateLimitDependency:
    """
    Dependency class for rate limiting
    Can be used with FastAPI's Depends()
    """
    
    def __init__(self, max_requests: int = 10, window: int = 60):
        self.max_requests = max_requests
        self.window = window
    
    async def __call__(self, request: Request):
        is_allowed, headers = rate_limiter.check_rate_limit(
            request,
            self.max_requests,
            self.window
        )
        
        if not is_allowed:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {self.max_requests} requests per {self.window} seconds allowed.",
                headers=headers
            )
        
        return headers
