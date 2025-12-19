from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    description: str
    amount: float
    kind: str = Field(default="expense")  # 'income' or 'expense'
    category: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    is_paid: bool = Field(default=False)
    # installment fields
    installment_total: Optional[int] = None
    installment_index: Optional[int] = None


class Budget(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    category: str
    amount: float  # planned amount for the period
    period: str  # e.g., '2025-12' (YYYY-MM)
    created_at: datetime = Field(default_factory=datetime.utcnow)
