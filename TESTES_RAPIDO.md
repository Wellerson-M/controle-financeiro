# 🧪 Testes - Resumo Rápido

## O que é um teste?

Um **teste** é um código que verifica se seu programa funciona correto.

```
Teste = Verificação automática
```

---

## Seu Teste Atual

**Arquivo:** `backend/app/tests/test_auth.py`

**O que faz:**
1. ✅ Registra um usuário
2. ✅ Faz login
3. ✅ Cria uma transação
4. ✅ Verifica se tudo funcionou

```python
def test_register_login_create_transaction(client):
    # 1. Registrar
    r = client.post('/auth/register', json={"email": email, "password": password})
    assert r.status_code == 200  # Verificar: funcionou?
    
    # 2. Login
    r2 = client.post('/auth/token', data={"username": email, "password": password})
    assert r2.status_code == 200  # Verificar: funcionou?
    
    # 3. Criar transação
    r3 = client.post('/transactions', json={...}, headers=headers)
    assert r3.status_code == 200  # Verificar: funcionou?
```

---

## Como Rodar

```bash
# Terminal (Windows)
cd controleFinanceiro/backend
.\.venv\Scripts\Activate.ps1
python -m pytest -v
```

**Resultado:**

```
app/tests/test_auth.py::test_register_login_create_transaction PASSED [100%]
```

✅ Significa: Tudo funcionou!

---

## O que Significa `assert`?

```python
assert status_code == 200
```

Lê-se: **"Verifique se status_code é igual a 200"**

Se for:
- ✅ **Verdadeiro** → Teste passa
- ❌ **Falso** → Teste falha

---

## Fluxo Completo

```
1. Você escreve código
      ↓
2. Você roda pytest
      ↓
   ✅ Passa? Continue desenvolvendo
   ❌ Falha? Corrija o código
      ↓
3. Você faz git push
      ↓
4. GitHub roda testes automaticamente (Actions)
      ↓
   ✅ Passa? Código seguro
   ❌ Falha? Mostra o erro
```

---

## Tipos de Testes

| Tipo | O que testa | Exemplo |
|------|-------------|---------|
| **Unit** | Função isolada | Hash de senha |
| **Integration** | API endpoint | POST /auth/register |
| **E2E** | Fluxo completo | Registrar → Login → Transação |

**Seu teste é E2E** (testa tudo junto)

---

## Dicas

### Rodar teste específico
```bash
pytest app/tests/test_auth.py -v
```

### Ver cobertura
```bash
pip install pytest-cov
pytest --cov=app
```

### Com output detalhado
```bash
pytest -v --tb=short
```

---

## Quando Testes Falham

**Erro comum:**
```
FAILED app/tests/test_auth.py::test_register_login_create_transaction
AssertionError: assert 400 == 200
```

Significa:
- ❌ Esperava 200 (OK)
- ❌ Recebeu 400 (Erro)
- Algo quebrou no seu código

**Solução:**
1. Leia a mensagem de erro
2. Procure o bug no código
3. Corrija
4. Rode pytest novamente

---

## Seu Workflow Agora

```
1. Desenvolva → Mude código
2. Teste → python -m pytest
3. Push → git push
4. CI/CD roda testes no GitHub
5. Veja resultado em Actions
```

**Tudo automático!** 🚀

---

Alguma dúvida? 😊
