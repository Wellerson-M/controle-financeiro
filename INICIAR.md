# 🚀 Iniciar a Aplicação - Opções

Escolha uma das 3 formas abaixo:

## 1️⃣ **Mais Fácil (Recomendado para você)**

**No Windows:** Duplo clique em `start.bat`
```
start.bat
```

Abre 2 janelas do terminal automaticamente com tudo rodando.

---

## 2️⃣ **PowerShell**

```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro"
.\start.ps1
```

---

## 3️⃣ **Python (Funciona em qualquer SO)**

```bash
python start.py
```

ou

```bash
python3 start.py
```

---

## ✨ Resultado

Após qualquer um dos 3 métodos:

- ✅ Backend rodando em `http://127.0.0.1:8000`
- ✅ Frontend rodando em `http://localhost:5173`
- ✅ Navegador abre automaticamente
- ✅ Tudo com hot-reload ativa

---

## ⛔ Parar

Simplesmente feche as 2 janelas de terminal ou pressione `Ctrl+C`

---

## 💡 Dica

Se quiser rodar **apenas um**:

```powershell
# Só backend
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

# Só frontend
cd frontend
npm run dev
```

---

**Pronto! Agora é só duplo clique em `start.bat` e vai! 🎉**
