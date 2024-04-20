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
from faker import Faker


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
    """Test the signup function.

    Scenarios:

    1. Password strength fails
    2. Password confirmation fails
    3. User is created successfully
       - Check response status code
       - Check if user exists in the DB
       - Check if user password is hashed
         (simple check if the password in the DB is the same as the raw password)
    4. User already exists / Username already exists
    5. Different User with the same email already exists

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

    assert response.status_code == 201
    assert UserModel.objects.filter(username=username).exists()
    assert UserModel.objects.get(username=username).password != strong_password

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

    # 5. Different User with the same email already exists
    response = client.post(
        path="/v1/auth/signup/",
        data={
            "username": second_username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )
    assert response.status_code == 400
    assert not UserModel.objects.filter(username=second_username).exists()
