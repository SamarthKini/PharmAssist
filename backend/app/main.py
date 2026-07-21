from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import drugs, chat
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(drugs.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "PharmAssist API"}

if __name__ == '__main__':
    uvicorn.run(app, port=8000, host="0.0.0.0")
