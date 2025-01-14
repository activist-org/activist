# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the activist backend.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/

Examples
--------

Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import os

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

ADMIN_PATH = os.getenv("ADMIN_PATH")

urlpatterns = [
    path(f"{ADMIN_PATH}", admin.site.urls),
    path("v1/auth/", include("authentication.urls", namespace="authentication")),
    path("v1/content/", include("content.urls", namespace="content")),
    path("v1/communities/", include("communities.urls", namespace="communities")),
    path("v1/events/", include("events.urls", namespace="events")),
    # API DOCUMENTATION
    path("v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "v1/schema/auth/",
        SpectacularAPIView.as_view(urlconf="authentication.urls"),
        name="schema-auth",
    ),
    path(
        "v1/schema/content/",
        SpectacularAPIView.as_view(urlconf="content.urls"),
        name="schema-content",
    ),
    path(
        "v1/schema/communities/",
        SpectacularAPIView.as_view(urlconf="communities.urls"),
        name="schema-communities",
    ),
    path(
        "v1/schema/events/",
        SpectacularAPIView.as_view(urlconf="events.urls"),
        name="schema-events",
    ),
    path(
        "v1/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "v1/schema/swagger-ui/auth/",
        SpectacularSwaggerView.as_view(url_name="schema-auth"),
        name="swagger-ui-auth",
    ),
    path(
        "v1/schema/swagger-ui/content/",
        SpectacularSwaggerView.as_view(url_name="schema-content"),
        name="swagger-ui-content",
    ),
    path(
        "v1/schema/swagger-ui/enticommunitiesties/",
        SpectacularSwaggerView.as_view(url_name="schema-communities"),
        name="swagger-ui-communities",
    ),
    path(
        "v1/schema/swagger-ui/events/",
        SpectacularSwaggerView.as_view(url_name="schema-events"),
        name="swagger-ui-events",
    ),
]
