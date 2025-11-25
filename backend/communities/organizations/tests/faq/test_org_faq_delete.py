# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)
from communities.organizations.models import OrganizationFaq

# Endpoint used for these tests:
ORG_FAQS_URL = "/v1/communities/organization_faqs"


@pytest.mark.django_db
def test_OrganizationFaqViewSet_destroy(authenticated_client) -> None:
    """
    Test OrganizationFaqViewSet destroy method (DELETE request)

    Test cases:
    1. Verify that an unauthenticated user cannot delete an FAQ
    2. Verify that a non-creator, non-staff user cannot delete an FAQ (403 Forbidden)
    3. Verify that the creator can successfully delete an FAQ
    4. Verify that a staff user can delete an FAQ even if they are not the creator
    5. Verify that deleting a non-existent FAQ returns 404
    6. Verify that the FAQ is actually removed from the database after deletion
    """
    client, _ = authenticated_client
    unauthenticated_client = APIClient()

    # Create organization creator
    creator: UserModel = UserFactory.create(is_confirmed=True)

    # Create staff user
    staff_user: UserModel = UserFactory.create(is_confirmed=True, is_staff=True)

    # Create an organization with the creator
    org = OrganizationFactory.create(created_by=creator)

    # Create an FAQ for the organization
    faq = OrganizationFaqFactory.create(org=org)
    assert OrganizationFaq.objects.filter(id=faq.id).exists()

    # MARK: Unauthenticated DELETE

    # Test 1: Unauthenticated user cannot delete FAQ
    response = unauthenticated_client.delete(f"{ORG_FAQS_URL}/{faq.id}")
    assert response.status_code == 401
    assert OrganizationFaq.objects.filter(id=faq.id).exists()

    # MARK: Unauthorized DELETE

    # Test 2: Regular user (not creator, not staff) cannot delete FAQ
    # Using the authenticated_client fixture user who is not the creator
    response = client.delete(f"{ORG_FAQS_URL}/{faq.id}")
    assert response.status_code == 403
    assert response.data["detail"] == "You are not authorized to delete this FAQ."
    assert OrganizationFaq.objects.filter(id=faq.id).exists()

    # MARK: Staff DELETE

    # Test 3: Staff user can delete FAQ even if not the creator
    faq_for_staff = OrganizationFaqFactory.create(org=org)
    assert OrganizationFaq.objects.filter(id=faq_for_staff.id).exists()

    staff_client = APIClient()
    staff_client.force_authenticate(user=staff_user)
    response = staff_client.delete(f"{ORG_FAQS_URL}/{faq_for_staff.id}")
    assert response.status_code == 204
    assert response.data["message"] == "FAQ deleted successfully."
    assert not OrganizationFaq.objects.filter(id=faq_for_staff.id).exists()

    # MARK: Creator DELETE

    # Test 4: Creator can successfully delete their own FAQ
    creator_client = APIClient()
    creator_client.force_authenticate(user=creator)
    response = creator_client.delete(f"{ORG_FAQS_URL}/{faq.id}")
    assert response.status_code == 204
    assert response.data["message"] == "FAQ deleted successfully."
    # Verify FAQ is removed from database
    assert not OrganizationFaq.objects.filter(id=faq.id).exists()

    # MARK: Non-existent FAQ DELETE

    # Test 5: Deleting a non-existent FAQ returns 404
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = creator_client.delete(f"{ORG_FAQS_URL}/{fake_uuid}")
    assert response.status_code == 404
    assert response.data["detail"] == "FAQ not found."


@pytest.mark.django_db
def test_OrganizationFaqViewSet_destroy_multiple_faqs(authenticated_client) -> None:
    """
    Test that multiple FAQs can be deleted independently.

    This verifies that deleting one FAQ doesn't affect other FAQs
    in the same organization.
    """
    client, user = authenticated_client

    # Create an organization with the authenticated user as creator
    org = OrganizationFactory.create(created_by=user)

    # Create multiple FAQs for the organization
    faq1 = OrganizationFaqFactory.create(org=org)
    faq2 = OrganizationFaqFactory.create(org=org)
    faq3 = OrganizationFaqFactory.create(org=org)

    assert OrganizationFaq.objects.filter(org=org).count() == 3

    # Delete first FAQ
    response = client.delete(f"{ORG_FAQS_URL}/{faq1.id}")
    assert response.status_code == 204
    assert not OrganizationFaq.objects.filter(id=faq1.id).exists()
    assert OrganizationFaq.objects.filter(org=org).count() == 2

    # Delete second FAQ
    response = client.delete(f"{ORG_FAQS_URL}/{faq2.id}")
    assert response.status_code == 204
    assert not OrganizationFaq.objects.filter(id=faq2.id).exists()
    assert OrganizationFaq.objects.filter(org=org).count() == 1

    # Verify third FAQ still exists
    assert OrganizationFaq.objects.filter(id=faq3.id).exists()
