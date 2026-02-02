# Quick Deployment Reference

## Initial Setup

```bash
# 1. Switch to deployment branch
git checkout deployment

# 2. Configure environment
cp .env.example .env
nano .env  # Update passwords and secrets

# 3. Deploy
./deploy.sh
```

## Common Commands

### Start Services
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Production with Nginx
docker-compose -f docker-compose.prod.yml --profile production up -d
```

### Stop Services
```bash
docker-compose down
# or
docker-compose -f docker-compose.prod.yml down
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Service
```bash
docker-compose restart backend
```

### Update Application
```bash
git pull origin deployment
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create backup
docker exec ai-idp-db pg_dump -U postgres ai_idp > backup.sql

# Restore backup
docker exec -i ai-idp-db psql -U postgres ai_idp < backup.sql
```

### Monitoring
```bash
# Check status
docker-compose ps

# Resource usage
docker stats

# Health check
curl http://localhost:8000/api/v1/health
```

## Environment Variables (Required)

```bash
# Database
POSTGRES_PASSWORD=<strong-password>
DATABASE_URL=postgresql://postgres:<password>@db:5432/ai_idp

# Security
JWT_SECRET_KEY=<generate-with-openssl-rand-hex-32>

# API URL (for production)
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose up -d --force-recreate backend
```

### Permission issues
```bash
sudo chown -R 1000:1000 uploads/
```

### Clear and restart
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

## URLs

- **Development Frontend**: http://localhost:5173
- **Development Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Production (with Nginx)**: http://localhost

## Security Checklist

- [ ] Changed default JWT_SECRET_KEY
- [ ] Changed default POSTGRES_PASSWORD
- [ ] Updated VITE_API_BASE_URL for production domain
- [ ] Configured SSL certificates (production)
- [ ] Set up firewall rules
- [ ] Enabled HTTPS (production)
- [ ] Configured backup strategy

## Getting Help

Full documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
