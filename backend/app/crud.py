# app/crud.py

from datetime import datetime
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from .schemas import FileCreate, FolderCreate, Folder, PyObjectId

client = AsyncIOMotorClient('mongodb://localhost:27017')
database = client.file_management_system
folders = database.get_collection("Folders")
admins = database.get_collection("users")


async def get_admin_by_username(username: str):
	admin = await admins.find_one({"username": username})
	return admin


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


# Add a new Folder into to the database
async def add_Folder(Folder_data: dict) -> dict:
	current_time = datetime.now()  # Get the current time in UTC
	Folder_data['CreatedAt'] = current_time
	Folder_data['UpdatedAt'] = current_time
	Folder = await folders.insert_one(Folder_data)
	new_Folder = await folders.find_one({"_id": Folder.inserted_id})
	return Folder_helper(new_Folder)


# Retrieve a student with a matching ID
async def retrieve_student(id: str) -> dict: # type: ignore
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
	
# Retrieve all folder present in the database
async def retrieve_folders():
	folders_list = []
	async for folder in folders.find():
		folders_list.append(Folder_helper(folder))
	return folders_list