# app/main.py

from fastapi import FastAPI
from app.routers import admin, file, folder  # Corrected import statements

app = FastAPI()

app.include_router(admin.router)
app.include_router(file.router)
app.include_router(folder.router)


