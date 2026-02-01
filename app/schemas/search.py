from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
	query: str = Field(..., min_length=1)
	limit: int = Field(5, ge=1, le=50)


class SearchResult(BaseModel):
	document_id: int
	score: float
	snippet: str
	classification: str | None = None


class SearchResponse(BaseModel):
	results: list[SearchResult]