from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "authentication"

router = DefaultRouter()

router.register(r"support_entity_types", views.SupportEntityTypeViewSet)
router.register(r"supports", views.SupportViewSet)
router.register(r"users", views.UserViewSet)
router.register(r"user_resources", views.UserResourceViewSet)
router.register(r"user_tasks", views.UserTaskViewSet)
router.register(r"user_topics", views.UserTopicViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("delete/", views.DeleteUserView.as_view(), name="delete"),
    path("login/", views.LoginView.as_view(), name="login"),
]
