
# RAG (Retrieval-Augmented Generation) Gen AI Application

## Table of Contents
- [Overview](#overview)
- [API Quickstart](#api-quickstart)
- [Architecture](#architecture)
- [End-to-End Flow](#end-to-end-flow)
- [Components](#components)
- [Configuration](#configuration)
- [Setup & Running Locally](#setup--running-locally)
- [Running in Docker](#running-in-docker)
- [Uploading Knowledge Sources](#uploading-knowledge-sources)
- [Querying the Chatbot](#querying-the-chatbot)
- [Project Documentation](#project-documentation)
- [Support](#support)


## Overview
This project is a Generative AI application using the RAG (Retrieval-Augmented Generation) approach. It enables you to upload PDF documents, which are converted into vector embeddings for efficient retrieval. When you ask a question via the chat interface, the system finds relevant information from your PDFs and generates a context-aware answer using a Large Language Model (LLM) powered by Ollama.

**Key Features:**
- Upload and ingest PDFs as knowledge sources
- Fast semantic search using vector embeddings
- LLM-powered, context-rich answers
- Modular architecture: frontend, backend, and model services (Docker Compose)
- Modern, intuitive chat interface

---


## API Quickstart

```bash
# Upload a PDF
curl -X POST "http://localhost:8000/upload/" \
    -H "accept: application/json" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@./pdf_docs/handbook.pdf"

# Ask a question
curl -X POST "http://localhost:8000/generate" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"What is the leave policy?\"}"

# Open the original PDF
curl -O "http://localhost:8000/pdf/handbook.pdf"
```

Base URLs:
- Local (default): API `http://localhost:8000`, UI `http://localhost:8080`, Ollama `http://localhost:11434`
- Docker Compose: API `http://localhost:8000`, UI `http://localhost:8080`, Ollama `http://localhost:11434` (or the `OLLAMA_HOST` you set in `config/.env`)

---


## Architecture

![RAG Architecture](RAG%20Architecture.png)

---


## End-to-End Flow

```
User/Browser         Chat UI           FastAPI Backend         Vector DB         Ollama
         |                  |                    |                    |                |
         | 1. Upload PDF    |                    |                    |                |
         |----------------->|  POST /upload/     |                    |                |
         |                  |------------------->|  chunk + embed     |                |
         |                  |                    |-----> store -----> |                |
         |                  |                    |<----- ok ----------|                |
         |                  |<-------------------|  200 + download_link|               |
         |                  |                    |                    |                |
         | 2. Ask question  |  POST /generate    |                    |                |
         |----------------->|------------------->|  query vectors      |                |
         |                  |                    |-----> search ----->|                |
         |                  |                    |<----- chunks ------|                |
         |                  |                    |  /api/generate --->|-----> LLM ----->|
         |                  |                    |<----- response ---------------------|
         |                  |<-------------------|  200 + response + citations          |
```

1. **Start services:** Run Ollama, the backend (FastAPI), and the frontend (React Native Web) locally or via Docker Compose.
2. **Upload PDFs (API):** `POST /upload/` with multipart form data.
     - **Request (multipart/form-data):** field name `file` with a PDF.
     - **Response (JSON):**
         ```json
         {
             "message": "Processed 12 chunks from handbook.pdf",
             "download_link": "http://localhost:8000/pdf/handbook.pdf"
         }
         ```
3. **Store vectors:** The backend chunks text, calls Ollama embeddings at `POST /api/embeddings`, and stores vectors in ChromaDB.
4. **Ask a question (API):** `POST /generate` with JSON payload.
     - **Request (application/json):**
         ```json
         {
             "prompt": "What is the leave policy?"
         }
         ```
     - **Response (JSON):**
         ```json
         {
             "response": "The leave policy allows ...",
             "citation_links": [
                 {
                     "url": "http://localhost:8000/pdf/handbook.pdf",
                     "title": "handbook.pdf"
                 }
             ]
         }
         ```
5. **Retrieve context:** The backend queries ChromaDB for top matches and builds a context prompt.
6. **Generate answer:** The backend calls Ollama `POST /api/generate` with the context-augmented prompt.
7. **Return response:** The backend returns the answer and citations; the UI renders them. PDFs are served via `GET /pdf/{filename}`.
8. **Iterate:** Users can continue asking follow-up questions; the pipeline repeats with new context retrieval.

---


## Components

- **Frontend:** [chatbot-app](./chatbot-app) (React Native Web)
- **Backend:** [chatbot-service](./chatbot-service) (FastAPI)
- **LLM & Embeddings:** Ollama (local or Docker)

---


## Configuration

All configuration is managed via `config/.env` and Docker Compose. Example:

```
OLLAMA_EMBED_MODEL_NAME=nomic-embed-text
OLLAMA_LLM_MODEL_NAME=llama3.2:3b
IS_HOST_DOCKER=false
MICROSERVICE_HOST_URL=http://localhost:8000
OLLAMA_HOST=http://localhost:11434
```

The backend pulls the configured Ollama models on startup. The first run may take a few minutes while models download. If you prefer to pre-pull models, run:

```bash
ollama pull llama3.2:3b
ollama pull nomic-embed-text
```

---



## Setup & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/vcse59/Generative-AI-RAG-PDF-Application.git
cd Generative-AI-RAG-PDF-Application
```

### 2. Install Ollama (Required for LLM)

- **Windows:**
    - Download and install from [Ollama Downloads](https://ollama.com/download)
    - Open a terminal and run:
        ```powershell
        ollama run llama3.2:3b
        ```
- **Mac OS:**
    - Install via Homebrew:
        ```bash
        brew install ollama
        ollama run llama3.2:3b
        ```
- **Linux:**
    - Run the official install script:
        ```bash
        curl -fsSL https://ollama.com/install.sh | sh
        ollama run llama3.2:3b
        ```

See the [Ollama installation guide](https://ollama.com/download) for details.

### 3. Install npm (Node.js) for your OS

- **Windows:**
    - Download and install Node.js from [nodejs.org](https://nodejs.org/) (includes npm)
    - Verify:
        ```powershell
        node -v
        npm -v
        ```
- **Mac OS:**
    - Install via Homebrew:
        ```bash
        brew install node
        node -v
        npm -v
        ```
- **Linux (Debian/Ubuntu):**
    - Install:
        ```bash
        sudo apt update
        sudo apt install nodejs npm
        node -v
        npm -v
        ```

### 4. Start backend (chatbot-service)
```bash
cd chatbot-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. Start frontend (chatbot-app)
```bash
cd ../chatbot-app
npm install
npm start
# or
yarn start
```

### 6. Access the application
- Chat UI: [http://localhost:8080](http://localhost:8080)
- Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Running Locally (Windows, Mac, Linux)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/vcse59/Generative-AI-RAG-PDF-Application.git
    cd Generative-AI-RAG-PDF-Application
    ```
2. **Start Ollama:** (see above for OS-specific instructions)
    ```bash
    ollama run llama3.2:3b
    ```
   (Leave this terminal running, or run Ollama as a background service.)
3. **Set up the backend (chatbot-service):**
    ```bash
    cd chatbot-service
    python -m venv .venv
    # On Windows:
    .venv\Scripts\activate
    # On Mac/Linux:
    source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
4. **Set up npm (Node.js) for your OS:**

    - **Windows:**
      1. Download and install Node.js from [nodejs.org](https://nodejs.org/). This includes npm.
      2. Verify installation:
          ```powershell
          node -v
          npm -v
          ```

    - **Mac OS:**
      1. Install Node.js and npm via Homebrew:
          ```bash
          brew install node
          ```
      2. Verify installation:
          ```bash
          node -v
          npm -v
          ```

    - **Linux (Debian/Ubuntu):**
      1. Install Node.js and npm:
          ```bash
          sudo apt update
          sudo apt install nodejs npm
          ```
      2. Verify installation:
          ```bash
          node -v
          npm -v
          ```

5. **Set up the frontend (chatbot-app):**
     ```bash
     cd ../chatbot-app
     npm install
     npm start
     # or
     yarn start
     ```
5. **Access the application:**
    - Open http://localhost:8080 in your browser for the chat UI.
    - Open http://localhost:8000/docs for backend API docs.

---


## Running in Docker

The Docker Compose file in the root folder manages all dependencies and services.

- **All services (build + run):**
    ```bash
    docker compose up --build
    ```
- **Ollama only:**
    ```bash
    docker compose up --build ollama
    ```
- **Backend only:**
    ```bash
    docker compose up --build chatbot-service
    ```
- **Frontend only:**
    ```bash
    docker compose up --build chatbot-app
    ```

---

## Uploading Knowledge Sources

- Go to [http://localhost:8000/docs](http://localhost:8000/docs) and use the `/upload/` API endpoint to upload a PDF. This converts the PDF content to vector embeddings and saves them to the vector DB (mounted in Docker).

Example (multipart form upload):
```bash
curl -X POST "http://localhost:8000/upload/" \
    -H "accept: application/json" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@./pdf_docs/handbook.pdf"
```

Example response:
```json
{
    "message": "Processed 12 chunks from handbook.pdf",
    "download_link": "http://localhost:8000/pdf/handbook.pdf"
}
```

Note: You can access uploaded files directly using `GET /pdf/{filename}`.

---

## Querying the Chatbot

- Open the chat application ([http://localhost:8080](http://localhost:8080)), click the chat icon in the bottom right, and enter your query.
- Or call the API directly at `POST /generate` with JSON payload:

```bash
curl -X POST "http://localhost:8000/generate" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"What is the leave policy?\"}"
```

Example response:
```json
{
    "response": "The leave policy allows ...",
    "citation_links": [
        {
            "url": "http://localhost:8000/pdf/handbook.pdf",
            "title": "handbook.pdf"
        }
    ]
}
```

---

## Project Documentation

- [chatbot-app/README.md](./chatbot-app/README.md): Frontend usage, configuration, and development
- [chatbot-service/README.md](./chatbot-service/README.md): Backend usage, configuration, and development

---

## Support

For issues, open an issue on the [GitHub repository](https://github.com/vcse59/Generative-AI-RAG-PDF-Application/issues).
