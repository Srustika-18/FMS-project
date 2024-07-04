# app/routers/files.py

import shutil
from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, HTTPException
from app.schemas import ResponseModel, User
from app.crud import add_file, retrieve_files_by_folder_id
from app.dependencies import get_current_admin

router = APIRouter(
    prefix="/files",
    tags=["files"],
)


@router.post("/", response_description="File data added into the database")
async def upload_file(folder_id: str, file: UploadFile = FastAPIFile(...), current_admin: User = Depends(get_current_admin)):
    print(folder_id)
    print(file)
    if not current_admin:
        raise HTTPException(status_code=401, detail="Unauthorized")

    file_data = {
        "Name": file.filename,
        "FolderID": folder_id,
        "URL": f"/uploads/{file.filename}",
        "OwnerID": dict(current_admin)["username"]
    }

    new_file = await add_file(file_data)

    # Save the file to the server
    with open(f'app/uploads/{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return ResponseModel(data=new_file, message="File uploaded successfully")


@router.get("/{folder_id}/files", response_description="Files retrieved")
async def get_files_in_folder(folder_id: str):
    files = await retrieve_files_by_folder_id(folder_id)
    return ResponseModel(data=files, message="Files retrieved successfully")
