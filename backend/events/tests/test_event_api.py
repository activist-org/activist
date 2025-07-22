# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.models import UserModel
from communities.organizations.factories import OrganizationFactory
from content.factories import EntityLocationFactory
from events.factories import EventFactory
from events.models import Event

# Endpoint used for these tests:
EVENTS_URL = "/v1/events/events"


@pytest.mark.django_db
def test_EventListAPIView(authenticated_client) -> None:
    """
    Test OrganizationAPIView

    # GET request

    1. Verify the number of events in the database
    2. Test the list view endpoint
    3. Check if the pagination keys are present
    4. Test if query_param page_size is working properly
    5. Verify the number of events in the response matches the page_size
    6. Check the pagination links in the response

    # POST request

    1. Create a new organization with a valid payload
    2. Verify the response status code is 201 (Created)
    """
    # --- Test GET (authentifié)
    EventFactory.create_batch(10)
    response = authenticated_client.get(EVENTS_URL)
    assert response.status_code == 200

    # --- Test POST anonyme (doit échouer)
    anon_client = APIClient()
    response = anon_client.post(EVENTS_URL)
    assert response.status_code == 401

    # --- Test POST authentifié (succès)
    org = OrganizationFactory.create(org_name="test_org", terms_checked=True)
    new_event = EventFactory.build(name="new_event", terms_checked=True)
    location = EntityLocationFactory.build()

    payload = {
        "name": new_event.name,
        "org_id": org.id,
        "tagline": new_event.tagline,
        "offline_location": {
            "lat": location.lat,
            "lon": location.lon,
            "bbox": location.bbox,
            "display_name": location.display_name,
        },
        "type": new_event.type,
        "start_time": new_event.start_time,
        "end_time": new_event.end_time,
        "terms_checked": new_event.terms_checked,
        "setting": "offline",
    }

    response = authenticated_client.post(EVENTS_URL, data=payload, format="json")
    assert response.status_code == 201
    assert Event.objects.filter(name=new_event.name).exists()


@pytest.mark.django_db
def test_EventDetailAPIView(authenticated_client):
    # Récupère l'utilisateur créé par la fixture
    user = UserModel.objects.first()

    # Crée un event possédé par cet utilisateur
    new_event = EventFactory.create(created_by=user)
    assert Event.objects.filter(name=new_event.name).exists()

    # GET (authentifié)
    response = authenticated_client.get(f"{EVENTS_URL}/{new_event.id}")
    assert response.status_code == 200
    assert response.data["name"] == new_event.name

    # PUT non authentifié
    anon_client = APIClient()
    payload = {
        "name": "new_event",
        "start_time": "2020-09-18T21:39:14",
        "end_time": "2020-09-18T21:39:14",
        "terms_checked": True,
    }
    response = anon_client.put(f"{EVENTS_URL}/{new_event.id}", data=payload, format="json")
    assert response.status_code == 401

    # PUT authentifié
    response = authenticated_client.put(f"{EVENTS_URL}/{new_event.id}", data=payload, format="json")
    assert response.status_code == 200
    assert payload["name"] == Event.objects.get(id=new_event.id).name

    # DELETE non authentifié
    response = anon_client.delete(f"{EVENTS_URL}/{new_event.id}")
    assert response.status_code == 401

    # DELETE authentifié
    response = authenticated_client.delete(f"{EVENTS_URL}/{new_event.id}")
    assert response.status_code == 200
    assert not Event.objects.filter(id=new_event.id).exists()
