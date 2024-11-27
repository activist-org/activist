from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "authentication"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"supports", viewset=views.SupportViewSet)
router.register(prefix=r"users", viewset=views.UserViewSet)

# MARK: Bridge Tables

router.register(prefix=r"support_entity_types", viewset=views.SupportEntityTypeViewSet)
router.register(prefix=r"user_resources", viewset=views.UserResourceViewSet)
router.register(prefix=r"user_social_links", viewset=views.UserSocialLinkViewSet)
router.register(prefix=r"user_tasks", viewset=views.UserTaskViewSet)
router.register(prefix=r"user_topics", viewset=views.UserTopicViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(route="sign_up/", view=views.SignUpView.as_view(), name="sign_up"),
    path(route="delete/", view=views.DeleteUserView.as_view(), name="delete"),
    path(route="sign_in/", view=views.SignInView.as_view(), name="sign_in"),
    path(route="pwreset/", view=views.PasswordResetView.as_view(), name="pwreset"),
]
