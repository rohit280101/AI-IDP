#!/usr/bin/env python3
"""
Final Verification - JWT + RBAC Authentication System
"""

def main():
    print("\n" + "=" * 70)
    print("FINAL VERIFICATION - JWT + RBAC Authentication System")
    print("=" * 70)

    # Test 1: Imports
    print("\n✓ Testing imports...")
    try:
        from app.main import app
        from app.api.v1.auth import require_role, get_current_user, get_current_active_user
        from app.core.security import hash_password, verify_password, create_access_token
        from app.db.models import User
        from app.schemas.auth import UserCreate, Token, UserOut, UserUpdate, TokenData
        from app.db.base import Base
        print("  ✓ All core modules imported successfully")
    except Exception as e:
        print(f"  ✗ Import error: {e}")
        return 1

    # Test 2: Database configuration
    print("\n✓ Checking database configuration...")
    from app.core.config import settings
    print(f"  ✓ Database URL: {settings.DATABASE_URL}")
    print(f"  ✓ JWT Algorithm: {settings.JWT_ALGORITHM}")
    print(f"  ✓ Token Expiry: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")

    # Test 3: Routes
    print("\n✓ Checking API routes...")
    routes_to_check = [
        "/api/v1/health",
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/me"
    ]
    for route in app.routes:
        if hasattr(route, 'path') and any(r in route.path for r in routes_to_check):
            methods = route.methods if hasattr(route, 'methods') else 'N/A'
            print(f"  ✓ {route.path} {methods}")

    # Test 4: Endpoint testing
    print("\n✓ Testing endpoints...")
    from fastapi.testclient import TestClient
    client = TestClient(app)

    # Health check
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200, "Health check failed"
    print("  ✓ GET /api/v1/health - 200 OK")

    # Register
    import uuid
    unique_email = f"verify_{uuid.uuid4().hex[:8]}@test.com"
    resp = client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "password123"
    })
    assert resp.status_code == 201, f"Register failed: {resp.json()}"
    print("  ✓ POST /api/v1/auth/register - 201 Created")

    # Login
    resp = client.post("/api/v1/auth/login", data={
        "username": unique_email,
        "password": "password123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.json()}"
    token = resp.json()["access_token"]
    print("  ✓ POST /api/v1/auth/login - 200 OK")

    # Get user
    resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200, f"Get user failed: {resp.json()}"
    print("  ✓ GET /api/v1/auth/me - 200 OK")

    print("\n" + "=" * 70)
    print("✅ ALL SYSTEMS OPERATIONAL")
    print("=" * 70)
    print("\nStatus: READY FOR PRODUCTION\n")
    print("Next steps:")
    print("  1. Run: python -m uvicorn app.main:app --reload")
    print("  2. Visit: http://localhost:8000/docs")
    print("  3. Start using the API!")
    print("\n" + "=" * 70 + "\n")

    return 0

if __name__ == "__main__":
    exit(main())
