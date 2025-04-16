# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL patterns for the authentication app.
"""

from django.urls import path

from authentication import views

app_name = "authentication"

urlpatterns = [
    path(route="sign_up/", view=views.SignUpView.as_view(), name="sign_up"),
    path(route="delete/", view=views.DeleteUserView.as_view(), name="delete"),
    path(route="sign_in/", view=views.SignInView.as_view(), name="sign_in"),
    path(route="pwreset/", view=views.PasswordResetView.as_view(), name="pwreset"),
]
