def test_swagger_download(api_client):
    uri = "/v1/schema/"
    response = api_client.get(uri)
    assert response.status_code == 200


def test_swagger_ui(api_client):
    uri = "/v1/schema/swagger-ui/"
    response = api_client.get(uri)
    assert response.status_code == 200
