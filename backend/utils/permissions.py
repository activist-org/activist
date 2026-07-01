# SPDX-License-Identifier: AGPL-3.0-or-later
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from authentication.models import UserModel


class IsAdmin(BasePermission):
    """
    Custom permissions for Admin role.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Obtain permission if admin.
        """
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserModel.Roles.admin
        )


class IsCoOrdinator(BasePermission):
    """
    Custom permissions for Co-ordinator role.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Obtain permission if Co-Oridinator.
        """
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserModel.Roles.coordinator
        )


class IsMember(BasePermission):
    """
    Custom permissions for Member role.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Obtain permission if Member.
        """
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserModel.Roles.member
        )


class IsAllies(BasePermission):
    """
    Custom permissions for Ally role.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Obtain permission if Allies.
        """
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserModel.Roles.allies
        )


class IsUser(BasePermission):
    """
    Custom permissions for User role.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Obtain permission if user.
        """
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserModel.Roles.user
        )
