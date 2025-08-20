# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from communities.groups.factories import GroupFactory, GroupImageFactory
from content.factories import ImageFactory

pytestmark = pytest.mark.django_db


@pytest.mark.django_db
def test_group_update_sequence_index(client: Client) -> None:
    """Test updating the sequence index of group images."""
    # Create three images and a group.
    image0 = ImageFactory()
    image1 = ImageFactory()
    image2 = ImageFactory()
    images = [image0, image1, image2]
    group = GroupFactory()
    # Associate images with the group
    for i, image in enumerate(images):
        GroupImageFactory(group=group, image=image, sequence_index=i)
    sequences = [1, 2, 0]
    # Update the sequence index of each image.
    for i, image in enumerate(images):
        response = client.put(
            path=f"/v1/communities/group/{group.id}/images/{image.id}",
            data={
                "sequence_index": sequences[i],
            },
            content_type="application/json",
        )
        assert response.status_code == 200
    # Verify the new sequence order.
    response = client.get(
        path=f"/v1/communities/group/{group.id}/images",
    )
    assert response.status_code == 200
    new_images = response.json()
    expected_order = [image2, image0, image1]
    assert [item["id"] for item in new_images] == [
        str(img.id) for img in expected_order
    ]
