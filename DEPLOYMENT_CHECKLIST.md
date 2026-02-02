# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment

### Environment Setup
- [ ] Server/VM/Cloud instance provisioned (minimum 4GB RAM, 10GB storage)
- [ ] Docker Engine installed (version 20.10+)
- [ ] Docker Compose installed (version 2.0+)
- [ ] Git installed
- [ ] Domain name configured (if using custom domain)
- [ ] DNS records pointing to your server

### Code Preparation
- [ ] Cloned repository to deployment server
- [ ] Checked out `deployment` branch
- [ ] Reviewed all documentation

### Configuration
- [ ] Created `.env` file from `.env.example`
- [ ] Updated `POSTGRES_PASSWORD` with strong password
- [ ] Generated and set `JWT_SECRET_KEY` (min 32 characters)
- [ ] Updated `DATABASE_URL` with correct password
- [ ] Set `VITE_API_BASE_URL` to production API URL
- [ ] Reviewed rate limiting settings

### Security (Critical!)
- [ ] All default passwords changed
- [ ] JWT secret is unique and never committed to git
- [ ] `.env` file is in `.gitignore`
- [ ] SSL certificates obtained (for HTTPS)
- [ ] Firewall configured (if applicable)

## ✅ Deployment

### Build & Start
- [ ] Run: `docker-compose -f docker-compose.prod.yml build`
- [ ] Run: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] All containers started successfully

### Database Setup
- [ ] Database migrations completed: `docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head`
- [ ] Test user created (optional): `docker-compose -f docker-compose.prod.yml exec backend python create_test_user.py`

### Health Checks
- [ ] Backend health endpoint responds: `curl http://localhost:8000/api/v1/health`
- [ ] Frontend loads in browser
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can upload a document
- [ ] Can search documents

### Nginx Setup (Optional but Recommended)
- [ ] SSL certificates placed in `nginx/ssl/`
- [ ] Updated `nginx/nginx.conf` with domain name
- [ ] Uncommented HTTPS configuration
- [ ] Started with profile: `docker-compose -f docker-compose.prod.yml --profile production up -d`

## ✅ Post-Deployment

### Monitoring
- [ ] All containers running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] No errors in logs: `docker-compose -f docker-compose.prod.yml logs`
- [ ] Health endpoints accessible
- [ ] Resource usage acceptable: `docker stats`

### Backup Strategy
- [ ] Database backup script created
- [ ] Backup schedule configured (daily recommended)
- [ ] Backup storage configured (offsite/cloud)
- [ ] Tested restore procedure

### Documentation
- [ ] Documented your specific deployment details
- [ ] Noted any custom configurations
- [ ] Created runbook for common operations
- [ ] Team trained on basic operations

### Security Hardening
- [ ] HTTPS enabled and working
- [ ] Firewall rules in place
- [ ] Rate limiting tested and working
- [ ] Security headers verified (in nginx)
- [ ] Log rotation configured
- [ ] Monitoring/alerting set up

## ✅ Ongoing Operations

### Daily
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor disk space

### Weekly
- [ ] Review application logs
- [ ] Check backup completion
- [ ] Monitor resource usage trends

### Monthly
- [ ] Test backup restoration
- [ ] Update dependencies (if needed)
- [ ] Review security logs
- [ ] Check for Docker image updates

## 🆘 Emergency Contacts & Resources

### Quick Commands
```bash
# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart service
docker-compose -f docker-compose.prod.yml restart backend

# Full restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Documentation
- Full Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Quick Reference: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- Summary: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

### Rollback Plan
```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Switch to previous working version
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Restore database if needed
docker exec -i ai-idp-db psql -U postgres ai_idp < backup.sql
```

## 📊 Success Criteria

Your deployment is successful when:
- ✅ All services show "healthy" status
- ✅ Frontend accessible and functional
- ✅ Backend API responding correctly
- ✅ Users can register and login
- ✅ Documents can be uploaded
- ✅ Search functionality works
- ✅ HTTPS working (if configured)
- ✅ Backups completing successfully
- ✅ No critical errors in logs

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Branch**: deployment

**Note**: Check off items as you complete them. Keep this checklist for future deployments!
