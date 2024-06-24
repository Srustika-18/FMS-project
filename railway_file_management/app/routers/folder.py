# app/routers/folder.py

from fastapi import APIRouter, HTTPException
from app.schemas import FolderCreate, PyObjectId, ResponseModel, folderSchema  # Corrected import statement
from app.crud import add_Folder, create_folder, get_folder, get_folders  # Corrected import statement
from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

router = APIRouter(
    prefix="/folders",
    tags=["folders"],
)

# @router.post("/")
# async def create_new_folder(folder: FolderCreate):
#     created_folder = await create_folder(folder)
#     return created_folder

# @router.get("/{folder_id}")
# async def read_folder(folder_id: str):
#     folder = await get_folder(PyObjectId(folder_id))
#     if folder is None:
#         raise HTTPException(status_code=404, detail="Folder not found")
#     return folder

# @router.get("/")
# async def read_folders(parent_folder_id: str = None): # type: ignore
#     parent_folder = PyObjectId(parent_folder_id) if parent_folder_id else None
#     folders = await get_folders(parent_folder) # type: ignore
#     return folders

@router.post("/", response_description="Folder data added into the database")
async def add_Folder_data(Folder: folderSchema = Body(...)):
    Folder = jsonable_encoder(Folder)
    new_Folder = await add_Folder(Folder)
    return ResponseModel(new_Folder, "Folder added successfully.")