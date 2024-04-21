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
def test_login(client: Client) -> None:
    """Test login view.

    Scenarios:
    1. User is logged in successfully
    2. User exists but password is incorrect
    3. User does not exists and tries to login
    """
    # Setup
    plaintext_password = "Activist@123!?"
    user = UserFactory(plaintext_password=plaintext_password)

    # 1. User is logged in successfully
    response = client.post(
        path="/v1/auth/login/",
        data={"email": user.email, "password": plaintext_password},
    )
    assert response.status_code == 200

    # 2. User exists but password is incorrect
    response = client.post(
        path="/v1/auth/login/",
        data={"email": user.email, "password": "Strong_But_Incorrect?!123"},
    )
    assert response.status_code == 400

    # 2. User does not exists and tries to login
    response = client.post(
        path="/v1/auth/login/",
        data={"email": "unknown_user@example.com", "password": "Password@123!?"},
    )
    assert response.status_code == 400
