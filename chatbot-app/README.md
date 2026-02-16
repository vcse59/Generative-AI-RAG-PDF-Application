
# Chatbot App (Frontend)

This is the frontend for the RAG-based Generative AI application, built with React Native Web. It provides a modern chat interface for users to interact with the knowledge base and submit queries.

## Features
- Modern chat UI with avatars and message bubbles
- Upload and query PDF knowledge sources via backend
- Renders citation links returned by the backend
- Responsive design for web
- Connects to backend via configurable environment variable

## Requirements
- Node.js 18+
- npm or yarn
- (Recommended) Modern browser
- See `../config/.env` for all environment variables

## Environment Variables
Set these in `config/.env` (example values):

```
MICROSERVICE_HOST_URL=http://localhost:8000
```

## Running Locally (Windows, Mac, Linux)

1. Clone the repository and navigate to the root folder:
	```bash
	git clone https://github.com/vcse59/Generative-AI-RAG-PDF-Application.git
	cd Generative-AI-RAG-PDF-Application
	```
2. Start Ollama in Docker (required for local runs):
	```bash
	docker build -f Dockerfile.ollama -t ollama-app .
	docker run --rm -it -p 11434:11434 ollama-app
	```
3. Install dependencies:
	```bash
	cd chatbot-app
	npm install
	# or
	yarn install
	```
4. Start the frontend:
	```bash
	npm start
	# or
	yarn start
	```
5. Open http://localhost:8080 in your browser.

## Running in Docker

1. Ensure Docker is installed and running.
2. From the project root, build and start all services:
	```bash
	docker compose up --build -d
	```
	Or to run only the frontend:
	```bash
	docker compose up --build -d chatbot-app
	```

When running via Docker Compose, set `IS_HOST_DOCKER=true` in [config/.env](../config/.env) so citation links resolve to `localhost` in the browser.

## Configuration
- All configuration is managed via `config/.env` and Docker Compose.
- The frontend connects to the backend using the `MICROSERVICE_HOST_URL` variable.

---
See the parent README for full-stack setup and architecture.
