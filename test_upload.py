import requests

BASE_URL = "http://localhost:8000/api/v1"

# 1. Register a user
print("1. Registering user...")
register_data = {
    "email": "test@example.com",
    "password": "testpassword123"
}
response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"   Status: {response.status_code}")
if response.status_code not in [200, 201, 400]:
    print(f"   Response: {response.text}")

# 2. Login
print("\n2. Logging in...")
login_data = {
    "username": "test@example.com",
    "password": "testpassword123"
}
response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
print(f"   Status: {response.status_code}")
if response.status_code != 200:
    print(f"   Response: {response.text}")
    exit(1)

token = response.json()["access_token"]
print(f"   Token received: {token[:20]}...")

# 3. Upload document
print("\n3. Uploading document...")
headers = {"Authorization": f"Bearer {token}"}
files = {'file': ('test.pdf', b'%PDF-1.4 test content', 'application/pdf')}

response = requests.post(f"{BASE_URL}/documents/upload", files=files, headers=headers)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.text}")

if response.status_code == 500:
    print("\n❌ 500 ERROR DETECTED!")
