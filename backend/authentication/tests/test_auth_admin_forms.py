# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for authentication.admin.
"""

import logging

import pytest
from django.contrib import admin
from django.contrib.auth.hashers import check_password
from django.test import RequestFactory

from authentication.admin import (
    UserAdmin,
    UserChangeForm,
    UserCreationForm,
    UserFlagAdmin,
)
from authentication.factories import UserFactory
from authentication.models import UserFlag, UserModel

pytestmark = pytest.mark.django_db


def test_auth_admin_forms_user_creation_form_valid():
    """
    Ensure UserCreationForm creates a user when passwords match.
    """
    form_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "password1": "SecurePass123!",
        "password2": "SecurePass123!",
    }
    form = UserCreationForm(data=form_data)
    assert form.is_valid()

    user = form.save()
    assert user.email == "testuser@example.com"
    assert check_password("SecurePass123!", user.password)


def test_auth_admin_forms_user_creation_form_password_mismatch():
    """
    Ensure UserCreationForm fails when passwords do not match.
    """
    form_data = {
        "email": "mismatch@example.com",
        "username": "mismatchuser",
        "password1": "Password1",
        "password2": "Password2",
    }
    form = UserCreationForm(data=form_data)
    assert not form.is_valid()
    assert "Passwords don't match" in form.errors["password2"]


def test_auth_admin_forms_user_change_form_password_readonly():
    """
    Ensure UserChangeForm shows hashed password as read-only.
    """
    user = UserFactory()
    form = UserChangeForm(instance=user)
    assert "password" in form.fields


def test_auth_admin_forms_user_model_registered_with_user_admin():
    """
    Ensure UserModel is registered in admin using UserAdmin.
    """
    model_admin = admin.site._registry.get(UserModel)
    assert model_admin is not None
    assert isinstance(model_admin, UserAdmin)


def test_auth_admin_forms_user_admin_list_display():
    """
    Ensure UserAdmin.list_display contains expected fields.
    """
    user_admin = UserAdmin(UserModel, admin.site)
    assert "username" in user_admin.list_display
    assert "email" in user_admin.list_display
    assert "is_admin" in user_admin.list_display


def test_auth_admin_forms_user_admin_fieldsets_titles():
    """
    Ensure UserAdmin.fieldsets include expected section titles.
    """
    user_admin = UserAdmin(UserModel, admin.site)
    fieldset_titles = [fs[0] for fs in user_admin.fieldsets]
    assert "Personal info" in fieldset_titles
    assert "Permissions" in fieldset_titles
    assert "Verification" in fieldset_titles


def test_auth_admin_forms_user_admin_save_model_logs(caplog):
    """
    Ensure UserAdmin.save_model correctly logs user creations and updates.
    """
    user_admin = UserAdmin(UserModel, admin.site)
    target_user = UserFactory()
    request_user = UserFactory()

    request = RequestFactory().get("/admin/authentication/usermodel/")
    request.user = request_user

    # Test update (change=True).
    with caplog.at_level(logging.INFO, logger="authentication.admin"):
        user_admin.save_model(request, target_user, form=None, change=True)

    assert (
        f"Updated user via admin: {target_user.email} (by {request_user})"
        in caplog.text
    )

    caplog.clear()

    # Test creation (change=False).
    with caplog.at_level(logging.INFO, logger="authentication.admin"):
        user_admin.save_model(request, target_user, form=None, change=False)

    assert (
        f"Created user via admin: {target_user.email} (by {request_user})"
        in caplog.text
    )


def test_auth_admin_forms_user_flag_admin_save_model_logs(caplog):
    """
    Ensure UserFlagAdmin.save_model correctly logs user flag creations and updates.
    """
    user_flag_admin = UserFlagAdmin(UserFlag, admin.site)

    request_user = UserFactory()
    flagged_user = UserFactory()
    creator_user = UserFactory()

    target_flag = UserFlag(user=flagged_user, created_by=creator_user)

    request = RequestFactory().get("/admin/authentication/userflag/")
    request.user = request_user

    # Test update (change=True).
    with caplog.at_level(logging.INFO, logger="authentication.admin"):
        user_flag_admin.save_model(request, target_flag, form=None, change=True)

    assert (
        f"Updated user flag: {flagged_user.email} -> {creator_user} (by {request_user})"
        in caplog.text
    )

    caplog.clear()

    # Test creation (change=False).
    with caplog.at_level(logging.INFO, logger="authentication.admin"):
        user_flag_admin.save_model(request, target_flag, form=None, change=False)

    assert (
        f"Created user flag: {flagged_user.email} -> {creator_user} (by {request_user})"
        in caplog.text
    )


def test_auth_admin_forms_user_flag_admin_delete_model_logs(caplog):
    """
    Ensure UserFlagAdmin.delete_model correctly logs user flag deletions.
    """
    user_flag_admin = UserFlagAdmin(UserFlag, admin.site)

    request_user = UserFactory()
    flagged_user = UserFactory()
    creator_user = UserFactory()

    target_flag = UserFlag.objects.create(user=flagged_user, created_by=creator_user)

    request = RequestFactory().get("/admin/authentication/userflag/")
    request.user = request_user

    # Execute the deletion and capture the logs.
    with caplog.at_level(logging.INFO, logger="authentication.admin"):
        user_flag_admin.delete_model(request, target_flag)

    # Assert the log message was generated correctly.
    assert (
        f"Deleted user flag: {flagged_user.email} -> {creator_user} (by {request_user})"
        in caplog.text
    )

    # Verify the object was actually deleted from the database.
    assert not UserFlag.objects.filter(pk=target_flag.pk).exists()
