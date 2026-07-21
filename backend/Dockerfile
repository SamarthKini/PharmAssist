FROM python:3.12.5

WORKDIR /fastapi-app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# run command
# docker run --env-file .env -p 8000:8000 python-fastapi