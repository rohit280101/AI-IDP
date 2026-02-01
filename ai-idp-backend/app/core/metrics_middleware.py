import time
from fastapi import Request
from app.metrics import REQUEST_COUNT, REQUEST_LATENCY

async def metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    REQUEST_COUNT.labels(
        request.method,
        request.url.path,
        response.status_code
    ).inc()

    REQUEST_LATENCY.labels(
        request.url.path
    ).observe(duration)

    return response
