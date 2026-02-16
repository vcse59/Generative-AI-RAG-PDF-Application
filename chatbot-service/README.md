# Chatbot Service (Backend)

This is the backend microservice for the RAG-based Generative AI application. It is built with FastAPI and provides endpoints for PDF upload, vector embedding, semantic search, and LLM-powered answer generation.

## Features
- Upload and process PDF documents as knowledge sources
- Store vector embeddings in a local vector database (ChromaDB)
- Query using semantic search and generate answers with an LLM (Ollama)
- CORS enabled for frontend integration

## Requirements
- Python 3.10+
- pip
- (Recommended) Virtual environment tool (venv, conda, etc.)
- Ollama running locally or in Docker (see below)
- See `../config/.env` for all environment variables

## Environment Variables
Set these in `config/.env` (example values):

```
OLLAMA_EMBED_MODEL_NAME=nomic-embed-text
OLLAMA_LLM_MODEL_NAME=llama3.2:3b
OLLAMA_HOST=http://localhost:11434
IS_HOST_DOCKER=false
```

The service pulls the configured Ollama models on startup. The first run may take a few minutes while models download.

## Running Locally (Windows, Mac, Linux)

1. Clone the repository and navigate to the root folder:
   ```bash
   git clone https://github.com/vcse59/Generative-AI-RAG-PDF-Application.git
   cd Generative-AI-RAG-PDF-Application
   ```
2. Set up Python environment:
   ```bash
   cd chatbot-service
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Ensure Ollama is running (see parent README for setup).
4. Start the backend:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Running in Docker

1. Ensure Docker is installed and running.
2. From the project root, build and start all services:
   ```bash
   docker compose up --build -d
   ```
   Or to run only the backend:
   ```bash
   docker compose up --build -d chatbot-service
   ```

## API Endpoints
- `/upload/` - Upload a PDF document and store chunks + embeddings
- `/generate` - Query the knowledge base and get an answer with citations
- `/pdf/{filename}` - Download a previously uploaded PDF
- `/` - Health check

## Configuration
- All configuration is managed via `config/.env` and Docker Compose.
- PDF and vector DB storage are persisted in Docker volumes.

---
See the parent README for full-stack setup and architecture.
