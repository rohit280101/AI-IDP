"""
Test script to verify rate limiting on search and upload endpoints
"""
import requests
import time
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

# Test credentials
TEST_EMAIL = "rohit.gupta@iu.com"
TEST_PASSWORD = "pass12344"

def register_user():
    """Register a test user"""
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )
    if response.status_code == 201:
        print(f"✅ User registered successfully: {TEST_EMAIL}")
        return True
    elif response.status_code == 400 and "already registered" in response.text:
        print(f"ℹ️  User already exists: {TEST_EMAIL}")
        return True
    else:
        print(f"❌ Failed to register user: {response.status_code} - {response.text}")
        return False

def get_auth_token():
    """Get authentication token"""
    # Try to register first
    #register_user()
    
    # Now try to login
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={
            "username": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )
    if response.status_code == 200:
        print(f"✅ Successfully authenticated")
        return response.json()["access_token"]
    else:
        print(f"❌ Failed to authenticate: {response.status_code} - {response.text}")
        return None


def test_search_rate_limit():
    """Test rate limiting on search endpoint"""
    print("\n" + "="*60)
    print("Testing Search Rate Limiting")
    print("="*60)
    
    url = f"{BASE_URL}/search"
    payload = {"query": "test query", "limit": 5}
    
    # Make requests until rate limited
    for i in range(35):  # Exceeds default 30 requests per 60 seconds
        response = requests.post(url, json=payload)
        
        # Print rate limit headers
        limit = response.headers.get("X-RateLimit-Limit", "N/A")
        remaining = response.headers.get("X-RateLimit-Remaining", "N/A")
        reset = response.headers.get("X-RateLimit-Reset", "N/A")
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        if response.status_code == 200:
            print(f"[{timestamp}] Request {i+1}: OK - Remaining: {remaining}/{limit}")
        elif response.status_code == 429:
            retry_after = response.headers.get("Retry-After", "N/A")
            print(f"\n[{timestamp}] Request {i+1}: RATE LIMITED!")
            print(f"  Message: {response.json()['detail']}")
            print(f"  Limit: {limit} requests")
            print(f"  Remaining: {remaining}")
            print(f"  Retry After: {retry_after} seconds")
            print(f"  Reset Time: {reset}")
            break
        else:
            print(f"[{timestamp}] Request {i+1}: Error {response.status_code}")
        
        time.sleep(0.1)  # Small delay between requests


def test_upload_rate_limit(token):
    """Test rate limiting on upload endpoint"""
    print("\n" + "="*60)
    print("Testing Upload Rate Limiting")
    print("="*60)
    
    if not token:
        print("Skipping upload test - no auth token")
        return
    
    url = f"{BASE_URL}/documents/upload"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a minimal valid PDF file
    # This is a minimal PDF structure that will be accepted
    pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
190
%%EOF
"""
    
    # Make requests until rate limited
    for i in range(15):  # Exceeds default 10 requests per 60 seconds
        # Create fresh file object for each request
        files = {"file": ("test_document.pdf", pdf_content, "application/pdf")}
        response = requests.post(url, headers=headers, files=files)
        
        # Print rate limit headers
        limit = response.headers.get("X-RateLimit-Limit", "N/A")
        remaining = response.headers.get("X-RateLimit-Remaining", "N/A")
        reset = response.headers.get("X-RateLimit-Reset", "N/A")
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        if response.status_code == 200:
            print(f"[{timestamp}] Upload {i+1}: OK - Remaining: {remaining}/{limit}")
        elif response.status_code == 429:
            retry_after = response.headers.get("Retry-After", "N/A")
            print(f"\n[{timestamp}] Upload {i+1}: RATE LIMITED!")
            print(f"  Message: {response.json()['detail']}")
            print(f"  Limit: {limit} requests")
            print(f"  Remaining: {remaining}")
            print(f"  Retry After: {retry_after} seconds")
            print(f"  Reset Time: {reset}")
            break
        else:
            print(f"[{timestamp}] Upload {i+1}: Error {response.status_code} - {response.text}")
        
        time.sleep(0.1)


if __name__ == "__main__":
    print("\nRate Limit Testing Script")
    print("Make sure the server is running on http://localhost:8000")
    
    # Test search endpoint (no auth required)
    test_search_rate_limit()
    
    # Get auth token and test upload endpoint
    print("\nAttempting to get auth token for upload test...")
    token = get_auth_token()
    test_upload_rate_limit(token)
    
    print("\n" + "="*60)
    print("Testing Complete")
    print("="*60)
