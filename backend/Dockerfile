FROM python:3.12-slim

WORKDIR /code

# Optional: Install system deps (if needed for PostgreSQL or other libs)
RUN apt-get update && apt-get install -y build-essential

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port (optional but good practice)
EXPOSE 8000

# Default CMD (optional since we provide it in docker-compose)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]
