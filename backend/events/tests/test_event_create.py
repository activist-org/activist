# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_event_create(authenticated_client) -> None:
    """
    Test event creation.
    """
    client, _ = authenticated_client

    org: Organization = OrganizationFactory.create()
    topic: Topic = TopicFactory.create()

    event_data = {
        "name": "Community Cleanup",
        "tagline": "Join us to clean up the park!",
        "description": "A community event to clean up the local park.",
        "type": "action",
        "location_type": "physical",
        "location": {
            "address_or_name": "123 Park St",
            "city": "Greenville",
            "country_code": "US",
            "lat": "34.0522",
            "lon": "-118.2437",
        },
        "topics": [topic.type],
        "orgs": [str(org.id)],
        "times": [
            {
                "all_day": False,
                "start_time": "2024-07-15T09:00:00Z",
                "end_time": "2024-07-15T12:00:00Z",
            }
        ],
    }

    response = client.post(
        path="/v1/events/events",
        data=event_data,
        format="json",
    )

    assert response.status_code == 201
