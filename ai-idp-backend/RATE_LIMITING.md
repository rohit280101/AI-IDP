# Rate Limiting Implementation

## Overview
Rate limiting has been implemented for the search and upload endpoints to prevent abuse and ensure fair usage of the API.

## Features
- **In-memory rate limiting** using sliding window algorithm
- **Configurable limits** via environment variables
- **Per-IP tracking** with support for proxy headers (X-Forwarded-For, X-Real-IP)
- **Standard HTTP 429 responses** when limits are exceeded
- **Rate limit headers** included in all responses

## Configuration

Rate limits can be configured via environment variables:

### Upload Endpoint
- `UPLOAD_RATE_LIMIT`: Maximum number of upload requests (default: 10)
- `UPLOAD_RATE_WINDOW`: Time window in seconds (default: 60)

### Search Endpoint
- `SEARCH_RATE_LIMIT`: Maximum number of search requests (default: 30)
- `SEARCH_RATE_WINDOW`: Time window in seconds (default: 60)

### Example .env file:
```env
UPLOAD_RATE_LIMIT=10
UPLOAD_RATE_WINDOW=60
SEARCH_RATE_LIMIT=30
SEARCH_RATE_WINDOW=60
```

## Response Headers

All responses include the following rate limit headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit window resets

When rate limited (HTTP 429), additional headers are included:
- `Retry-After`: Number of seconds to wait before retrying

## HTTP 429 Response Example

```json
{
  "detail": "Rate limit exceeded. Maximum 30 requests per 60 seconds allowed."
}
```

Headers:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1738454321
Retry-After: 45
```

## Implementation Details

### Architecture
The rate limiter uses:
1. **Sliding window algorithm**: Tracks individual request timestamps
2. **In-memory storage**: Uses Python dictionaries with thread-safe locking
3. **Automatic cleanup**: Removes old timestamps outside the time window
4. **IP-based tracking**: Tracks limits per client IP address

### Files Modified/Created

1. **app/core/rate_limiter.py** (new)
   - `RateLimiter` class: Core rate limiting logic
   - `RateLimitDependency`: FastAPI dependency for easy integration
   - Sliding window implementation with automatic cleanup

2. **app/core/config.py** (modified)
   - Added rate limit configuration settings

3. **app/api/v1/documents.py** (modified)
   - Added rate limiting to upload endpoint

4. **app/api/v1/search.py** (modified)
   - Added rate limiting to search endpoint

5. **test_rate_limit.py** (new)
   - Test script to verify rate limiting functionality

## Testing

Run the test script to verify rate limiting:

```bash
cd ai-idp-backend
python test_rate_limit.py
```

The script will:
1. Test search endpoint rate limiting
2. Test upload endpoint rate limiting (requires authentication)
3. Display rate limit headers and responses

## Usage Examples

### Making a Request (Python)
```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/search",
    json={"query": "test", "limit": 5}
)

# Check rate limit headers
print(f"Limit: {response.headers['X-RateLimit-Limit']}")
print(f"Remaining: {response.headers['X-RateLimit-Remaining']}")
print(f"Reset: {response.headers['X-RateLimit-Reset']}")

if response.status_code == 429:
    print(f"Rate limited! Retry after: {response.headers['Retry-After']} seconds")
```

### Making a Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "limit": 5}' \
  -i
```

## Production Considerations

### Current Implementation (In-Memory)
- ✅ Simple and fast
- ✅ No external dependencies
- ✅ Good for single-server deployments
- ❌ Rate limits reset on server restart
- ❌ Not suitable for multi-server deployments

### Future Enhancements (Redis)

For production multi-server deployments, consider implementing Redis-based rate limiting:

```python
# Example Redis implementation
import redis
from datetime import timedelta

redis_client = redis.Redis.from_url(settings.REDIS_URL)

def check_rate_limit_redis(key: str, limit: int, window: int):
    pipe = redis_client.pipeline()
    now = time.time()
    window_start = now - window
    
    # Remove old entries
    pipe.zremrangebyscore(key, 0, window_start)
    # Add current request
    pipe.zadd(key, {str(now): now})
    # Count requests in window
    pipe.zcard(key)
    # Set expiration
    pipe.expire(key, window)
    
    results = pipe.execute()
    request_count = results[2]
    
    return request_count <= limit
```

## Security Notes

1. **IP Spoofing**: The current implementation trusts X-Forwarded-For headers. In production, ensure your reverse proxy (nginx/Apache) properly sets these headers.

2. **Distributed Systems**: For load-balanced deployments, switch to Redis-based rate limiting to share state across servers.

3. **User-based Limiting**: Current implementation is IP-based. For authenticated endpoints, consider per-user rate limiting in addition to IP-based limits.

## Troubleshooting

### Rate limits too strict
Adjust environment variables:
```env
SEARCH_RATE_LIMIT=100
UPLOAD_RATE_LIMIT=20
```

### Rate limits not working
1. Check logs for warnings
2. Verify Request object is properly passed to endpoints
3. Ensure middleware is not interfering

### Testing locally
Use different IP addresses or wait for the window to reset, or temporarily increase limits during development.
