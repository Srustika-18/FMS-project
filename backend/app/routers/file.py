# app/routers/file.py

from fastapi import APIRouter, UploadFile, File as FastAPIFile
from app.schemas import FileCreate, PyObjectId  # Corrected import statement
# from app.crud import create_file, get_files  # Corrected import statement
# import aiofiles

router = APIRouter(
    prefix="/files",
    tags=["files"],
)

# @router.post("/")
# async def upload_file(file: UploadFile, uploaded_by: str):
#     file_location = f"files/{file.filename}"
#     async with aiofiles.open(file_location, "wb") as f:
#         content = await file.read()
#         await f.write(content)
    
#     file_data = {
#         "filename": file.filename,
#         "filepath": file_location,
#         "uploaded_by": PyObjectId(uploaded_by)
#     }
#     db_file = await create_file(file_data)
    
#     return {"filename": file.filename}

# @router.get("/")
# async def read_files(skip: int = 0, limit: int = 10):
#     files = await get_files(skip=skip, limit=limit)
#     return files
 
