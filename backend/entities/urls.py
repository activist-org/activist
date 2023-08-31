from django.urls import path

from . import views

urlpatterns = [
    path("/v1/organizations/", views.OrganizationView.as_view()),
    path("/v1/organizations/<int:organization_id>", views.OrganizationUpdate.as_view()),
]