# app/routers/folder.py

from fastapi import APIRouter, Depends, HTTPException
# Corrected import statement
from app.schemas import FolderCreate, PyObjectId, ResponseModel, User, folderSchema
from app.crud import add_folder, retrieve_files_by_folder_id, retrieve_folders, retrieve_folders_by_parent_id
# , create_folder, get_folder, get_folders  # Corrected import statement
from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from app.dependencies import get_current_admin

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
async def add_folder_data(Folder: folderSchema = Body(...), current_admin: User = Depends(get_current_admin)):
    Folder = jsonable_encoder(Folder)
    new_Folder = await add_folder(Folder)  # type: ignore
    return ResponseModel(new_Folder, "Folder added successfully.")


@router.get("/", response_description="Folder retrieved")
async def get_folder():
    folder = await retrieve_folders()
    if folder:
        return ResponseModel(folder, "folder data retrieved successfully")
    return ResponseModel(folder, "Empty list returned")


# @router.get("/root", response_description="Root folders retrieved")
# async def get_root_folders():
#     folders = await retrieve_root_folders()
#     if folders:
#         return ResponseModel(folders, "Root folders retrieved successfully.")
#     return ResponseModel(folders, "No root folders found")


@router.get("/{parent_id}", response_description="Folders retrieved by parent folder ID")
async def get_folders_by_parent_id(parent_id: str):
    folders = await retrieve_folders_by_parent_id(parent_id)
    files = await retrieve_files_by_folder_id(parent_id)
    if folders or files:
        return ResponseModel(folders + files, f"Folders with ParentfolderID {parent_id} retrieved successfully.")
    return ResponseModel(folders, f"No folders found with ParentfolderID {parent_id}.")
