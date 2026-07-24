import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()
DB_ENDPOINT = os.getenv("RDS_ENDPOINT")
DB_PORT = int(os.getenv("RDS_PORT", 5432))
DB_NAME = os.getenv("RDS_DB_NAME")
DB_USERNAME=os.getenv("RDS_USERNAME")
DB_PASSWORD = os.getenv("RDS_PASSWORD")


engine = create_engine(f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_ENDPOINT}:{DB_PORT}/{DB_NAME}", echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session