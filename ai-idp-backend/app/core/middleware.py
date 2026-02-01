import uuid
from fastapi import Request

import time
import logging

logger = logging.getLogger(__name__)



async def add_trace_id(request: Request, call_next):
    trace_id = str(uuid.uuid4())
    request.state.trace_id = trace_id

    response = await call_next(request)
    response.headers["X-Trace-Id"] = trace_id
    return response

async def add_timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start

    trace_id = getattr(request.state, "trace_id", "unknown")

    logger.info(
        f"[TRACE {trace_id}] {request.method} {request.url.path} "
        f"took {duration:.3f}s"
    )

    return response