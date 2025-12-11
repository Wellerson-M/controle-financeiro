# Backend — Controle Financeiro (FastAPI + SQLite)

Este backend fornece endpoints mínimos para autenticação (registro/login JWT) e CRUD de transações (ganhos/gastos).

Setup (PowerShell):

```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Executar testes:

```powershell
# com ambiente ativado
pytest -q
```

Configuração:
- `app/database.py` configura SQLite: `sqlite:///./controle_financeiro.db`
- Ajuste `SECRET_KEY` em `app/auth.py` para uma chave segura em produção
