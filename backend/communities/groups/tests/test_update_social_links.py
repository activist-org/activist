
from django.test import Client



def test_update_social_links(client: Client):
    """
    Test cases:
        1. Group id does not exist.
        2. Group id exists and is updated as an authenticated user.
        3. Group id exists and is updates as a non-authenticated user.
    """
    pass
