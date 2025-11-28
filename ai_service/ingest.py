import os
import uuid
from langchain_community.document_loaders import PyMuPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from rag_engine import VectorStore # Import from the file we just made

# SETUP PATHS
PDF_FOLDER = "./data_source" # Put your .pdf files here

def ingest_data():
    print(f"🔄 Scanning {PDF_FOLDER} for PDFs...")
    
    # 1. Load PDFs
    if not os.path.exists(PDF_FOLDER):
        os.makedirs(PDF_FOLDER)
        print(f"⚠️ Created folder {PDF_FOLDER}. Please put PDF files there and run this again.")
        return

    loader = DirectoryLoader(PDF_FOLDER, glob="**/*.pdf", loader_cls=PyMuPDFLoader)
    raw_docs = loader.load()
    print(f"✅ Loaded {len(raw_docs)} pages.")

    # 2. Split Text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(raw_docs)
    print(f"✂️ Split into {len(chunks)} chunks.")

    # 3. Save to Vector DB
    db = VectorStore()
    
    docs_text = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]
    ids = [str(uuid.uuid4()) for _ in chunks]

    print("💾 Saving to ChromaDB (this might take a moment)...")
    db.add_documents(docs_text, metadatas, ids)
    print("🚀 Ingestion Complete! RAG is ready.")

if __name__ == "__main__":
    ingest_data()