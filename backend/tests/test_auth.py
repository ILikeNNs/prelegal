def test_signup_creates_user_and_logs_in(client):
    response = client.post("/api/auth/signup", json={"email": "a@example.com", "password": "hunter22"})

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "a@example.com"
    assert "password" not in body
    assert "session" in response.cookies

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "a@example.com"


def test_signup_password_too_short_is_rejected(client):
    response = client.post("/api/auth/signup", json={"email": "short@example.com", "password": "abc"})

    assert response.status_code == 422


def test_signup_password_over_bcrypt_limit_is_rejected(client):
    response = client.post(
        "/api/auth/signup", json={"email": "long@example.com", "password": "a" * 73}
    )

    assert response.status_code == 422


def test_signup_duplicate_email_is_rejected(client):
    client.post("/api/auth/signup", json={"email": "dup@example.com", "password": "hunter22"})

    response = client.post("/api/auth/signup", json={"email": "dup@example.com", "password": "otherpass"})

    assert response.status_code == 409


def test_signin_with_correct_credentials_logs_in(client):
    client.post("/api/auth/signup", json={"email": "b@example.com", "password": "hunter22"})
    client.post("/api/auth/signout")

    response = client.post("/api/auth/signin", json={"email": "b@example.com", "password": "hunter22"})

    assert response.status_code == 200
    assert response.json()["email"] == "b@example.com"


def test_signin_with_wrong_password_is_rejected(client):
    client.post("/api/auth/signup", json={"email": "c@example.com", "password": "hunter22"})
    client.post("/api/auth/signout")

    response = client.post("/api/auth/signin", json={"email": "c@example.com", "password": "wrong"})

    assert response.status_code == 401


def test_signin_with_unknown_email_is_rejected(client):
    response = client.post("/api/auth/signin", json={"email": "nobody@example.com", "password": "hunter22"})

    assert response.status_code == 401


def test_me_without_session_is_unauthorized(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401


def test_signout_clears_session(client):
    client.post("/api/auth/signup", json={"email": "d@example.com", "password": "hunter22"})

    signout = client.post("/api/auth/signout")
    assert signout.status_code == 204

    me = client.get("/api/auth/me")
    assert me.status_code == 401
