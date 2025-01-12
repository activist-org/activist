# SPDX-License-Identifier: AGPL-3.0-or-later
from rest_framework.test import APIClient


def test_swagger_download(api_client: APIClient) -> None:
    uri = "/v1/schema/"
    response = api_client.get(uri)
    assert response.status_code == 200


def test_swagger_ui(api_client: APIClient) -> None:
    uri = "/v1/schema/swagger-ui/"
    response = api_client.get(uri)
    assert response.status_code == 200
