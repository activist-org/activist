from uuid import uuid4

import requests
from apps.users.models import User
from apps.users.serializers import UserSerializer, UserWriteSerializer
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return UserSerializer
        return UserWriteSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data.get("password"))
        user.save()

    def perform_update(self, serializer):
        user = serializer.save()
        if "password" in self.request.data:
            user.set_password(self.request.data.get("password"))
            user.save()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(methods=["GET"], detail=False)
    def profile(self, request):
        if request.user.is_authenticated:
            serializer = self.serializer_class(request.user)
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["POST"], detail=False)
    def login(self, request, format=None):  # sourcery skip: use-named-expression
        email = request.data.get("email", None)
        password = request.data.get("password", None)
        user = authenticate(username=email, password=password)

        if user:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["POST"], detail=False)
    def register(self, request):
        last_name = request.data.get("last_name", None)
        first_name = request.data.get("first_name", None)
        email = request.data.get("email", None)
        password = request.data.get("password", None)

        if User.objects.filter(email__iexact=email).exists():
            return Response({"status": 210})

        # user creation
        user = User.objects.create(
            email=email,
            password=password,
            last_name=last_name,
            first_name=first_name,
            is_admin=False,
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(methods=["POST"], detail=False)
    def password_reset(self, request, format=None):
        if User.objects.filter(email=request.data["email"]).exists():
            user = User.objects.get(email=request.data["email"])
            params = {"user": user, "DOMAIN": settings.DOMAIN}
            send_mail(
                subject="Password reset",
                message=render_to_string("mail/password_reset.txt", params),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.data["email"]],
            )
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["POST"], detail=False)
    def password_change(self, request, format=None):
        if User.objects.filter(token=request.data["token"]).exists():
            user = User.objects.get(token=request.data["token"])
            user.set_password(request.data["password"])
            user.token = uuid4()
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
