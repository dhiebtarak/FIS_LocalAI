
# FIS_LocalAI

A Flask-based web application with an Angular front-end interface for interacting with local AI models (LLMs) using Ollama for model serving. This project is in Alpha phase and open to contributions. Created by [@dhiebtarak].

## Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Downloading and Setup Instructions](#downloading-and-setup-instructions)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install Docker and Docker Compose](#step-2-install-docker-and-docker-compose)
  - [Step 3: Build and Run with Docker Compose](#step-3-build-and-run-with-docker-compose)
- [Model Download and Customization](#model-download-and-customization)
- [Application User Guide](#application-user-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multiple Model Support:** Switch between different local LLM models (e.g., deepseek-r1, qwen2.5, codellama, etc.) via a dropdown.
- **Streaming Responses:** View AI responses in real time as they are generated.
- **Futuristic UI:** Features a 3D cube animation in the background, powered by an Angular front-end.
- **Keyboard Shortcuts:**
  - `Shift+Enter`: Add a new line in the input fields.
  - `Enter`: Send your message to the AI.
- **Cross-Platform:** Compatible with Windows, Linux, and macOS.
- **Dockerized Deployment:** Run the backend, front-end, and Ollama services seamlessly with Docker Compose.

## System Requirements

- **Docker:** Version 20.10+ with Docker Compose support.
- **NVIDIA GPU (Optional):** For GPU acceleration (requires NVIDIA Container Toolkit installed).
- **Hardware:**
  - **Minimum:** 8GB RAM (for smaller models).
  - **Recommended:** 16GB+ RAM + NVIDIA GPU (for larger models).
- **Disk Space:** 10GB+ for model storage.

## Downloading and Setup Instructions

Follow these steps to download and set up FIS_LocalAI on your local machine.

### Step 1: Clone the Repository

Download the project by cloning the repository from GitHub:

```bash
git clone https://github.com/your-username/FIS_LocalAI.git
cd FIS_LocalAI
```

**Alternative:** If you don’t have Git installed, download the ZIP file from GitHub:
- Visit `https://github.com/dhiebtarak/FIS_LocalAI`.
- Click the green "Code" button and select "Download ZIP".
- Extract the ZIP file and navigate to the `FIS_LocalAI` directory.

### Step 2: Install Docker and Docker Compose

Ensure Docker and Docker Compose are installed on your system:

- Install Docker: Follow the instructions at [Docker Installation Guide](https://docs.docker.com/get-docker/).
- Install Docker Compose: Follow the instructions at [Docker Compose Installation Guide](https://docs.docker.com/compose/install/).

**Optional (for GPU support):** Install NVIDIA Container Toolkit if you have an NVIDIA GPU.

Verify installation:

```bash
docker --version
docker-compose --version
```

### Step 3: Build and Run with Docker Compose

Build and start the application using Docker Compose:

**Build the Services:**

From the `FIS_LocalAI` directory, run:

```bash
docker-compose up --build
```

This builds and starts the `ollama`, `backend`, and `front-end` services.

**Access the Application:**

Open your web browser and go to:

```
http://localhost:4200
```

The Angular front-end interface will load, connected to the backend and Ollama services.

**Stop the Application:**

To stop the services, press `Ctrl+C` in the terminal, then run:

```bash
docker-compose down
```

## Model Download and Customization

FIS_LocalAI is designed to automatically handle model setup during deployment:

- **Automatic Model Download:**  
  When running the application for the first time, the default model (`Clearing-workflow`) will be automatically downloaded into a Docker volume. This means you don't need to manually download or store the model files locally.

- **Ollama Service Creation:**  
  Once the model is downloaded, the Ollama container will be automatically set up to serve the model as a local API endpoint, making it available for the front-end interface.

- **Custom Fine-Tuned Model from Hugging Face:**  
  If you want to use a different fine-tuned model from Hugging Face, simply modify the following environment variables in the `startup.sh` file:

  ```bash
  MODEL_REPO="dhieb/FIS_TinyLLama_GGUF"
  TOKEN=" "
  MODEL_NAME="Clearing-workflow"
  ```

  - `MODEL_REPO`: The repository name on Hugging Face containing the model GGUF file.
  - `TOKEN`: Your Hugging Face access token (required for private repositories).
  - `MODEL_NAME`: The internal name used to register the model with Ollama.

After updating the values in `startup.sh`, simply restart the application using:

```bash
docker-compose down
docker-compose up --build
```

This will trigger the download and setup of the new model.

## Application User Guide

### Accessing the Interface

Navigate to `http://localhost:4200` in your web browser. The interface includes a navbar, chat window, and input area with a 3D cube animation in the background.

### Interface Overview

**Navbar:**
- **Title:** Displays "FIS_LocalAI".
- **Date/Time:** Shows the current date and time, updated every second.
- **Model Selector:** A dropdown to choose the AI model.
- **New Chat Button:** Clears the current chat to start a new conversation.

**Chat Window:**
- Displays your messages (right-aligned, purple background) and AI responses (left-aligned, gray background).

**Input Area:**
- Two text areas: "CCP New Trade Message" for your query, and "Operation Message" for optional context.
- Hint: "Press Enter to send, Shift+Enter for new line".

### Using the Chat

- Select an AI model from the dropdown.
- Type your query in the "CCP New Trade Message" field.
- Optionally, add context in the "Operation Message" field.
- Press `Enter` to send; the AI will respond in real time.

## Troubleshooting

### Common Issues:

**"Model not found" error:**

Check the Ollama container logs:

```bash
docker logs ollama
```

**Port conflict:**

Edit `docker-compose.yml` to change ports (e.g., `4200:80` to `4201:80`).

**Slow responses:**

Use a smaller model or enable GPU acceleration.

**Check resource usage:**

```bash
docker stats
```

**Docker not starting:**

Ensure Docker is running:

```bash
docker info
```

Restart Docker or your system if needed.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a detailed description.

## License

MIT License - Feel free to use and modify this project, but please include the original license.