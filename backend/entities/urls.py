from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')

urlpatterns = [
    path('v1/', include(router.urls)),
]
