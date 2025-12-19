from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select, Session
from .database import init_db, get_session
from .models import User, Transaction, Budget
from .schemas import (
    UserCreate,
    Token,
    TransactionCreate,
    TransactionRead,
    BudgetCreate,
    BudgetRead,
)
from .auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
)

app = FastAPI(title="Controle Financeiro API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.post("/auth/register", response_model=Token)
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(email=user.email, hashed_password=get_password_hash(user.password))
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    access_token = create_access_token({"sub": db_user.email})
    return {"access_token": access_token}


@app.post("/auth/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token}


@app.post("/transactions", response_model=TransactionRead)
def create_transaction(
    tr: TransactionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    db_tr = Transaction(user_id=current_user.id, **tr.dict())
    session.add(db_tr)
    session.commit()
    session.refresh(db_tr)
    return db_tr


@app.get("/transactions", response_model=list[TransactionRead])
def list_transactions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = session.exec(
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc())
    ).all()
    return rows


@app.get("/summary")
def get_summary(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    total_income = sum(tr.amount for tr in transactions if tr.kind == "income")
    total_expense = sum(tr.amount for tr in transactions if tr.kind == "expense")
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
    }


@app.get("/analytics/overview")
def analytics_overview(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    transactions = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    total_income = sum(tr.amount for tr in transactions if tr.kind == "income")
    total_expense = sum(tr.amount for tr in transactions if tr.kind == "expense")
    # Monthly breakdown
    monthly = {}
    for tr in transactions:
        key = tr.date.strftime("%Y-%m")
        if key not in monthly:
            monthly[key] = {"income": 0.0, "expense": 0.0}
        monthly[key][tr.kind] += tr.amount
    return {
        "totals": {
            "income": total_income,
            "expense": total_expense,
            "balance": total_income - total_expense,
        },
        "monthly": monthly,
    }


@app.get("/analytics/categories")
def analytics_categories(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    by_cat = {}
    for tr in rows:
        cat = tr.category or "Sem categoria"
        if cat not in by_cat:
            by_cat[cat] = {"income": 0.0, "expense": 0.0}
        by_cat[cat][tr.kind] += tr.amount
    return by_cat


@app.get("/analytics/monthly")
def analytics_monthly(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = session.exec(
        select(Transaction).where(Transaction.user_id == current_user.id)
    ).all()
    monthly = {}
    for tr in rows:
        key = tr.date.strftime("%Y-%m")
        if key not in monthly:
            monthly[key] = {"income": 0.0, "expense": 0.0}
        monthly[key][tr.kind] += tr.amount
    return monthly


# Budgets CRUD
@app.post("/budgets", response_model=BudgetRead)
def create_budget(
    payload: BudgetCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    budget = Budget(user_id=current_user.id, **payload.dict())
    session.add(budget)
    session.commit()
    session.refresh(budget)
    return budget


@app.get("/budgets", response_model=list[BudgetRead])
def list_budgets(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(
        select(Budget).where(Budget.user_id == current_user.id)
    ).all()


@app.put("/budgets/{budget_id}", response_model=BudgetRead)
def update_budget(
    budget_id: int,
    payload: BudgetCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    budget = session.exec(
        select(Budget).where(Budget.id == budget_id, Budget.user_id == current_user.id)
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    for k, v in payload.dict().items():
        setattr(budget, k, v)
    session.add(budget)
    session.commit()
    session.refresh(budget)
    return budget


@app.delete("/budgets/{budget_id}")
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    budget = session.exec(
        select(Budget).where(Budget.id == budget_id, Budget.user_id == current_user.id)
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    session.delete(budget)
    session.commit()
    return {"deleted": True}


@app.put("/transactions/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: int,
    tr: TransactionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    db_tr = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not db_tr:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in tr.dict().items():
        setattr(db_tr, key, value)
    session.add(db_tr)
    session.commit()
    session.refresh(db_tr)
    return db_tr


@app.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    db_tr = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not db_tr:
        raise HTTPException(status_code=404, detail="Transaction not found")
    session.delete(db_tr)
    session.commit()
    return {"deleted": True}


@app.patch("/transactions/{transaction_id}/pay")
def mark_as_paid(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    db_tr = session.exec(
        select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == current_user.id
        )
    ).first()
    if not db_tr:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db_tr.is_paid = True
    session.add(db_tr)
    session.commit()
    session.refresh(db_tr)
    return db_tr


@app.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "id": current_user.id}
