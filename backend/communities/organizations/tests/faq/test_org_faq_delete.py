# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)
from communities.organizations.models import OrganizationFaq


@pytest.mark.django_db
def test_org_faq_delete_unauthorized_401(api_client) -> None:
    creator = UserFactory.create(is_confirmed=True)
    org = OrganizationFactory.create(created_by=creator)
    faq = OrganizationFaqFactory.create(org=org)

    response = api_client.delete(f"/v1/communities/organization_faqs/{faq.id}")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert OrganizationFaq.objects.filter(id=faq.id).exists()


@pytest.mark.django_db
def test_org_faq_delete_forbidden_403(authenticated_client) -> None:
    client, _ = authenticated_client
    creator = UserFactory.create(is_confirmed=True)
    org = OrganizationFactory.create(created_by=creator)
    faq = OrganizationFaqFactory.create(org=org)

    response = client.delete(f"/v1/communities/organization_faqs/{faq.id}")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["detail"] == "You are not authorized to delete this FAQ."
    assert OrganizationFaq.objects.filter(id=faq.id).exists()


@pytest.mark.django_db
def test_org_faq_delete_success(authenticated_client) -> None:
    client, user = authenticated_client
    org = OrganizationFactory.create(created_by=user)
    faq = OrganizationFaqFactory.create(org=org)

    response = client.delete(f"/v1/communities/organization_faqs/{faq.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.data["message"] == "FAQ deleted successfully."
    assert not OrganizationFaq.objects.filter(id=faq.id).exists()


@pytest.mark.django_db
def test_org_faq_delete_staff_success(authenticated_client) -> None:
    client, user = authenticated_client
    user.is_staff = True
    user.save()

    creator = UserFactory.create(is_confirmed=True)
    org = OrganizationFactory.create(created_by=creator)
    faq = OrganizationFaqFactory.create(org=org)

    response = client.delete(f"/v1/communities/organization_faqs/{faq.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.data["message"] == "FAQ deleted successfully."
    assert not OrganizationFaq.objects.filter(id=faq.id).exists()


@pytest.mark.django_db
def test_org_faq_delete_not_found_404(authenticated_client) -> None:
    client, user = authenticated_client
    user.is_staff = True
    user.save()

    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.delete(f"/v1/communities/organization_faqs/{fake_uuid}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "FAQ not found."


@pytest.mark.django_db
def test_org_faq_delete_multiple_faqs(authenticated_client) -> None:
    """
    Test that multiple FAQs can be deleted independently.
    """
    client, user = authenticated_client

    org = OrganizationFactory.create(created_by=user)

    faq1 = OrganizationFaqFactory.create(org=org)
    faq2 = OrganizationFaqFactory.create(org=org)
    faq3 = OrganizationFaqFactory.create(org=org)

    assert OrganizationFaq.objects.filter(org=org).count() == 3

    response = client.delete(f"/v1/communities/organization_faqs/{faq1.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not OrganizationFaq.objects.filter(id=faq1.id).exists()
    assert OrganizationFaq.objects.filter(org=org).count() == 2

    response = client.delete(f"/v1/communities/organization_faqs/{faq2.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not OrganizationFaq.objects.filter(id=faq2.id).exists()
    assert OrganizationFaq.objects.filter(org=org).count() == 1

    assert OrganizationFaq.objects.filter(id=faq3.id).exists()
