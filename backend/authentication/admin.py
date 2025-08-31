# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Admin module for managing user-related models in the authentication app.
"""

import logging
from typing import Any

from django import forms
from django.contrib import admin  # noqa: I001
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from django.http import HttpRequest

from authentication.models import Support, SupportEntityType, UserFlag, UserModel

logger = logging.getLogger(__name__)

# MARK: Register

# Remove default Group.
admin.site.unregister(Group)
admin.site.register(Support)
admin.site.register(SupportEntityType)

# MARK: User Creation


class UserCreationForm(forms.ModelForm):
    """
    A form for creating new users.

    Includes all the required fields, plus a repeated password.
    """

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = UserModel
        fields = ["email"]

    def clean_password2(self) -> Any | None:
        """
        Validate that the two entered passwords match.

        Raises
        -------
        ValidationError
            If the two passwords do not match.

        Returns
        -------
        Any | None
            The second password if valid.
        """
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")

        return password2

    def save(self, commit: bool = True) -> UserModel:
        """
        Save the user instance with a hashed password.

        Parameters
        ----------
        commit : bool, optional, default=True
            Whether to save the user to the database immediately.

        Returns
        -------
        UserModel
            The newly created user instance.
        """
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
            logger.info("Created new user via admin: %s", user.email)

        return user


# MARK: User Change


class UserChangeForm(forms.ModelForm):
    """
    A form for updating users.

    Includes all the fields on the user.
    Replaces the password field with admin's disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = UserModel
        fields = "__all__"


# MARK: User


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances.
    """
    Custom admin interface for the UserModel.

    This class configures the fields, filters, and forms displayed in the Django admin panel.
    """

    class Meta:
        model = UserModel
        fields = "__all__"

    form = UserChangeForm
    add_form = UserCreationForm

    def save_model(
        self, request: HttpRequest, obj: UserModel, form: ModelForm, change: bool
    ) -> None:
        """
        Override to add logging for user updates.

        Parameters
        ----------
        request : HttpRequest
            The request made.

        obj : UserModel
            The user model associated with the request.

        form : ModelForm[Any]
            An array of model forms.

        change : bool
            Whether the user was updated (true) or created.
        """
        super().save_model(request, obj, form, change)
        if change:
            logger.info("Updated user via admin: %s (by %s)", obj.email, request.user)

        else:
            logger.info("Created user via admin: %s (by %s)", obj.email, request.user)

    def delete_model(self, request: HttpRequest, obj: UserModel) -> None:
        """
        Override to add logging for user deletions.

        Parameters
        ----------
        request : HttpRequest
            The request made.

        obj : UserModel
            The user model associated with the request.
        """
        logger.warning("Deleting user via admin: %s (by %s)", obj.email, request.user)
        super().delete_model(request, obj)

    # The fields to be used in displaying the User model.
    list_display = ["username", "email", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        (
            "Personal info",
            {
                "fields": [
                    "username",
                    "name",
                    "description",
                    "is_private",
                    "is_high_risk",
                ]
            },
        ),
        (
            "Verification",
            {"fields": ["verification_method", "verification_partner", "verified"]},
        ),
        ("Permissions", {"fields": ["is_active", "is_staff", "is_admin"]}),
    ]
    # add_fieldsets for creating a new user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": [
                    "email",
                    "username",
                    "password1",
                    "password2",
                    "verification_partner",
                ],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


# MARK: Flag


class UserFlagAdmin(admin.ModelAdmin):
    """
    Admin table for displaying User flags.
    """

    class Meta:
        model = UserFlag
        fields = "__all__"

    list_display = ["user", "created_by", "creation_date"]

    def save_model(
        self, request: HttpRequest, obj: UserFlag, form: ModelForm, change: bool
    ) -> None:
        """
        Override to add logging for user flag operations.

        Parameters
        ----------
        request : HttpRequest
            The request made.

        obj : UserFlag
            The user flag model associated with the request.

        form : ModelForm[Any]
            An array of model forms.

        change : bool
            Whether the user was updated (true) or created.
        """
        super().save_model(request, obj, form, change)
        if change:
            logger.info(
                "Updated user flag: %s -> %s (by %s)",
                obj.user.email,
                obj.created_by,
                request.user,
            )
        else:
            logger.warning(
                "Created user flag: %s -> %s (by %s)",
                obj.user.email,
                obj.created_by,
                request.user,
            )

    def delete_model(self, request: HttpRequest, obj: UserFlag) -> None:
        """
        Override to add logging for user flag deletions.

        Parameters
        ----------
        request : HttpRequest
            The request made.

        obj : UserFlag
            The user flag model associated with the request.
        """
        logger.info(
            "Deleted user flag: %s -> %s (by %s)",
            obj.user.email,
            obj.created_by,
            request.user,
        )
        super().delete_model(request, obj)


# MARK: Register Admin

admin.site.register(UserModel, UserAdmin)
admin.site.register(UserFlag, UserFlagAdmin)
