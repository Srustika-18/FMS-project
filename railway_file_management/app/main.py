# app/main.py

from fastapi import FastAPI
from app.routers import admin, file, folder, student

app = FastAPI()

app.include_router(admin.router)
app.include_router(file.router)
app.include_router(folder.router)
app.include_router(student.router)

# @app.get("/home", tags=["Root"])
# async def read_root():
#     return ["hemmo","bye"]


# @app.get("/files")
# async def read_files(skip: int = 0, limit: int = 10):
#     files = await get_files(skip=skip, limit=limit)
#     return files