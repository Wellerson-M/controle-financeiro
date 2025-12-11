def test_register_login_create_transaction(client):
    email = "test@example.com"
    password = "secret123"

    # register
    r = client.post('/auth/register', json={"email": email, "password": password})
    assert r.status_code == 200, f"Register failed: {r.text}"
    token = r.json().get('access_token')
    assert token

    # login
    r2 = client.post('/auth/token', data={"username": email, "password": password})
    assert r2.status_code == 200, f"Login failed: {r2.text}"
    token2 = r2.json().get('access_token')
    assert token2

    headers = {"Authorization": f"Bearer {token2}"}

    # create transaction
    r3 = client.post('/transactions', json={"description": "Salary", "amount": 1000.0, "kind": "income"}, headers=headers)
    assert r3.status_code == 200, f"Create transaction failed: {r3.text}"
    body = r3.json()
    assert body['description'] == 'Salary'
    assert body['amount'] == 1000.0

    # list transactions
    r4 = client.get('/transactions', headers=headers)
    assert r4.status_code == 200, f"List transactions failed: {r4.text}"
    items = r4.json()
    assert isinstance(items, list)
    assert len(items) >= 1
