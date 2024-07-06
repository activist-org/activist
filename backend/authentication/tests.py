"""
Testing for the authentication app.
"""

# mypy: ignore-errors
import pytest
from .factories import (
    SupportEntityTypeFactory,
    SupportFactory,
    UserFactory,
    UserResourceFactory,
    UserTaskFactory,
    UserTopicFactory,
)
from .models import UserModel

from django.test import Client
from django.core import mail
from faker import Faker

from .models import UserModel
from django.test import Client
from uuid import UUID
import uuid


@pytest.mark.django_db
def test_str_methods() -> None:
    support_entity_type = SupportEntityTypeFactory.build()
    support = SupportFactory.build()
    user = UserFactory.build()
    user_resource = UserResourceFactory.build()
    user_task = UserTaskFactory.build()
    user_topic = UserTopicFactory.build()

    assert str(support_entity_type) == support_entity_type.name
    assert str(support) == str(support.id)
    assert str(user) == user.username
    assert str(user_resource) == str(user_resource.id)
    assert str(user_task) == str(user_task.id)
    assert str(user_topic) == str(user_topic.id)


@pytest.mark.django_db
def test_signup(client: Client) -> None:
    """
    Test the signup function.

    Scenarios:
    1. Password strength fails
    2. Password confirmation fails
    3. User is created successfully with an email
        - Check response status code
        - Check if user exists in the DB
        - Check if user password is hashed
    4. User already exists
    5. User is created without an email
    """
    # Setup
    fake = Faker()
    username = fake.name()
    second_username = fake.name()
    email = fake.email()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    wrong_password_confirmed = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    weak_password = fake.password(
        length=8, special_chars=False, digits=False, upper_case=False
    )

    # 1. Password strength fails
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": username,
            "password": weak_password,
            "password_confirmed": weak_password,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()

    # 2. Password confirmation fails
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": wrong_password_confirmed,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()

    # 3. User is created successfully
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )
    user = UserModel.objects.filter(username=username).first()
    assert response.status_code == 201
    assert UserModel.objects.filter(username=username)
    # code for Email confirmation is generated and is a UUID
    assert isinstance(user.verification_code, UUID)
    assert user.is_confirmed is False
    # Confirmation Email was sent
    assert len(mail.outbox) == 1
    # Assert that the password within the dashboard is hashed and not the original string.
    assert user.password != strong_password

    # 4. User already exists
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert UserModel.objects.filter(username=username).count() == 1

    # 5. User is created without an email
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": second_username,
            "password": strong_password,
            "password_confirmed": strong_password,
        },
    )

    user = UserModel.objects.filter(username=second_username).first()
    assert response.status_code == 201
    assert UserModel.objects.filter(username=second_username).exists()
    assert user.email == ""
    assert user.is_confirmed is False
    assert user.verification_code is None


@pytest.mark.django_db
def test_login(client: Client) -> None:
    """
    Test login view.

    Scenarios:
    1. User that signed up with email, that has not confirmed their email
    2. User that signed up with email, confimred email address. Is logged in successfully
    3. User exists but password is incorrect
    4. User does not exists and tries to login
    """
    # Setup
    plaintext_password = "Activist@123!?"
    user = UserFactory(plaintext_password=plaintext_password)

    # 1. User that signed up with email, that has not confirmed their email
    response = client.post(
        path="/v1/auth/login/",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 400

    # 2. User that signed up with email, confimred email address. Is logged in successfully
    user.is_confirmed = True
    user.save()
    response = client.post(
        path="/v1/auth/login/",
        data={"email": user.email, "password": plaintext_password},
    )
    assert response.status_code == 200
    # login via username
    response = client.post(
        path="/v1/auth/login/",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 200

    # 3. User exists but password is incorrect
    response = client.post(
        path="/v1/auth/login/",
        data={"email": user.email, "password": "Strong_But_Incorrect?!123"},
    )
    assert response.status_code == 400

    # 4. User does not exists and tries to login
    response = client.post(
        path="/v1/auth/login/",
        data={"email": "unknown_user@example.com", "password": "Password@123!?"},
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_pwreset(client: Client) -> None:
    """
    Test password reset view.

    Scenarios:
    1. Password reset email is sent successfully
    2. Password reset with invalid email
    3. Password reset is performed successfully
    4. Password reset with invalid verification code
    """
    # Setup
    old_password = "password123!?"
    new_password = "Activist@123!?"

    # 1. User exists and password reset is successful
    user = UserFactory(plaintext_password=old_password)
    response = client.get(
        path="/v1/auth/pwreset/",
        data={"email": user.email},
    )
    assert response.status_code == 200
    assert len(mail.outbox) == 1

    # 2. Password reset with invalid email
    response = client.get(
        path="/v1/auth/pwreset/", data={"email": "invalid_email@example.com"}
    )
    assert response.status_code == 404

    # 3. Password reset is performed successfully
    user.verification_code = uuid.uuid4()
    user.save()
    response = client.post(
        path=f"/v1/auth/pwreset/?code={user.verification_code}",
        data={"password": new_password},
    )
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password(new_password)

    # 4. Password reset with invalid verification code
    response = client.post(
        path="/v1/auth/pwreset/invalid_code/",
        data={"password": new_password},
    )
    assert response.status_code == 404
