from pathlib import Path
import uuid

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def save_file(file_bytes: bytes, filename: str) -> str:
    ext = filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"
    path = UPLOAD_DIR / unique_name

    with open(path, "wb") as f:
        f.write(file_bytes)

    return str(path)
