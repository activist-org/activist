# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the authentication app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from authentication import views

app_name = "authentication"

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
    path("", include(router.urls)),
    path(route="sign_up", view=views.SignUpView.as_view(), name="sign_up"),
    path(route="delete", view=views.DeleteUserView.as_view(), name="delete"),
    path(route="sign_in", view=views.SignInView.as_view(), name="sign_in"),
    path(route="pwreset", view=views.PasswordResetView.as_view(), name="pwreset"),
    path(route="user_flag", view=views.UserFlagAPIView.as_view()),
    path(
        route="user_flag/<uuid:id>",
        view=views.UserFlagDetailAPIView.as_view(),
    ),
    path(route="session/<uuid:id>", view=views.SessionView.as_view(), name="session"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
