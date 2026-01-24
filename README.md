# RAG (Retrieval-augmented generation) based Gen AI application

- [Overview](#overview)
- [Architecture](#rag-retrieval-augmented-generation-architecture)
- [Components](#components)
- [Configuration](#configuration)
- [Running Locally](#running-locally-windows-mac-linux)
- [Running in Docker](#running-in-docker)
- [Update the knowledge source](#update-the-knowledge-source)
- [Process the user query](#process-the-user-query)

## Overview
This project is a Generative AI application that leverages the RAG (Retrieval-augmented Generation) approach to provide intelligent responses based on custom knowledge sources. The application allows you to upload PDF documents, which are processed and converted into vector embeddings stored in a vector database. When a user submits a query through the chat interface, the system retrieves relevant information from the uploaded PDFs using semantic search, and then generates a context-aware answer using a Large Language Model (LLM) such as Ollama.

Key features include:
- Seamless PDF upload and ingestion as knowledge sources.
- Automated conversion of document content into vector embeddings for efficient retrieval.
- Integration with an LLM to generate accurate, context-rich responses.
- Modular architecture with separate services for frontend, backend, and model inference, orchestrated via Docker Compose.
- Easy-to-use chat interface for end users to interact with the knowledge base.

---

## RAG (Retrieval-augmented generation) Architecture

![RAG (Retrieval-augmented generation) Architecture](RAG%20Architecture.png)

---

# Components

Here are the components used in this application:

- **Frontend application** ([chatbot-app](./chatbot-app))
- **Microservice application** ([chatbot-service](./chatbot-service))
- **Ollama LLM and Embedding Model**

---

## Configuration

All configuration is managed via the `config/.env` file and Docker Compose. Example `config/.env`:

```
OLLAMA_EMBED_MODEL_NAME=nomic-embed-text
OLLAMA_LLM_MODEL_NAME=llama3.2:3b
IS_HOST_DOCKER=false
MICROSERVICE_HOST_URL=http://localhost:8000
OLLAMA_HOST=http://localhost:11434
```

---

## Running Locally (Windows, Mac, Linux)

1. Clone the repository:
    ```bash
    git clone https://github.com/vcse59/Generative-AI-RAG-PDF-Application.git
    cd Generative-AI-RAG-PDF-Application
    ```
2. Set up the backend (chatbot-service):
    ```bash
    cd chatbot-service
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
3. Set up the frontend (chatbot-app):
    ```bash
    cd ../chatbot-app
    npm install
    npm start
    # or
    yarn start
    ```
4. Ensure Ollama is running locally (see https://ollama.com/ for installation instructions).
5. Open http://localhost:8080 in your browser for the chat UI.
6. Open http://localhost:8000/docs for backend API docs.

---

## Running in Docker

The Docker Compose file in the root folder manages all dependencies and services.

You can use the `--profile` option to choose which services to run. For example:
- To run only the ollama service:
    ```
    docker compose --profile ollama up
    ```

- To run only the chatbot-service:
    ```
    docker compose --profile chatbot up
    ```

- To run only the chatapp (frontend) service:
    ```
    docker compose --profile chatapp up
    ```

- To run multiple services (e.g., ollama, chatbot, and chatapp):
    ```
    docker compose --profile ollama --profile chatbot --profile chatapp up
    ```



## Update the knowledge source



## Process the user query


If you omit `--profile`, all services will run by default.

---

## Update the knowledge source

- Open http://localhost:8000/docs and use the `/upload_pdf` API endpoint to upload a PDF file. This converts the PDF content to vector embeddings and saves them to the vector DB (mounted in Docker).

---

## Process the user query

- Open the chat application (http://localhost:8080) and click on the chat icon in the bottom right corner to open the chat dialog. Enter your query based on the configured knowledge source.

---

## Project-specific Documentation

- [chatbot-app/README.md](./chatbot-app/README.md): Frontend usage, configuration, and development
- [chatbot-service/README.md](./chatbot-service/README.md): Backend usage, configuration, and development

---

## Support

For issues, please open an issue on the [GitHub repository](https://github.com/vcse59/Generative-AI-RAG-PDF-Application/issues).
