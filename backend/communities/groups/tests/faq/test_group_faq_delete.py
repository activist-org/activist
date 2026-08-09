# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group FAQ delete methods.
"""

from uuid import uuid4

import pytest
from rest_framework import status

from communities.groups.factories import GroupFactory, GroupFaqFactory
from communities.groups.models import GroupFaq

pytestmark = pytest.mark.django_db


def test_group_faq_delete_no_content_204(authenticated_client):
    """
    Test successful deletion of a group FAQ.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the authenticated client and user.

    Returns
    -------
    None
        This test asserts that the FAQ is deleted successfully with status code 204.
    """
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    group_faq = GroupFaqFactory(group=group)

    response = client.delete(path=f"/v1/communities/group_faqs/{group_faq.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_group_faq_delete_not_found_404(authenticated_client):
    """
    Test deletion of a non-existent FAQ.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the authenticated client and user.

    Returns
    -------
    None
        This test asserts that attempting to delete a non-existent FAQ returns 404.
    """
    client, user = authenticated_client

    invalid_group_faq_id = uuid4()

    response = client.delete(
        path=f"/v1/communities/group_faqs/{invalid_group_faq_id}",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_group_faq_delete_forbidden_403(authenticated_client):
    """
    Test forbidden deletion of a group FAQ.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the authenticated client and user.

    Returns
    -------
    None
        This test asserts that a user cannot delete an FAQ for a group they didn't create (403).
    """
    client, user = authenticated_client

    group = GroupFactory()
    group_faq = GroupFaqFactory(group=group)

    response = client.delete(path=f"/v1/communities/group_faqs/{group_faq.id}")

    response_body = response.json()
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response_body["detail"] == "You are not authorized to delete this FAQ."
    assert GroupFaq.objects.filter(id=group_faq.id).exists()
