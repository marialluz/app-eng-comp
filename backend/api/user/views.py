from rest_framework import viewsets, status, permissions, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .permissions import IsSelf
from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return []

        if self.action == "destroy":
            return [permissions.IsAuthenticated(), IsSelf()]

        return [permissions.IsAuthenticated()]


class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
