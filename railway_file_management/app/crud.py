# app/crud.py

from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from .schemas import FileCreate, FolderCreate, Folder, PyObjectId

client = AsyncIOMotorClient('mongodb://localhost:27017')
database = client.file_management_system
folders = database.get_collection("Folders")

predefined_admins = [
    # hashed "password1"
    {"username": "admin1",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},
    # hashed "password2"
    {"username": "admin2",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},
    # hashed "password3"
    {"username": "admin3",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36qQhz/3KT.1sqoGhcZk1vG"},
]

def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "fullname": student["fullname"],
        "email": student["email"],
        "course_of_study": student["course_of_study"],
        "year": student["year"],
        "GPA": student["gpa"],
    }

def Folder_helper(Folder) -> dict:
    return {
        "FolderID": str(Folder["_id"]),
        "Name": Folder["Name"],
        "ParentfolderID": Folder["ParentfolderID"],
        "CreatedAt": Folder["CreatedAt"],
        "UpdatedAt": Folder["UpdatedAt"],
        "OwnerID": Folder["OwnerID"],
    }


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
    print(f"Inserting folder: {folder_dict}")

    try:
        result = await db.folders.insert_one(folder_dict)
        folder_dict["_id"] = str(result.inserted_id)
        print(f"Inserted folder with ID: {result.inserted_id}")
        return folder_dict
    except Exception as e:
        print(f"Error inserting folder: {e}")
        raise HTTPException(status_code=500, detail="Failed to create folder")


async def get_folder(folder_id: PyObjectId):
    folder = await db.folders.find_one({"_id": folder_id})
    return folder


async def get_folders(parent_folder: PyObjectId = None):  # type: ignore
    query = {"parent_folder": parent_folder} if parent_folder else {}
    cursor = db.folders.find(query)
    folders = []
    async for document in cursor:
        folders.append(document)
    return folders



# Retrieve all students present in the database
async def retrieve_students():
    students = []
    async for student in folders.find():
        students.append(student_helper(student))
    return students


# Add a new student into to the database
async def add_student(student_data: dict) -> dict:
    student = await folders.insert_one(student_data)
    new_student = await folders.find_one({"_id": student.inserted_id})
    return student_helper(new_student)

# Add a new student into to the database
async def add_Folder(Folder_data: dict) -> dict:
    Folder = await folders.insert_one(Folder_data)
    new_Folder = await folders.find_one({"_id": Folder.inserted_id})
    return Folder_helper(new_Folder)


# Retrieve a student with a matching ID
async def retrieve_student(id: str) -> dict:
    student = await folders.find_one({"_id": PyObjectId(id)})
    if student:
        return student_helper(student)


# Update a student with a matching ID
async def update_student(id: str, data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    student = await folders.find_one({"_id": PyObjectId(id)})
    if student:
        updated_student = await folders.update_one(
            {"_id": PyObjectId(id)}, {"$set": data}
        )
        if updated_student:
            return True
        return False


# Delete a student from the database
async def delete_student(id: str):
    student = await folders.find_one({"_id": PyObjectId(id)})
    if student:
        await folders.delete_one({"_id": PyObjectId(id)})
        return True
