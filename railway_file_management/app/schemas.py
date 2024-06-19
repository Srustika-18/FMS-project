# app/schemas.py

from pydantic import BaseModel, Field
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
    parent_folder: Optional[PyObjectId] = None

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    files: List[File] = []
    subfolders: List['Folder'] = []

    class Config:
        json_encoders = {ObjectId: str}
        orm_mode = True
