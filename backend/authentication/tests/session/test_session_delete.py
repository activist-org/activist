# SPDX-License-Identifier: AGPL-3.0-or-later

# import pytest
# from rest_framework.test import APIClient

# from authentication.factories import SessionFactory, UserFactory
# from authentication.models import SessionModel

# pytestmark = pytest.mark.django_db


# def test_session_delete():
#     client = APIClient()

#     test_username = "test_user"
#     test_password = "test_pass"
#     user = UserFactory(username=test_username, plaintext_password=test_password)
#     user.is_confirmed = True
#     user.verified = True
#     user.save()

#     login = client.post(
#         path="/v1/auth/sign_in",
#         data={"username": test_username, "password": test_password},
#     )

#     assert login.status_code == 200

#     login_body = login.json()
#     token = login_body["access"]

#     client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
#     response = client.delete(path="/v1/auth/session", data={"user": user.id})

#     assert response.status_code == 204
