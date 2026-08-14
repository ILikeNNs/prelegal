def test_root_serves_built_frontend(client):
    response = client.get("/")

    assert response.status_code == 200
    assert "Prelegal" in response.text


def test_api_routes_take_priority_over_static_mount(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.headers["content-type"].startswith("application/json")
