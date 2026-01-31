import logging
import sys

LOG_FORMAT = (
    "%(asctime)s | %(levelname)s | %(name)s | "
    "trace_id=%(trace_id)s | %(message)s"
)

class TraceIdFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, "trace_id"):
            record.trace_id = "N/A"
        return True

def setup_logging():
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(LOG_FORMAT))

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.handlers = [handler]
    root.addFilter(TraceIdFilter())
