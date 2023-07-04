from django.urls import path

from . import views

app_name = 'apps'

urlpatterns = [
    path("organizations/", views.OrganizationView.as_view()),
    path("organizations/<int:organization_id>", views.OrganizationUpdate.as_view()),
]
