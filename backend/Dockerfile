FROM python:3.11-alpine3.16

# Set work dir for relative paths
WORKDIR /app

# Install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy code from context to image
COPY . .

CMD python manage.py runserver 0.0.0.0:8000
