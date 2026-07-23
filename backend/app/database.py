import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
from urllib.parse import quote_plus
# import boto3
# import psycopg2

load_dotenv()
DB_ENDPOINT = os.getenv("RDS_ENDPOINT")
DB_PORT = int(os.getenv("RDS_PORT", 5432))
DB_NAME = os.getenv("RDS_DB_NAME")
# DB_USER = os.getenv("RDS_IAM_USER")
# AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
DB_USERNAME=os.getenv("RDS_USERNAME")
DB_PASSWORD = os.getenv("RDS_PASSWORD")

# connection_

# def get_iam_token():
#     rds = boto3.client("rds", region_name=AWS_REGION)
#     return rds.generate_db_auth_token(
#         DBHostname=DB_ENDPOINT,
#         Port=DB_PORT,
#         DBUsername=DB_USER
#     )

# def connect_with_iam():
#     token = get_iam_token()
#     return psycopg2.connect(
#         host=DB_ENDPOINT,
#         port=DB_PORT,
#         user=DB_USER,
#         password=token,
#         dbname=DB_NAME,
#         sslmode="require"
#     )

engine = create_engine(f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_ENDPOINT}:{DB_PORT}/{DB_NAME}", echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session