
# RAG (Retrieval-Augmented Generation) Gen AI Application

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
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


## Architecture

![RAG Architecture](RAG%20Architecture.png)

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
        ollama run llama3
        ```
- **Mac OS:**
    - Install via Homebrew:
        ```bash
        brew install ollama
        ollama run llama3
        ```
- **Linux:**
    - Run the official install script:
        ```bash
        curl -fsSL https://ollama.com/install.sh | sh
        ollama run llama3
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
    ollama run llama3
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

The Docker Compose file in the root folder manages all dependencies and services. Use the `--profile` option to select which services to run:

- **Ollama only:**
    ```bash
    docker compose --profile ollama up
    ```
- **Backend only:**
    ```bash
    docker compose --profile chatbot up
    ```
- **Frontend only:**
    ```bash
    docker compose --profile chatapp up
    ```
- **All services:**
    ```bash
    docker compose --profile ollama --profile chatbot --profile chatapp up
    ```

If you omit `--profile`, all services will run by default.

---

## Uploading Knowledge Sources

- Go to [http://localhost:8000/docs](http://localhost:8000/docs) and use the `/upload_pdf` API endpoint to upload a PDF. This converts the PDF content to vector embeddings and saves them to the vector DB (mounted in Docker).

---

## Querying the Chatbot

- Open the chat application ([http://localhost:8080](http://localhost:8080)), click the chat icon in the bottom right, and enter your query.

---

## Project Documentation

- [chatbot-app/README.md](./chatbot-app/README.md): Frontend usage, configuration, and development
- [chatbot-service/README.md](./chatbot-service/README.md): Backend usage, configuration, and development

---

## Support

For issues, open an issue on the [GitHub repository](https://github.com/vcse59/Generative-AI-RAG-PDF-Application/issues).
