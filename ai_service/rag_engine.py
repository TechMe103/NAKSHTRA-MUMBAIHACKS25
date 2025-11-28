import os
import chromadb
import logging
from typing import List, Any
from sentence_transformers import SentenceTransformer
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

# --- 1. EMBEDDING MANAGER (Handles Text-to-Numbers) ---
class EmbeddingManager:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        
    def get_embeddings(self, texts: List[str]) -> Any:
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text: str) -> Any:
        return self.model.encode([text], convert_to_numpy=True).tolist()[0]

# --- 2. VECTOR STORE (Handles ChromaDB) ---
class VectorStore:
    def __init__(self, collection_name: str = "finadapt_docs", persist_dir: str = "./rag_data/vector_store"):
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_documents(self, documents: List[str], metadatas: List[dict], ids: List[str]):
        embeddings = EmbeddingManager().get_embeddings(documents)
        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query_embedding: list, top_k: int = 5):
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

# --- 3. THE RAG LOGIC (The "Thinking" Part) ---
def get_rag_response(user_query: str):
    try:
        # Initialize components
        embedder = EmbeddingManager()
        db = VectorStore()
        
        # 1. Expand Query (Hybrid Search Logic from Notebook)
        expanded_queries = [user_query]
        if any(x in user_query.lower() for x in ["how", "what", "explain", "plan"]):
             expanded_queries.append(f"Detailed explanation of {user_query}")

        # 2. Retrieve Documents
        unique_results = {}
        for q in expanded_queries:
            q_embed = embedder.embed_query(q)
            results = db.search(q_embed, top_k=3)
            
            if results['documents']:
                for i, doc_text in enumerate(results['documents'][0]):
                    doc_id = results['ids'][0][i]
                    if doc_id not in unique_results:
                        unique_results[doc_id] = doc_text

        # 3. Construct Context
        context_text = "\n\n".join(unique_results.values())
        if not context_text:
            return "I couldn't find specific details in my knowledge base, but I can try to answer based on general financial principles."

        # 4. Ask Groq (Llama 3 70B)
        llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.1
        )
        
        prompt = f"""
        You are FinAdapt's expert financial AI. Use the context below to answer the user's question.
        
        CONTEXT FROM DOCUMENTS:
        {context_text}
        
        USER QUESTION: {user_query}
        
        Answer professionally and concisely. If the context doesn't have the answer, admit it.
        """
        
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        return f"Error in RAG Engine: {str(e)}"