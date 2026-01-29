# Server Management - Quick Guide

## 🚀 Starting the Server

### Method 1: Using the Startup Script (Recommended)
```bash
./start_server.sh
```

### Method 2: Manual Start
```bash
python -m uvicorn app.main:app --reload
```

### Method 3: Different Port
```bash
python -m uvicorn app.main:app --reload --port 8001
```

---

## 🛑 Stopping the Server

### Method 1: Using the Stop Script
```bash
./stop_server.sh
```

### Method 2: If Running in Foreground
Press `Ctrl+C` in the terminal where server is running

### Method 3: Manual Kill
```bash
lsof -ti:8000 | xargs kill -9
```

---

## 🔄 Restarting the Server

### Using the Restart Script
```bash
./restart_server.sh
```

---

## ❌ Troubleshooting

### Error: "Address already in use"
```bash
# Kill the process using port 8000
./stop_server.sh

# Or manually:
lsof -ti:8000 | xargs kill -9

# Then start again
./start_server.sh
```

### Error: "uvicorn: command not found"
```bash
# Install uvicorn
pip install uvicorn

# Or install all requirements
pip install -r requirements.txt
```

### Error: "No module named 'app'"
```bash
# Make sure you're in the project directory
cd /Users/rohitgupta/repositories/AI-IDP

# Then start the server
./start_server.sh
```

### Error: Database locked
```bash
# Stop the server
./stop_server.sh

# Remove the database (it will be recreated)
rm -f docai.db

# Start again
./start_server.sh
```

### Server starts but endpoints don't work
```bash
# Check if server is actually running
curl http://localhost:8000/api/v1/health

# Should return: {"status":"ok"}
```

---

## 📋 Checking Server Status

### Check if server is running
```bash
# Check process
ps aux | grep uvicorn

# Check port
lsof -i :8000

# Test endpoint
curl http://localhost:8000/api/v1/health
```

### View server logs
Server logs are displayed in the terminal where you started it.

---

## 🌐 Accessing the Server

- **Base URL:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/api/v1/health

---

## 🔐 Quick Test

### Test the server is working
```bash
# Start server
./start_server.sh

# In another terminal, test health endpoint
curl http://localhost:8000/api/v1/health

# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

---

## 💡 Tips

1. **Development:** Use `./start_server.sh` with auto-reload enabled
2. **Background:** Add `&` at the end: `./start_server.sh &`
3. **Production:** Use `--host 0.0.0.0` to accept external connections
4. **Custom Port:** Modify the script or use `--port` flag

---

## 📝 Scripts Summary

| Script | Purpose |
|--------|---------|
| `start_server.sh` | Start the server with auto-reload |
| `stop_server.sh` | Stop the server gracefully |
| `restart_server.sh` | Restart the server (stop + start) |

---

**Ready to start?**

```bash
./start_server.sh
```

Then visit: **http://localhost:8000/docs**
