# Quick Commands Reference

## Starting the Server

```bash
# Local development (SQLite, recommended)
python -m uvicorn app.main:app --reload

# Specific port
python -m uvicorn app.main:app --port 8001

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Testing

```bash
# Run authentication tests
python test_auth.py

# Run endpoint integration tests
python test_endpoints.py

# Test specific endpoint
curl http://localhost:8000/api/v1/health
```

## User Management

### Register a user
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
```

### Login and get token
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@test.com&password=pass123"

# Save the token
export TOKEN="your_token_here"
```

### Get current user info
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me
```

## Database

### Reset database (SQLite)
```bash
# Stop the server first
rm docai.db

# Restart server - database will be recreated
python -m uvicorn app.main:app --reload
```

### Use PostgreSQL instead
```bash
export DATABASE_URL="postgresql+psycopg2://user:password@localhost:5432/docai"
python -m uvicorn app.main:app --reload
```

## Adding RBAC to New Endpoints

```python
from fastapi import APIRouter, Depends
from app.api.v1.auth import require_role, get_current_active_user
from app.db.models import User

router = APIRouter()

# Admin only
@router.delete("/admin/data/{id}")
def delete_data(id: int, current_user: User = Depends(require_role("admin"))):
    return {"deleted": id}

# Any authenticated user
@router.get("/my-data")
def get_my_data(current_user: User = Depends(get_current_active_user)):
    return {"user": current_user.email}
```

## Environment Setup

```bash
# Create .env file
cat > .env << EOF
JWT_SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=120
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/docai
REDIS_URL=redis://localhost:6379/0
EOF

# Load environment
source .env
```

## Troubleshooting

```bash
# Check if port is in use
lsof -i :8000

# Kill process using port
lsof -ti:8000 | xargs kill -9

# View server logs
python -m uvicorn app.main:app --log-level debug

# Test imports
python -c "from app.main import app; print('✓ App loads')"
```

## API Documentation

```
http://localhost:8000/docs          # Swagger UI (interactive)
http://localhost:8000/redoc         # ReDoc documentation
```

## File Structure

```
app/
├── main.py                 # FastAPI app
├── core/
│   ├── config.py          # Configuration settings
│   ├── security.py        # JWT and password functions
│   └── logging.py         # Logging setup
├── api/
│   └── v1/
│       ├── auth.py        # Authentication endpoints
│       └── health.py      # Health check
├── db/
│   ├── base.py           # SQLAlchemy Base
│   ├── models.py         # User model
│   └── session.py        # Database session
└── schemas/
    └── auth.py           # Request/response schemas
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Port 8000 in use | Process running | `lsof -ti:8000 \| xargs kill -9` |
| "No such table: users" | DB not initialized | Server creates tables automatically |
| "Could not validate credentials" | Invalid/expired token | Get new token via login |
| "Insufficient permissions" | Wrong role | Check user role in DB |
| "Email already registered" | Duplicate user | Use different email or login |

---

**Happy coding! 🚀**
