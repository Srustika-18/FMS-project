# app/routers/folder.py

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.schemas import FolderCreate  # Corrected import statement
from app.crud import create_folder, get_folder, get_folders  # Corrected import statement

router = APIRouter(
    prefix="/folders",
    tags=["folders"],
)

# @router.post("/")
# async def create_new_folder(folder: FolderCreate):
#     created_folder = await create_folder(folder)
#     return created_folder

@router.get("/{folder_id}")
async def read_folder(folder_id: str):
    folder = await get_folder(ObjectId(folder_id))
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder

@router.get("/")
async def read_folders(parent_folder_id: str = None): # type: ignore
    parent_folder = ObjectId(parent_folder_id) if parent_folder_id else None
    folders = await get_folders(parent_folder) # type: ignore
    return folders

