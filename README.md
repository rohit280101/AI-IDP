# AI-IDP - AI Document Processing Platform

Document AI processing platform with OCR, NLP, embedding, and search capabilities.

## Features

- 📄 Document upload and processing
- 🔍 Semantic search with vector embeddings
- 🤖 AI-powered text classification
- 🔒 JWT-based authentication
- 📊 Document management and tracking
- ⚡ Redis-based caching and rate limiting
- 🐳 Docker containerization for easy deployment

## Quick Start

### Local Development

See individual component READMEs:
- Backend: [ai-idp-backend/README.md](ai-idp-backend/README.md)
- Frontend: [ai-idp-frontend/README.md](ai-idp-frontend/README.md)

### Docker Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick deployment:**

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-IDP

# Switch to deployment branch
git checkout deployment

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run deployment script
./deploy.sh
```

Or manually:

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL │
│   (React)   │     │  (FastAPI)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │   (Cache)   │
                    └─────────────┘
```

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- Redis
- Alembic (migrations)
- Celery (background tasks)

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS (or your CSS framework)

### Infrastructure
- Docker & Docker Compose
- Nginx (optional reverse proxy)

## Documentation

- [Deployment Guide](DEPLOYMENT.md) - Comprehensive Docker deployment guide
- [Authentication Implementation](ai-idp-frontend/AUTH_IMPLEMENTATION.md)
- [Rate Limiting](ai-idp-backend/RATE_LIMITING.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Your License Here]
