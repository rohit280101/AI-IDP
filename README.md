# AI-IDP (Intelligent Document Processing)

End-to-end platform for document ingestion, OCR/NLP enrichment, embeddings, and semantic search.

## Highlights

- Upload PDFs, extract text, and classify content
- Generate embeddings and run semantic search
- React + TypeScript frontend with FastAPI backend

## Repository Structure

```
ai-idp-backend/   # FastAPI backend, DB models, services, workers
ai-idp-frontend/  # React + TypeScript frontend (Vite)
```

## Tech Stack

**Backend**
- FastAPI + SQLAlchemy + Alembic
- SQLite for local development (default)
- Redis/Celery (optional, for background tasks)

**Frontend**
- React 18 + TypeScript
- Vite + Axios + React Router

## Local Development

### Backend

1. Create and activate a virtual environment.
2. Install dependencies:

```
pip install -r ai-idp-backend/requirements.txt
```

3. Run the API server:

```
uvicorn app.main:app --reload
```

The API runs at $http://localhost:8000$.

### Frontend

```
cd ai-idp-frontend
npm install
npm run dev
```

The app runs at $http://localhost:5173$.

## Configuration

### Backend

The backend uses SQLite by default at:

```
ai-idp-backend/docai.db
```

Override with environment variables if needed:

```
DATABASE_URL=sqlite:////absolute/path/to/docai.db
```

### Frontend

Create a `.env` file in ai-idp-frontend/:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Tests

Run backend tests:

```
cd ai-idp-backend
pytest
```

## Notes

- Runtime artifacts (SQLite DB, uploads, vector store indexes, caches) are ignored by git.
- This branch is optimized for local development.
