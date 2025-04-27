# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Provides functions for exception handling.
"""

import logging
from typing import Any

from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def bad_request_logger(exception: Any, context: dict[str, Any]) -> Response | None:
    """
    Logger for bad requests used within the backend settings.

    Parameters
    ----------
    exception : Any
        An exception raised by a bad request.

    context : dict[str, Any]
        Context of the request to derive attributes like the path.

    Returns
    -------
    Response | None
        The bad response or None.
    """
    # Get the DRF exception handler standard error response.
    response = exception_handler(exc=exception, context=context)

    if response is not None:
        logger.warning(
            f"Bad request: {context['request'].path} -"
            f"Status Code: {response.status_code} -"
            f"Data: {response.data} -"
        )

    return response
