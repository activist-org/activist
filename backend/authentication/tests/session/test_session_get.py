# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import SessionFactory, UserFactory
from authentication.models import SessionModel

pytestmark = pytest.mark.django_db


def test_session_get():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    session = SessionModel.objects.create(user=user)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/auth/session/{session.user.id}")

    assert response.status_code == 200


def test_session_get_401():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    SessionFactory.create_batch(5)
    session = SessionModel.objects.all().first()

    response = client.get(path=f"/v1/auth/session/{session.user.id}")

    assert response.status_code == 401


def test_session_get_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    user_2_username = "test_user2"
    user_2_password = "test_user2_pass"
    user_2 = UserFactory(username=user_2_username, plaintext_password=user_2_password)
    user_2.is_confirmed = True
    user_2.verified = True
    user_2.save()

    session = SessionModel.objects.create(user=user_2)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/auth/session/{session.user.id}")

    assert response.status_code == 403


def test_session_get_404():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    bad_uuid = uuid4()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/auth/session/{bad_uuid}")

    assert response.status_code == 404
