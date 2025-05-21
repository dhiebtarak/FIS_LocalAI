# Start from Ollama base image
FROM ollama/ollama:latest

# Install required tools
RUN apt-get update && \
    apt-get install -y python3 python3-pip git-lfs curl && \
    rm -rf /var/lib/apt/lists/*

# Install Hugging Face Hub CLI
RUN pip3 install huggingface_hub

# Set working directory
WORKDIR /root/.ollama

# Copy startup script
COPY startup.sh /root/.ollama/startup.sh
RUN chmod +x /root/.ollama/startup.sh

# Ensure volume permissions
RUN chown -R root:root /root/.ollama

# Run the startup script as entrypoint
ENTRYPOINT ["/root/.ollama/startup.sh"]