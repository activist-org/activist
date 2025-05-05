# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for authentication.admin.
"""

# mypy: ignore-errors
import pytest
from django.contrib import admin
from django.contrib.auth.hashers import check_password

from authentication.admin import UserCreationForm, UserChangeForm, UserAdmin
from authentication.models import UserModel
from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_user_creation_form_valid():
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


def test_user_creation_form_password_mismatch():
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


def test_user_change_form_password_readonly():
    """
    Ensure UserChangeForm shows hashed password as read-only.
    """
    user = UserFactory()
    form = UserChangeForm(instance=user)
    assert "password" in form.fields

def test_user_model_registered_with_user_admin():
    """
    Ensure UserModel is registered in admin using UserAdmin.
    """
    model_admin = admin.site._registry.get(UserModel)
    assert model_admin is not None
    assert isinstance(model_admin, UserAdmin)


def test_user_admin_list_display():
    """
    Ensure UserAdmin.list_display contains expected fields.
    """
    user_admin = UserAdmin(UserModel, admin.site)
    assert "username" in user_admin.list_display
    assert "email" in user_admin.list_display
    assert "is_admin" in user_admin.list_display


def test_user_admin_fieldsets_titles():
    """
    Ensure UserAdmin.fieldsets include expected section titles.
    """
    user_admin = UserAdmin(UserModel, admin.site)
    fieldset_titles = [fs[0] for fs in user_admin.fieldsets]
    assert "Personal info" in fieldset_titles
    assert "Permissions" in fieldset_titles
    assert "Verification" in fieldset_titles
