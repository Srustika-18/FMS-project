# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import admin, file, folder

app = FastAPI()

origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://fms-project.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(admin.router)
app.include_router(file.router)
app.include_router(folder.router)

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")
app.mount("/", StaticFiles(directory="../docs", html=True), name="uploads")
