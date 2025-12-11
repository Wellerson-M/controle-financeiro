from sqlmodel import SQLModel, create_engine, Session
from typing import Generator, Optional

DATABASE_URL = "sqlite:///./controle_financeiro.db"
engine = None

def init_db(db_url: Optional[str] = None):
    global engine
    url = db_url if db_url else DATABASE_URL
    engine = create_engine(url, connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    global engine
    if engine is None:
        init_db()
    with Session(engine) as session:
        yield session
