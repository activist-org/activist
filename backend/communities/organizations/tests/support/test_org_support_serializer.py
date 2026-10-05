# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import OrganizationSupport
from communities.organizations.serializers import OrganizationSupportSerializer

pytestmark = pytest.mark.django_db


def test_org_support_serializer_fields_are_read_only():
    serializer = OrganizationSupportSerializer()

    assert serializer.fields["organization"].read_only is True
    assert serializer.fields["user_supporter"].read_only is True
    assert serializer.fields["org_supporter"].read_only is True
    assert serializer.fields["creation_date"].read_only is True


def test_org_support_serializer_create_with_user_supporter():
    organization = OrganizationFactory()
    user = UserFactory()

    support = OrganizationSupportSerializer().create(
        {"organization": organization, "user_supporter": user}
    )

    assert support.organization == organization
    assert support.user_supporter == user
    assert support.org_supporter is None
    assert OrganizationSupport.objects.filter(id=support.id).exists()
