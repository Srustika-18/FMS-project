from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from app.crud import add_student, retrieve_students
from app.schemas import ResponseModel, StudentSchema


router = APIRouter(
    prefix="/student",
    tags=["student"],
)

@router.post("/", response_description="Student data added into the database")
async def add_student_data(student: StudentSchema = Body(...)):
    student = jsonable_encoder(student)
    new_student = await add_student(student)
    return ResponseModel(new_student, "Student added successfully.")

@router.get("/", response_description="Students retrieved")
async def get_students():
    students = await retrieve_students()
    if students:
        return ResponseModel(students, "Students data retrieved successfully")
    return ResponseModel(students, "Empty list returned")
