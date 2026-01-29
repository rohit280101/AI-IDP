#!/usr/bin/env python3
"""
Test all authentication endpoints
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def main():
    print("\nTesting API Endpoints...")
    print("=" * 60)

    # Test health endpoint
    print("\n1. Testing /api/v1/health")
    response = client.get("/api/v1/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")

    # Test register endpoint
    print("\n2. Testing /api/v1/auth/register")
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        print(f"   ✓ User created: {response.json()}")
    else:
        print(f"   Error: {response.json()}")

    # Test register with same email
    print("\n3. Testing /api/v1/auth/register (duplicate)")
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")

    # Test login endpoint
    print("\n4. Testing /api/v1/auth/login")
    response = client.post("/api/v1/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"   ✓ Token received: {token[:30]}...")
    else:
        print(f"   Error: {response.json()}")

    # Test /me endpoint without token
    print("\n5. Testing /api/v1/auth/me (without token)")
    response = client.get("/api/v1/auth/me")
    print(f"   Status: {response.status_code}")
    print(f"   Expected: 403 (Forbidden)")

    # Test /me endpoint with token
    print("\n6. Testing /api/v1/auth/me (with valid token)")
    response = client.post("/api/v1/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    token = response.json()["access_token"]
    response = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        user = response.json()
        print(f"   ✓ Current user: {user['email']} (role: {user['role']})")
    else:
        print(f"   Error: {response.json()}")

    print("\n" + "=" * 60)
    print("✓ All endpoint tests completed!")

if __name__ == "__main__":
    main()
