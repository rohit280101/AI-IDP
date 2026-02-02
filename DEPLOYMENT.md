# Docker Deployment Guide

This guide covers deploying the AI-IDP application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- At least 4GB RAM available for Docker
- 10GB free disk space

## Quick Start (Development)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-IDP
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development environment**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Production Deployment

### Step 1: Prepare Environment

1. **Switch to deployment branch**
   ```bash
   git checkout deployment
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env  # or use your preferred editor
   ```

   **Critical variables to update:**
   - `POSTGRES_PASSWORD`: Use a strong, unique password
   - `JWT_SECRET_KEY`: Generate a secure random string (min 32 characters)
   - `VITE_API_BASE_URL`: Set to your production API URL

   **Generate secure secrets:**
   ```bash
   # Generate JWT secret
   openssl rand -hex 32

   # Or use Python
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

### Step 2: Build and Deploy

1. **Build the Docker images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start the services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Check service status**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

4. **View logs**
   ```bash
   # All services
   docker-compose -f docker-compose.prod.yml logs -f

   # Specific service
   docker-compose -f docker-compose.prod.yml logs -f backend
   ```

### Step 3: Initialize Database

1. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

2. **Create initial admin user (optional)**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python create_test_user.py
   ```

### Step 4: Configure Nginx (Optional but Recommended)

For production with a reverse proxy:

1. **Enable nginx profile**
   ```bash
   docker-compose -f docker-compose.prod.yml --profile production up -d
   ```

2. **Configure SSL certificates**
   - Place SSL certificates in `./nginx/ssl/`
   - Update `nginx/nginx.conf` with your domain
   - Uncomment the HTTPS server block

3. **Using Let's Encrypt**
   ```bash
   # Install certbot
   sudo apt-get install certbot  # Ubuntu/Debian
   brew install certbot          # macOS

   # Obtain certificate
   sudo certbot certonly --standalone -d yourdomain.com

   # Copy certificates
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/key.pem
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | PostgreSQL password | `secure_password_123` |
| `DATABASE_URL` | Database connection string | `postgresql://postgres:password@db:5432/ai_idp` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `your-secret-key` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379/0` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration | `60` |
| `UPLOAD_RATE_LIMIT` | Upload requests per window | `10` |
| `UPLOAD_RATE_WINDOW` | Rate limit window (seconds) | `60` |
| `SEARCH_RATE_LIMIT` | Search requests per window | `30` |
| `SEARCH_RATE_WINDOW` | Rate limit window (seconds) | `60` |
| `VITE_API_BASE_URL` | Frontend API URL | `http://localhost:8000/api/v1` |

## Docker Compose Profiles

### Development (`docker-compose.yml`)
- Hot reload enabled
- Volume mounts for live code updates
- Debug mode
- Exposed ports for direct access

### Production (`docker-compose.prod.yml`)
- Optimized builds
- No volume mounts for code
- Production-ready configurations
- Optional nginx reverse proxy

## Managing the Application

### Starting Services
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# With nginx (production)
docker-compose -f docker-compose.prod.yml --profile production up -d
```

### Stopping Services
```bash
# Development
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml down

# Remove volumes (WARNING: deletes all data)
docker-compose -f docker-compose.prod.yml down -v
```

### Viewing Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Restarting Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Updating the Application
```bash
# Pull latest code
git pull origin deployment

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Recreate containers
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Backup and Restore

### Database Backup
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres ai_idp > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using docker exec
docker exec ai-idp-db pg_dump -U postgres ai_idp > backup.sql
```

### Database Restore
```bash
# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres ai_idp < backup.sql

# Or using docker exec
docker exec -i ai-idp-db psql -U postgres ai_idp < backup.sql
```

### Volume Backup
```bash
# Backup all volumes
docker run --rm -v ai-idp_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
docker run --rm -v ai-idp_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz /data
```

## Monitoring and Health Checks

### Check Service Health
```bash
# Check all containers
docker-compose -f docker-compose.prod.yml ps

# Check specific service health
docker inspect ai-idp-backend --format='{{.State.Health.Status}}'
```

### Health Endpoints
- Backend: `http://localhost:8000/api/v1/health`
- Database: Automatic health checks configured
- Redis: Automatic health checks configured

### Resource Usage
```bash
# View resource usage
docker stats

# Specific containers
docker stats ai-idp-backend ai-idp-frontend ai-idp-db
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Recreate container
docker-compose -f docker-compose.prod.yml up -d --force-recreate backend
```

### Database Connection Issues
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps db

# Test database connection
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "SELECT 1"

# Check environment variables
docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE
```

### Permission Issues
```bash
# Fix upload directory permissions
sudo chown -R 1000:1000 uploads/

# Fix volume permissions
docker-compose -f docker-compose.prod.yml exec backend chown -R root:root /app/uploads
```

### Clear All Data and Restart
```bash
# Stop and remove everything
docker-compose -f docker-compose.prod.yml down -v

# Remove all related images
docker rmi $(docker images | grep ai-idp | awk '{print $3}')

# Start fresh
docker-compose -f docker-compose.prod.yml up -d
```

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong passwords** - Minimum 16 characters, mix of alphanumeric and symbols
3. **Change default secrets** - Always change JWT_SECRET_KEY and POSTGRES_PASSWORD
4. **Enable HTTPS** - Use SSL/TLS in production
5. **Regular updates** - Keep Docker images and dependencies updated
6. **Limit network exposure** - Use firewall rules to restrict access
7. **Monitor logs** - Regularly check logs for suspicious activity
8. **Backup regularly** - Automate database and volume backups

## Production Checklist

- [ ] Environment variables configured with production values
- [ ] Strong, unique passwords set for all services
- [ ] JWT secret key changed from default
- [ ] SSL certificates obtained and configured
- [ ] Nginx reverse proxy configured (if using)
- [ ] Database backup strategy implemented
- [ ] Firewall rules configured
- [ ] Domain DNS configured
- [ ] Health monitoring set up
- [ ] Log aggregation configured
- [ ] Resource limits set for containers
- [ ] Auto-restart policies configured

## Scaling

### Horizontal Scaling

For high availability, consider:

1. **Load balancer** - Use nginx or cloud load balancer
2. **Multiple backend instances** - Scale backend service
3. **Managed database** - Use cloud PostgreSQL (AWS RDS, Google Cloud SQL)
4. **Managed Redis** - Use cloud Redis (ElastiCache, Redis Cloud)

Example scaling backend:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Cloud Deployment

### AWS
- Use ECS/Fargate for container orchestration
- RDS for PostgreSQL
- ElastiCache for Redis
- ALB for load balancing
- S3 for file storage

### Google Cloud
- Use Cloud Run or GKE
- Cloud SQL for PostgreSQL
- Memorystore for Redis
- Cloud Load Balancing

### Azure
- Use Container Instances or AKS
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Load Balancer

## Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Check existing issues on GitHub
4. Create a new issue with logs and configuration (redact sensitive info)

## License

[Your License Here]
