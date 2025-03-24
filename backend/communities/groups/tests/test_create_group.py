import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_create_group(client: Client) -> None:
    """
    Test cases:
        1. Test for creating a group as an authenticated user.
        2. Test for creating a group as a non-authenticated user.
    """
    # 1. Test case to create a group as an authenticated user.
    group = GroupFactory.create()
    group_name = group.name
    group_tagline = group.tagline
    group_creation = group.creation_date
    group_terms = group.terms_checked
    group_category = group.category
    group_location = group.location

    user = UserFactory()
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in/", data={"email": user.email, "password": user.password}
    )
    if login_response.status_code == 200:
        response = client.post(
            path="/v1/communities/groups/",
            data={
                "name": group_name,
                "tagline": group_tagline,
                "creation_date": group_creation,
                "terms_checked": group_terms,
                "category": group_category,
                "locations": group_location,
            },
        )

        assert response.status_code == 201

    # 2. Test case to create a group as a non-authenticated uesr.
    response = client.post(
        path="/v1/communities/groups/",
        data={
            "name": group_name,
            "tagline": group_tagline,
            "creation_date": group_creation,
            "terms_checked": group_terms,
            "category": group_category,
            "locations": group_location,
        },
    )

    assert response.status_code == 400
