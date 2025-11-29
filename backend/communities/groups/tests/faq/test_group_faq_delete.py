# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group FAQ delete methods.
"""

from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupFaqFactory

pytestmark = pytest.mark.django_db


def test_group_faq_delete_204(authenticated_client):
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
    faq = GroupFaqFactory(group=group)

    response = client.delete(path=f"/v1/communities/group_faqs/{faq.id}")

    assert response.status_code == 204


def test_group_faq_delete_404(authenticated_client):
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

    bad_uuid = uuid4()

    response = client.delete(
        path=f"/v1/communities/group_faqs/{bad_uuid}",
    )

    assert response.status_code == 404


def test_group_faq_delete_403(authenticated_client):
    """
    Test unauthorized deletion of a group FAQ.

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
    faq = GroupFaqFactory(group=group)

    response = client.delete(path=f"/v1/communities/group_faqs/{faq.id}")

    response_body = response.json()
    assert response.status_code == 403
    assert response_body["detail"] == "You are not authorized to delete this FAQ."
