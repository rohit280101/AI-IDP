import faiss

# Use dimension 384 to match the embedding model output
faiss_index = faiss.IndexFlatL2(384)
index_to_doc_id: list[int] = []
