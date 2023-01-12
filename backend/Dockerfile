FROM python:3.11.1-alpine3.16

WORKDIR /app
RUN pip install gunicorn
COPY requirements.txt ./

RUN pip install -r requirements.txt
COPY . .

CMD gunicorn backend.wsgi --bind 0.0.0.0
