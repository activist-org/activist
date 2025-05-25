# SPDX-License-Identifier: AGPL-3.0-or-later
"""Custom permissions for the Activist project."""

from typing import Any

from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsAdminStaffCreatorOrReadOnly(BasePermission):
    """
    Allow creators or admin/staff to edit; read-only for others.

    Custom permission to only allow creators of an object or admin/staff
    users to edit it. Read operations are allowed for any request.
    """

    message = "You are not authorized to update this group"

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Check if the user has permission for the action.

        Allow read-only methods for any request (authenticated or not).
        For write methods, require the user to be authenticated.

        Parameters
        ----------
        request : Request
            The current request.
        view : APIView
            The current view.

        Returns
        -------
        bool
            True if the user has permission, False otherwise.
        """
        if request.method in SAFE_METHODS:
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        """
        Check if the user has permission for the specific object.

        Read permissions are allowed to any request.
        Write permissions are only allowed to the creator of the group,
        or admin/staff users.

        Parameters
        ----------
        request : Request
            The current request.
        view : APIView
            The current view.
        obj : Any
            The object being accessed.

        Returns
        -------
        bool
            True if the user has permission, False otherwise.
        """

        if request.method in SAFE_METHODS:
            return True

        return (
            obj.created_by == request.user
            or request.user.is_staff
            or request.user.is_superuser
        )
