# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package files
COPY bg-remover-app/frontend_next/package*.json ./
RUN npm install

# Copy frontend source and build
COPY bg-remover-app/frontend_next/ ./
RUN npm run build

# Stage 2: Final Image (Python Backend + Static Frontend)
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for image processing (rembg/opencv)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY bg-remover-app/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY bg-remover-app/backend/ .

# Copy built frontend static files from Stage 1 to /app/static
COPY --from=frontend-builder /app/frontend/out /app/static

# Expose the application port
EXPOSE 8080

# Run FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
