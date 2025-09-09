# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for Organization, Group, and Event SocialLinks.
"""

from uuid import uuid4

import pytest
from django.utils import timezone
from django.utils.timezone import now
from faker import Faker
from rest_framework import serializers, status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupSocialLinkFactory
from communities.groups.models import Group, GroupSocialLink
from communities.groups.serializers import GroupSocialLinkSerializer
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)
from communities.organizations.models import OrganizationSocialLink
from communities.organizations.serializers import OrganizationSocialLinkSerializer
from content.factories import EntityLocationFactory
from content.models import SocialLink
from events.factories import EventFactory, EventSocialLinkFactory
from events.models import EventSocialLink
from events.serializers import EventSocialLinkSerializer

# MARK: SocialLink Model


@pytest.mark.django_db
def test_create_social_link() -> None:
    """
    Test the creation of a social link from its model.
    """
    social_link = SocialLink.objects.create(
        link="https://example.com", label="Example", order=1
    )
    assert social_link.id is not None
    assert social_link.creation_date is not None
    assert social_link.last_updated is not None
    assert str(social_link) == "Example"


# MARK: Serializers


@pytest.mark.django_db
def test_organization_social_link_serializer() -> None:
    """
    Test the serializer of an organization social link.
    """
    social_link = OrganizationSocialLink(
        id=uuid4(),
        link="https://example.com",
        label="Example",
        order=1,
        creation_date=now(),
        last_updated=now(),
    )
    serializer = OrganizationSocialLinkSerializer(social_link)
    data = serializer.data

    assert data["link"] == "https://example.com"
    assert data["label"] == "Example"
    assert data["order"] == 1


@pytest.mark.django_db
def test_validate_org_with_org_instance():
    """
    Should return the same organization when an Organization instance is passed.
    """
    org = OrganizationFactory()
    serializer = OrganizationSocialLinkSerializer()
    result = serializer.validate_org(org)
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_valid_uuid():
    """
    Should fetch and return the organization when a valid UUID is given.
    """
    org = OrganizationFactory()
    serializer = OrganizationSocialLinkSerializer()
    result = serializer.validate_org(org.id)
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_valid_uuid_string():
    """
    Should fetch and return the organization when a valid UUID string is given.
    """
    org = OrganizationFactory()
    serializer = OrganizationSocialLinkSerializer()
    result = serializer.validate_org(str(org.id))
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_nonexistent_uuid():
    """
    Should raise ValidationError when a valid UUID format but non-existent organization is provided.
    """
    serializer = OrganizationSocialLinkSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Organization not found."):
        serializer.validate_org(non_existent_uuid)


@pytest.mark.django_db
def test_validate_org_with_nonexistent_uuid_string():
    """
    Should raise ValidationError when a valid UUID string format but non-existent organization is provided.
    """
    serializer = OrganizationSocialLinkSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Organization not found."):
        serializer.validate_org(str(non_existent_uuid))


@pytest.mark.django_db
def test_group_social_link_serializer() -> None:
    """
    Test the serializer of a group social link.
    """
    social_link = GroupSocialLink(
        id=uuid4(),
        link="https://example.com",
        label="Example",
        order=1,
        creation_date=now(),
        last_updated=now(),
    )
    serializer = GroupSocialLinkSerializer(social_link)
    data = serializer.data

    assert data["link"] == "https://example.com"
    assert data["label"] == "Example"
    assert data["order"] == 1


@pytest.mark.django_db
def test_validate_group_with_group_instance():
    """
    Should return the same group when a Group instance is passed.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    serializer = GroupSocialLinkSerializer()
    result = serializer.validate_group(group)
    assert result == group


@pytest.mark.django_db
def test_validate_group_with_valid_uuid():
    """
    Should fetch and return the group when a valid UUID is given.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    serializer = GroupSocialLinkSerializer()
    result = serializer.validate_group(group.id)
    assert result == group


@pytest.mark.django_db
def test_validate_group_with_invalid_uuid():
    """
    Should raise ValidationError when group does not exist.
    """
    group_faq_serializer = GroupSocialLinkSerializer()
    fake_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Group not found."):
        group_faq_serializer.validate_group(fake_uuid)


@pytest.mark.django_db
def test_event_social_link_serializer() -> None:
    """
    Test the serializer of an event social link.
    """
    social_link = EventSocialLink(
        id=uuid4(),
        link="https://example.com",
        label="Example",
        order=1,
        creation_date=now(),
        last_updated=now(),
    )
    serializer = EventSocialLinkSerializer(social_link)
    data = serializer.data

    assert data["link"] == "https://example.com"
    assert data["label"] == "Example"
    assert data["order"] == 1


@pytest.mark.django_db
def test_validate_event_with_event_instance():
    """
    Should return the same event when an Event instance is passed.
    """
    event = EventFactory()
    serializer = EventSocialLinkSerializer()
    result = serializer.validate_event(event)
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_valid_uuid():
    """
    Should fetch and return the event when a valid UUID is given.
    """
    event = EventFactory()
    serializer = EventSocialLinkSerializer()
    result = serializer.validate_event(event.id)
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_valid_uuid_string():
    """
    Should fetch and return the event when a valid UUID string is given.
    """
    event = EventFactory()
    serializer = EventSocialLinkSerializer()
    result = serializer.validate_event(str(event.id))
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_nonexistent_uuid():
    """
    Should raise ValidationError when a valid UUID format but non-existent event is provided.
    """
    serializer = EventSocialLinkSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Event not found."):
        serializer.validate_event(non_existent_uuid)


@pytest.mark.django_db
def test_validate_event_with_nonexistent_uuid_string():
    """
    Should raise ValidationError when a valid UUID string format but non-existent event is provided.
    """
    serializer = EventSocialLinkSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Event not found."):
        serializer.validate_event(str(non_existent_uuid))


# MARK: Views - List


@pytest.mark.django_db
def test_organization_social_link_list_view(client: APIClient) -> None:
    """
    Test the listing of social links for an organization.
    This is like a GET request.
    """
    org = OrganizationFactory()
    num_links = 3
    OrganizationSocialLinkFactory.create_batch(num_links, org=org)

    response = client.get(f"/v1/communities/organizations/{org.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["socialLinks"]) == num_links


@pytest.mark.django_db
def test_group_social_link_list_view(client: APIClient) -> None:
    """
    Test the listing of social links for a group.
    This is like a GET request.
    """
    group = GroupFactory()
    num_links = 3
    GroupSocialLinkFactory.create_batch(num_links, group=group)

    response = client.get(f"/v1/communities/groups/{group.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["socialLinks"]) == num_links


@pytest.mark.django_db
def test_event_social_link_list_view(client: APIClient) -> None:
    """
    Test the listing of social links for an event.
    This is like a GET request.
    """
    event = EventFactory()
    num_links = 3
    EventSocialLinkFactory.create_batch(num_links, event=event)

    response = client.get(f"/v1/events/events/{event.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["socialLinks"]) == num_links


# MARK: Views - Create


@pytest.mark.django_db
def test_organization_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for an organization.
    The API uses PUT method instead of POST.
    """

    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory(created_by=user)
    num_links = 3
    OrganizationSocialLinkFactory.create_batch(num_links, org=org)
    assert OrganizationSocialLink.objects.count() == num_links

    test_id = OrganizationSocialLink.objects.first().id
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    login_body = login.json()
    token = login_body["token"]

    formData = {"link": "https://example.com", "label": "Example", "order": 1}

    response = client.put(
        f"/v1/communities/organization_social_links/{test_id}",
        formData,
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    assert OrganizationSocialLink.objects.count() == num_links


@pytest.mark.django_db
def test_group_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for a group.
    The API uses PUT method instead of POST.
    """

    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    group = GroupFactory(created_by=user)
    num_links = 3
    GroupSocialLinkFactory.create_batch(num_links, group=group)
    assert GroupSocialLink.objects.count() == num_links

    test_id = GroupSocialLink.objects.first().id
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    login_body = login.json()
    token = login_body["token"]

    formData = {"link": "https://example.com", "label": "Example", "order": 1}

    response = client.put(
        f"/v1/communities/group_social_links/{test_id}",
        formData,
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    assert GroupSocialLink.objects.count() == num_links


@pytest.mark.django_db
def test_event_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for an event.
    The API uses PUT method instead of POST.
    """

    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    event = EventFactory(created_by=user)
    num_links = 3
    EventSocialLinkFactory.create_batch(num_links, event=event)
    assert EventSocialLink.objects.count() == num_links

    test_id = EventSocialLink.objects.first().id
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    login_body = login.json()
    token = login_body["token"]

    formData = {"link": "https://example.com", "label": "Example", "order": 1}

    response = client.put(
        f"/v1/events/event_social_links/{test_id}",
        formData,
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    assert EventSocialLink.objects.count() == num_links


def test_social_link_str_method():
    """
    Test the __str__ method of the SocialLink model.
    """
    social_link = SocialLink(
        id=uuid4(),
        link="https://example.com",
        label="Example",
        order=1,
        creation_date=timezone.now(),
        last_updated=timezone.now(),
    )
    assert str(social_link) == social_link.label
