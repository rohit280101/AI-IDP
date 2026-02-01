# Search endpoints
from fastapi import APIRouter, Depends, Request
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import semantic_search
from app.core.rate_limiter import RateLimitDependency
from app.core.config import settings


router = APIRouter(prefix="/search", tags=["Search"])

@router.post("", response_model=SearchResponse)
def search(
    request: Request,
    payload: SearchRequest,
    rate_limit_headers: dict = Depends(
        RateLimitDependency(
            max_requests=settings.SEARCH_RATE_LIMIT,
            window=settings.SEARCH_RATE_WINDOW
        )
    ),
):
    return SearchResponse(
        results=semantic_search(payload.query, payload.limit)
    )
