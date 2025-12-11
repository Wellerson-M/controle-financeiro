import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, SQLModel, Session
from app.main import app
from app import database

@pytest.fixture(name="client", autouse=True)
def client_fixture(monkeypatch):
    """Criar um TestClient com um DB em memória"""
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(test_engine)
    
    def get_test_session():
        with Session(test_engine) as session:
            yield session
    
    # Substituir get_session no módulo database
    monkeypatch.setattr(database, "get_session", get_test_session)
    
    return TestClient(app)
