# Controle Financeiro - Full Stack App

Sistema de controle financeiro pessoal com frontend React e backend FastAPI.

## 🚀 Quick Start

### Opção 1: Script Automático (Recomendado)

**Windows:**
```bash
# Duplo clique em start.bat
# ou pelo PowerShell:
.\start.ps1
```

**Mac/Linux:**
```bash
python start.py
```

### Opção 2: Manual

**Backend:**
```bash
cd controleFinanceiro/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate      # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend (novo terminal):**
```bash
cd controleFinanceiro/frontend
npm install
npm run dev
```

**Acesse:** http://localhost:5173

## 📖 Documentação

- **[INICIAR.md](INICIAR.md)** - Como iniciar a aplicação
- **[STATUS.md](STATUS.md)** - Documentação técnica completa
- **[TESTES_RAPIDO.md](TESTES_RAPIDO.md)** - Guia rápido de testes
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - Setup no GitHub

## 📋 Funcionalidades

- ✅ Registro e login com JWT
- ✅ Gerenciar transações (criar, editar, deletar)
- ✅ Dashboard com resumo financeiro
- ✅ Categorias customizáveis
- ✅ Histórico de transações

## 🏗️ Arquitetura

```
controleFinanceiro/
├── backend/          → FastAPI + SQLModel
│   ├── app/
│   │   ├── main.py      (endpoints)
│   │   ├── models.py    (banco de dados)
│   │   ├── auth.py      (segurança)
│   │   └── tests/
│   └── requirements.txt
│
└── frontend/         → React + Vite + Tailwind
    ├── src/
    │   ├── pages/       (Login, Register, Dashboard)
    │   ├── components/
    │   ├── AuthContext.jsx
    │   └── api.js
    └── package.json
```

## 🧪 Testes

```bash
# Backend
cd controleFinanceiro/backend
python -m pytest -v

# Frontend
cd controleFinanceiro/frontend
npm run build
```

## 🔐 Segurança

- JWT tokens para autenticação
- Senhas criptografadas com SHA256
- CORS configurado
- Validação de entrada em todos endpoints
- Proteção de rotas no frontend

## 📚 API Docs

Com o backend rodando, acesse: **http://127.0.0.1:8000/docs** (Swagger)

## 🚢 Deploy

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Render/Railway)
- Fazer push para GitHub
- Conectar repositório no Render/Railway
- Usar `requirements.txt` para instalar dependências

## 📝 Variáveis de Ambiente

Frontend (`.env`):
```
VITE_API_URL=http://127.0.0.1:8000
```

Backend (`.env`):
```
DATABASE_URL=sqlite:///controle_financeiro.db
SECRET_KEY=seu-segredo-aqui
```

## 📖 Documentação

- `STATUS.md` - Documentação técnica
- `GUIA_RAPIDO.md` - Guide de uso
- `COMECE_AQUI.txt` - Quick reference

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido por Wellerson-M
