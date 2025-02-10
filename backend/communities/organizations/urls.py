from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(
    r"(?P<org_id>[^/.]+)/images",
    views.OrganizationImageViewSet,
    basename="organization-images",
)

urlpatterns = router.urls