# 🎯 Guia Rápido de Uso - Controle Financeiro

## ⚡ Início Rápido (5 minutos)

### 1. Iniciar a Aplicação

Abra **dois terminais** separados:

**Terminal 1 - Backend (API)**
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\backend"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Você verá:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 - Frontend (Interface)**
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\frontend"
npm run dev
```

Você verá:
```
  ➜  Local:   http://localhost:5173/
```

### 2. Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

---

## 🔑 Criar sua Primeira Conta

### Opção A: Registrar (Recomendado)
1. Clique em **"Registrar"** ou acesse `/register`
2. Digite seu email e senha
3. Clique em **"Criar Conta"**
4. ✅ Você será automaticamente conectado!

### Opção B: Usar Conta de Teste
```
Email: teste@example.com
Senha: senha123
```

---

## 💰 Usando o Dashboard

### Adicionando Transações

1. **Tipo**: Escolha entre "Ganho" 💰 ou "Gasto" 💸
2. **Descrição**: Ex: "Salário", "Supermercado", "Freelance"
3. **Categoria**: Escolha uma categoria (ou escreva uma customizada)
4. **Valor**: Digite o valor em reais
5. **Data**: Selecione a data (padrão: hoje)
6. **Status**: Escolha se está pago ou não
7. Clique em **"Adicionar"** ✅

### Visualizando Transações

- **Resumo no Topo**: Veja seus ganhos, gastos e saldo total
- **Tabela**: Todas as transações ordenadas por data (mais recentes primeiro)
- **Cores**:
  - 🟢 Verde = Ganhos
  - 🔴 Vermelho = Gastos

---

## 🔒 Segurança

### Fazer Logout
Clique no botão **"Sair"** no canto superior direito (quando implementado)

### Suas Informações são Privadas
- Cada usuário vê apenas suas próprias transações
- Senhas são criptografadas com SHA256
- Autenticação via JWT tokens seguros

---

## 🛠️ Troubleshooting

### Problema: "Connection refused" na porta 8000
**Solução**: O backend não está rodando. Execute em Terminal 1:
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\backend"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Problema: Branco na página ou "cannot GET /docs"
**Solução**: O frontend não está rodando. Execute em Terminal 2:
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\frontend"
npm run dev
```

### Problema: "node_modules not found"
**Solução**: Instale as dependências:
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\frontend"
npm install
```

### Problema: ".venv not found"
**Solução**: Crie o ambiente virtual:
```powershell
cd "C:\Users\Welle\OneDrive\Área de Trabalho\climax\controleFinanceiro\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problema: Erro ao registrar email duplicado
**Normal!** Cada email só pode ser usado uma vez. Use um email diferente ou faça login se a conta já existe.

---

## 📊 Testando a API Diretamente

Se preferir testar a API sem o frontend:

```powershell
# Documentação interativa (Swagger)
Start-Process "http://127.0.0.1:8000/docs"

# Ou teste via curl/Python
# POST /auth/register
curl -X POST "http://127.0.0.1:8000/auth/register" `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"senha123"}'
```

---

## 💡 Dicas e Truques

### Organizar Transações por Categoria
Use categorias consistentes para análise melhor:
- 🏠 Habitação: Aluguel, IPTU, Condomínio
- 🍔 Alimentação: Supermercado, Restaurante, Delivery
- 🚗 Transporte: Gasolina, Uber, Ônibus
- 💼 Renda: Salário, Freelance, Investimentos
- 🎓 Educação: Cursos, Livros, Matrícula

### Rastrear Gastos Mensais
Digite a data corretamente para cada transação. Assim você pode analisar seu padrão de gastos.

### Planejamento Financeiro
Monitore a "Taxa de Gasto" - se seus gastos são mais de 50% da renda, considere reduzir despesas.

---

## 🔧 Comandos Úteis

### Reiniciar Servidores
```powershell
# Pressione Ctrl+C em ambos os terminais
# Depois execute novamente os comandos acima
```

### Limpar Cache do Navegador
```
No navegador: Ctrl+Shift+Delete → Limpar dados de navegação
```

### Verificar Status dos Processos
```powershell
# Vê se os servidores estão rodando
Get-Process | Where-Object { $_.Name -like "*node*" -or $_.Name -like "*python*" }
```

---

## 📱 Próximas Funcionalidades

Estas funcionalidades estão planejadas:

- [ ] Categorias customizáveis
- [ ] Filtros por data e categoria
- [ ] Gráficos e relatórios
- [ ] Exportar dados (CSV/PDF)
- [ ] Modo escuro
- [ ] App mobile
- [ ] Sincronização em nuvem

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:
1. Verifique se ambos os servidores estão rodando (terminais verdes ✅)
2. Procure a mensagem de erro nos terminais
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Reinicie ambos os servidores

---

**Bom uso! 🎉**

Qualquer dúvida, consulte o arquivo `STATUS.md` para informações técnicas detalhadas.
