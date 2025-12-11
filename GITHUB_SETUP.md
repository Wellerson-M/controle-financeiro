# 🚀 Guia: Publicar no GitHub com CI/CD

## ✅ O Que Está Pronto

Sua aplicação já tem **tudo configurado** para CI/CD:

- ✅ `.gitignore` - Ignora arquivos desnecessários
- ✅ `.github/workflows/ci-cd.yml` - Pipeline automático
- ✅ Testes automatizados (pytest)
- ✅ Build validation
- ✅ Security checks

## 📋 Passo a Passo para GitHub

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Digite o nome: `controle-financeiro` (ou o que preferir)
3. Escolha "Private" ou "Public"
4. **NÃO** inicialize com README (você já tem!)
5. Clique "Create repository"

### 2️⃣ Conectar ao Git Local (Windows PowerShell)

```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro"

# Adicione o remote (substitua seu_usuario)
git remote add origin https://github.com/seu_usuario/controle-financeiro.git

# Renomeie para 'main' (se necessário)
git branch -M main

# Faça o push inicial
git push -u origin main
```

### 3️⃣ Verificar CI/CD no GitHub

1. Vá para: `https://github.com/seu_usuario/controle-financeiro`
2. Clique na aba "Actions"
3. Você verá o workflow rodando automaticamente
4. ✅ Quando ficar verde = tudo passou!

## 🔄 CI/CD Automático

Toda vez que você fizer um **push**, o GitHub automaticamente:

### ✅ Backend
- Instala Python 3.11
- Instala dependências (`pip install -r requirements.txt`)
- Roda testes (`pytest`)
- Valida código (flake8)

### ✅ Frontend
- Instala Node.js 18
- Instala dependências (`npm ci`)
- Faz build (`npm run build`)
- Valida vulnerabilidades (`npm audit`)

### ✅ Segurança
- Scans de vulnerabilidades (Trivy)
- Publica no Security tab do GitHub

## 📊 Dashboard de CI/CD

Depois de fazer push, você pode acompanhar:

```
https://github.com/seu_usuario/controle-financeiro/actions
```

## 🔐 Configurações Extras (Recomendado)

### Proteger a Branch Main

1. Vá em: Settings → Branches
2. Clique em "Add rule"
3. Escreva "main"
4. Marque:
   - ✅ Require status checks to pass before merging
   - ✅ Require code reviews
5. Save

Assim, ninguém consegue fazer push diretamente em main - precisa de PR com CI/CD passando!

### Configurar Secrets (Futuramente)

Se precisar de variáveis sensíveis (API keys, etc):

1. Vá em: Settings → Secrets and variables → Actions
2. Clique "New repository secret"
3. Adicione suas variáveis

## 🚀 Fazer Deploy

### Deploy Frontend (Vercel)

```powershell
# Instale Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy
cd controleFinanceiro/frontend
vercel
```

### Deploy Backend (Render)

1. Acesse: https://render.com
2. Clique "New" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0`
5. Deploy!

## 📝 Comandos Git Úteis

```powershell
# Ver status
git status

# Criar nova branch
git checkout -b nome-da-feature

# Commit
git add .
git commit -m "descrição do que mudou"

# Push
git push origin nome-da-feature

# Abrir PR no GitHub (após push)
# GitHub mostrará um botão "Compare & pull request"

# Voltar ao main
git checkout main
git pull origin main
```

## ✨ Exemplo de Workflow Completo

```powershell
# 1. Crie uma branch
git checkout -b feature/adicionar-grafico

# 2. Faça mudanças no código
# ... edite os arquivos ...

# 3. Commit
git add .
git commit -m "feat: adicionar gráfico de gastos"

# 4. Push
git push origin feature/adicionar-grafico

# 5. GitHub mostrará botão para criar PR
# Clique em "Create pull request"

# 6. CI/CD roda automaticamente
# Quando passar, você pode fazer merge!

# 7. Delete a branch
git branch -d feature/adicionar-grafico
```

## 🎯 Checklist para Go Live

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin ...`)
- [ ] Primeiro push feito (`git push -u origin main`)
- [ ] CI/CD workflow rodando com sucesso ✅
- [ ] Verificar aba "Actions" mostrando todos os testes verdes
- [ ] (Opcional) Configurar proteção de main branch
- [ ] (Opcional) Deploy em Vercel (frontend)
- [ ] (Opcional) Deploy em Render (backend)

## 📚 Recursos

- GitHub Actions Docs: https://docs.github.com/en/actions
- Vercel Deploy: https://vercel.com
- Render Deploy: https://render.com
- GitHub Security: https://docs.github.com/en/code-security

## 💡 Dica

Se der erro no CI/CD:
1. Clique no workflow que falhou
2. Veja a saída do erro
3. Corrija localmente
4. Faça novo commit
5. Push automático roda CI/CD novamente

**Tudo automático! 🤖**

---

Qualquer dúvida, me chama! 😊
