# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for Organization Resource Serializer model.
"""

from uuid import uuid4

import pytest
from rest_framework import serializers

from communities.organizations.factories import OrganizationFactory
from communities.organizations.serializers import OrganizationResourceSerializer


@pytest.mark.django_db
def test_validate_org_with_org_instance():
    """
    Should return the same organization when an Organization instance is passed.
    """
    org = OrganizationFactory()
    serializer = OrganizationResourceSerializer()
    result = serializer.validate_org(org)
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_valid_uuid():
    """
    Should fetch and return the organization when a valid UUID is given.
    """
    org = OrganizationFactory()
    serializer = OrganizationResourceSerializer()
    result = serializer.validate_org(org.id)
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_valid_uuid_string():
    """
    Should fetch and return the organization when a valid UUID string is given.
    """
    org = OrganizationFactory()
    serializer = OrganizationResourceSerializer()
    result = serializer.validate_org(str(org.id))
    assert result == org


@pytest.mark.django_db
def test_validate_org_with_nonexistent_uuid():
    """
    Should raise ValidationError when a valid UUID format but non-existent organization is provided.
    """
    serializer = OrganizationResourceSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Organization not found."):
        serializer.validate_org(non_existent_uuid)


@pytest.mark.django_db
def test_validate_org_with_nonexistent_uuid_string():
    """
    Should raise ValidationError when a valid UUID string format but non-existent organization is provided.
    """
    serializer = OrganizationResourceSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Organization not found."):
        serializer.validate_org(str(non_existent_uuid))
