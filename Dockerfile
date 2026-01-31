# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API code and model
COPY API/ ./API/
COPY saved_models/ ./saved_models/
COPY potatoes.h5 .

WORKDIR /app/API

EXPOSE 8000

CMD ["python", "main.py"]
