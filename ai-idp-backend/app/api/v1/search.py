# Search endpoints
from fastapi import APIRouter
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import semantic_search



router = APIRouter(prefix="/search", tags=["Search"])

@router.post("", response_model=SearchResponse)
def search(payload: SearchRequest):
    return SearchResponse(
        results=semantic_search(payload.query, payload.limit)
    )
