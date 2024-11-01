from typing import Any

from django import forms
from django.contrib import admin  # noqa: I001
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserTask,
    UserTopic,
)

# MARK: Main Tables

# Remove default Group.
admin.site.unregister(Group)
admin.site.register(Support)

# MARK: Bridge Tables

admin.site.register(UserResource)
admin.site.register(UserTask)
admin.site.register(UserTopic)
admin.site.register(SupportEntityType)

# MARK: Methods


class UserCreationForm(forms.ModelForm[UserModel]):
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
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")

        return password2

    def save(self, commit: bool = True) -> UserModel:
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()

        return user


class UserChangeForm(forms.ModelForm[UserModel]):
    """
    A form for updating users.

    Includes all the fields on the user.
    Replaces the password field with admin's disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = UserModel
        fields = "__all__"


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances.
    form = UserChangeForm  # type: ignore
    add_form = UserCreationForm

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


# Register the new UserAdmin.
admin.site.register(UserModel, UserAdmin)
