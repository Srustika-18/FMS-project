# app/crud.py

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from .schemas import FileCreate, FolderCreate, Folder

client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client.railway_file_management

predefined_admins = [
    {"username": "admin1", "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},  # hashed "password1"
    {"username": "admin2", "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},  # hashed "password2"
    {"username": "admin3", "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},  # hashed "password3"
]

async def get_admin_by_username(username: str):
    for admin in predefined_admins:
        if admin["username"] == username:
            return admin
    return None

async def create_file(file: dict):
    result = await db.files.insert_one(file)
    file["_id"] = result.inserted_id
    return file

async def get_files(skip: int = 0, limit: int = 10):
    cursor = db.files.find().skip(skip).limit(limit)
    files = []
    async for document in cursor:
        files.append(document)
    return files

async def create_folder(folder: FolderCreate):
    folder_dict = folder.dict()
    result = await db.folders.insert_one(folder_dict)
    folder_dict["_id"] = result.inserted_id
    return folder_dict

async def get_folder(folder_id: ObjectId):
    folder = await db.folders.find_one({"_id": folder_id})
    return folder

async def get_folders(parent_folder: ObjectId = None): # type: ignore
    query = {"parent_folder": parent_folder} if parent_folder else {}
    cursor = db.folders.find(query)
    folders = []
    async for document in cursor:
        folders.append(document)
    return folders 
