# app/routers/admin.py

from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from app.crud import get_admin_by_username  # Corrected import statement

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.post("/login/")
async def login(username: str, password: str):
    admin = await get_admin_by_username(username)
    if not admin or not pwd_context.verify(password, admin["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"message": "Login successful"}
 
