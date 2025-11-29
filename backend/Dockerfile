FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Upgrade pip and install dependencies (with retry + long timeout)
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt --retries 5 --timeout 120

# Copy application code
COPY app ./app

# Start the FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
