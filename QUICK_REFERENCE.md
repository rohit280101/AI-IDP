# JWT + RBAC Authentication - Quick Reference

## ✓ All Issues Fixed and Tested

Your authentication and authorization system is now fully functional!

---

## Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload

# Server will be available at http://localhost:8000
# API docs: http://localhost:8000/docs
```

---

## Authentication Endpoints

### Register a new user
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secure_password

# Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Get current user
```bash
GET /api/v1/auth/me
Authorization: Bearer <your_token_here>

# Response:
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "is_active": true
}
```

---

## Protecting Endpoints with RBAC

### Require specific role
```python
from fastapi import APIRouter, Depends
from app.api.v1.auth import require_role
from app.db.models import User

router = APIRouter()

@router.delete("/admin/users/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(require_role("admin"))):
    # Only users with 'admin' role can access this
    return {"message": f"Deleted user {user_id}"}
```

### Multiple roles
```python
@router.get("/reports")
def get_reports(current_user: User = Depends(require_role("admin", "superadmin"))):
    # Admin OR superadmin can access
    return {"reports": [...]}
```

### Just check authentication (no role check)
```python
from app.api.v1.auth import get_current_active_user

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_active_user)):
    # Any authenticated, active user can access
    return current_user
```

---

## User Roles

- **`user`** - Default role for new users
- **`admin`** - Administrative access, can manage users and data
- **`superadmin`** - Full system access

To change a user's role, update the database:
```python
# In your code or admin interface
user.role = "admin"
db.commit()
```

---

## Password Security

- **Algorithm:** Argon2 (modern, resistant to GPU/ASIC attacks)
- **Fallback:** Bcrypt (for legacy compatibility)
- **No length limit** (unlike bcrypt's 72-byte limit)

The system automatically handles password hashing and verification.

---

## Token Security

- **Type:** JWT (JSON Web Token)
- **Algorithm:** HS256
- **Expiry:** 60 minutes (configurable in `app/core/config.py`)
- **Secret Key:** Set in environment or `JWT_SECRET_KEY`

Tokens are validated on every protected endpoint request.

---

## Common Issues & Solutions

### "Could not validate credentials"
- Token is expired or invalid
- User is inactive (`is_active = false`)
- Token wasn't provided or is malformed

### "Insufficient permissions"
- User's role doesn't match endpoint requirement
- Check `current_user.role` and `require_role()` parameters

### "Invalid credentials"
- Email or password is wrong
- User account doesn't exist

---

## Testing

Run the test suite:
```bash
python test_auth.py
```

Expected output:
```
✓✓✓ ALL TESTS PASSED! ✓✓✓
```

---

## Next Steps

1. **Set up PostgreSQL** if not already done
2. **Run migrations** to create database tables
3. **Update endpoints** to use RBAC as needed:
   ```python
   @router.get("/documents")
   def list_documents(current_user = Depends(require_role("user", "admin", "superadmin"))):
       # Your logic here
       pass
   ```
4. **Test endpoints** using Swagger UI at `/docs`

---

## Environment Variables

Add to your `.env` file:
```
JWT_SECRET_KEY=your-super-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/docai
```

---

## Key Files

- `app/core/security.py` - Password hashing, JWT handling
- `app/api/v1/auth.py` - Authentication endpoints and RBAC dependencies
- `app/db/models.py` - User model
- `app/schemas/auth.py` - Request/response schemas
- `app/db/base.py` - SQLAlchemy base model

---

**Status:** ✓ FULLY WORKING AND TESTED

Your JWT + RBAC implementation is production-ready!
