import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()
DB_USER = os.getenv("RDS_USERNAME", "postgres")
DB_PASSWORD = quote_plus(os.getenv("RDS_PASSWORD", "your_password"))
DB_ENDPOINT = os.getenv("RDS_ENDPOINT", "database-1-instance-1.cazyekw6gpnq.us-east-1.rds.amazonaws.com")
DB_PORT = os.getenv("RDS_PORT", "5432")
DB_NAME = os.getenv("RDS_DB_NAME", "postgres")

postgres_url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_ENDPOINT}:{DB_PORT}/{DB_NAME}"
# print(postgres_url)
engine = create_engine(
    postgres_url, 
    connect_args={"sslmode": "require"}, 
    echo=True
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
