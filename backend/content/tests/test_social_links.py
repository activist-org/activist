# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for Organization, Group, and Event SocialLinks.
"""

from uuid import uuid4

import pytest
from django.utils.timezone import now
from rest_framework import status
from rest_framework.test import APIClient

from communities.groups.factories import GroupFactory, GroupSocialLinkFactory
from communities.groups.models import GroupSocialLink
from communities.groups.serializers import GroupSocialLinkSerializer
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)
from communities.organizations.models import OrganizationSocialLink
from communities.organizations.serializers import OrganizationSocialLinkSerializer
from content.models import SocialLink
from events.factories import EventFactory, EventSocialLinkFactory
from events.models import EventSocialLink
from events.serializers import EventSocialLinkSerializer

#  Mark: Social link Model


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


# Mark: Serializers


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


# Mark: Views - List


@pytest.mark.django_db
def test_organization_social_link_list_view(client: APIClient) -> None:
    """
    Test the listing of social links for an organization.
    This is like a GET request.
    """
    org = OrganizationFactory()
    num_links = 3
    OrganizationSocialLinkFactory.create_batch(num_links, org=org)

    response = client.get(f"/v1/communities/organizations/{org.id}/")

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

    response = client.get(f"/v1/communities/groups/{group.id}/")

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

    response = client.get(f"/v1/events/events/{event.id}/")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["socialLinks"]) == num_links


# Mark: Views - Create


@pytest.mark.django_db
def test_organization_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for an organization.
    The API uses PUT method instead of POST.
    """
    org = OrganizationFactory()
    num_links = 3
    OrganizationSocialLinkFactory.create_batch(num_links, org=org)
    assert OrganizationSocialLink.objects.count() == num_links

    formData = [{"link": "https://example.com", "label": "Example", "order": 1}]

    response = client.put(
        f"/v1/communities/organization_social_links/{org.id}/",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    # The PUT method will delete all existing social links and replace them with the ones in formData.
    assert OrganizationSocialLink.objects.count() == 1


@pytest.mark.django_db
def test_group_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for a group.
    The API uses PUT method instead of POST.
    """
    group = GroupFactory()
    num_links = 3
    GroupSocialLinkFactory.create_batch(num_links, group=group)
    assert GroupSocialLink.objects.count() == num_links

    formData = [{"link": "https://example.com", "label": "Example", "order": 1}]

    response = client.put(
        f"/v1/communities/group_social_links/{group.id}/",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    # The PUT method will delete all existing social links and replace them with the ones in formData.
    assert GroupSocialLink.objects.count() == 1


@pytest.mark.django_db
def test_event_social_link_create_view(client: APIClient) -> None:
    """
    Test the creation of social links for an event.
    The API uses PUT method instead of POST.
    """
    event = EventFactory()
    num_links = 3
    EventSocialLinkFactory.create_batch(num_links, event=event)
    assert EventSocialLink.objects.count() == num_links

    formData = [{"link": "https://example.com", "label": "Example", "order": 1}]

    response = client.put(
        f"/v1/events/event_social_links/{event.id}/",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    # The PUT method will delete all existing social links and replace them with the ones in formData.
    assert EventSocialLink.objects.count() == 1
