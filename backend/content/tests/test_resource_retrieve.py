# # SPDX-License-Identifier: AGPL-3.0-or-later
# import pytest
# from rest_framework.test import APIClient

# from authentication.factories import UserFactory
# from content.factories import ResourceFactory

# pytestmark = pytest.mark.django_db


# def test_resource_retrieve():
#     client = APIClient()

#     test_user = "test_user"
#     test_pass = "test_pass"
#     user = UserFactory(
#         username=test_user,
#         plaintext_password=test_pass,
#         is_confirmed=True,
#         verified=True,
#     )

#     resource = ResourceFactory.build(is_private=False)

#     # login = client.post(
#     #     path="/v1/auth/sign_in/",
#     #     data={"username": user.username, "password": user.password},
#     # )

#     # assert login.status_code == 200
#     # login_body = login.json()
#     # token = login_body["token"]

#     # client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
#     response = client.get(path=f"/v1/content/resources/{resource.id}/")

#     assert response.status_code == 200
#     body = response.json()
#     print(body)
