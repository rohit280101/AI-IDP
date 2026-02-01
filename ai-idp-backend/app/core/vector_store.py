import faiss
import os
import pickle

DIMENSION = 384
BASE_PATH = "app/storage/vector_store"

INDEX_PATH = f"{BASE_PATH}/faiss.index"
MAP_PATH = f"{BASE_PATH}/index_to_doc.pkl"

faiss_index = faiss.IndexFlatIP(DIMENSION)
index_to_doc_id: list[str] = []


def save_vector_store():
    os.makedirs(BASE_PATH, exist_ok=True)
    faiss.write_index(faiss_index, INDEX_PATH)

    with open(MAP_PATH, "wb") as f:
        pickle.dump(index_to_doc_id, f)

def load_vector_store():
    global faiss_index, index_to_doc_id

    if os.path.exists(INDEX_PATH):
        faiss_index = faiss.read_index(INDEX_PATH)

    if os.path.exists(MAP_PATH):
        with open(MAP_PATH, "rb") as f:
            index_to_doc_id = pickle.load(f)
