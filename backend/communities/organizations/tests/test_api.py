import pytest
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization


@pytest.mark.django_db
def test_OrganizationAPIView() -> None:
    """Test OrganizationAPIView

    0. Setup
    1. Test the list view
    2. Check if the response contains the pagination keys
    3. Test if query_param page_size is working properly
    4. Check number of organizations in the response is equal to the number of organizations in the database
    """
    client = APIClient()
    test_page_size = 1
    number_of_orgs = 10

    OrganizationFactory.create_batch(number_of_orgs)
    assert Organization.objects.count() == number_of_orgs

    response = client.get("/v1/communities/organizations/")
    assert response.status_code == 200

    pagination_keys = ["count", "next", "previous", "results"]
    assert all(key in response.data for key in pagination_keys)

    response = client.get(f"/v1/communities/organizations/?pageSize={test_page_size}")
    assert response.status_code == 200
    print(
        {
            "response.data": response.data,
            "response.data['results']": response.data["results"],
        }
    )

    assert len(response.data["results"]) == test_page_size
    assert response.data["previous"] is None
    assert response.data["next"] is not None
