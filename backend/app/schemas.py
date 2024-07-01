# app/schemas.py

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from typing import List, Optional


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        core_schema.update(type='string')


class UserBase(BaseModel):
    username: str


class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}


class FileBase(BaseModel):
    filename: str
    filepath: str


class FileCreate(FileBase):
    uploaded_by: PyObjectId


class File(FileBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user: User

    class Config:
        json_encoders = {ObjectId: str}


class FolderBase(BaseModel):
    foldername: str
    parent_folder: Optional[PyObjectId]


class FolderCreate(FolderBase):
    pass


class Folder(FolderBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    files: List[File] = []
    subfolders: List['Folder'] = []

    class Config:
        json_encoders = {ObjectId: str}
        from_attributes = True


class Admin(BaseModel):
    username: str
    hashed_password: str


class folderSchema(BaseModel):
    Name: str = Field(...)
    ParentfolderID: Optional[str] = Field(None)
    CreatedAt: datetime = Field(default_factory=datetime.utcnow)
    UpdatedAt: datetime = Field(default_factory=datetime.utcnow)
    OwnerID: str = Field(...)


class fileSchema(BaseModel):
    Name: str = Field(...)
    FolderID: Optional[str] = Field(None)
    URL: str = Field(...)
    CreatedAt: datetime = Field(default_factory=datetime.utcnow)
    UpdatedAt: datetime = Field(default_factory=datetime.utcnow)
    OwnerID: str = Field(...)


class StudentSchema(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    course_of_study: str = Field(...)
    year: int = Field(..., gt=0, lt=9)
    gpa: float = Field(..., le=4.0)

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "John Doe",
                "email": "jdoe@x.edu.ng",
                "course_of_study": "Water resources engineering",
                "year": 2,
                "gpa": "3.0",
            }
        }


class UpdateStudentModel(BaseModel):
    fullname: Optional[str]
    email: Optional[EmailStr]
    course_of_study: Optional[str]
    year: Optional[int]
    gpa: Optional[float]

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "John Doe",
                "email": "jdoe@x.edu.ng",
                "course_of_study": "Water resources and environmental engineering",
                "year": 4,
                "gpa": "4.0",
            }
        }


def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}
