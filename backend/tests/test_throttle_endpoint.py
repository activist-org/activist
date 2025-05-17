
from .throttle import BaseTestThrottle


class TestRateLimitExampleEndpoint(BaseTestThrottle):
    """
    Implementation of BaseTestThrottle for testing rate limiting on a real endpoint.
    """

    url = "/api/events/"
    anon_throttle = 5
    user_throttle = 7
