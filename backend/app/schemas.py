from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TransactionCreate(BaseModel):
    description: str
    amount: float
    kind: str = "expense"
    category: Optional[str] = None
    installment_total: Optional[int] = None
    installment_index: Optional[int] = None


class TransactionRead(TransactionCreate):
    id: int
    user_id: int
    date: datetime
    is_paid: bool
