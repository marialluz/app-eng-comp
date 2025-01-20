from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from .models import Directory, DirectoryFile, SharedDirectoryFile
from .serializers import (
    DirectorySerializer,
    DirectoryFileSerializer,
    SharedDirectoryFileSerializer,
)
from .permissions import IsOwnerOfDirectory, CanAccessFile, CanShareFile


class DirectoryViewSet(viewsets.ModelViewSet):
    serializer_class = DirectorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOfDirectory]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Directory.objects.filter(user=self.request.user)


class DirectoryFileViewSet(viewsets.ModelViewSet):
    serializer_class = DirectoryFileSerializer
    permission_classes = [IsAuthenticated, CanAccessFile]

    def get_queryset(self):
        user = self.request.user
        directory_id = self.kwargs.get("directory_id")

        try:
            directory = Directory.objects.get(id=directory_id)
            code = directory.subject.code
        except Directory.DoesNotExist:
            raise NotFound("Diretório não encontrado")

        # Filtro para arquivos no diretório do usuário
        queryset_1 = DirectoryFile.objects.filter(
            directory_id=directory_id,
            directory__user=user,
        )

        # Filtro para arquivos compartilhados com o usuário no mesmo código de assunto
        queryset_2 = DirectoryFile.objects.filter(
            shared_directory_files__shared_to_user=user,
            directory__subject__code=code,
        )

        # Combinação das queries
        return queryset_1 | queryset_2

    def perform_create(self, serializer):
        directory_id = self.kwargs.get("directory_id")
        serializer.save(directory_id=directory_id)


class SharedDirectoryFileViewSet(viewsets.ModelViewSet):
    serializer_class = SharedDirectoryFileSerializer
    permission_classes = [IsAuthenticated, CanShareFile]

    def get_queryset(self):
        return SharedDirectoryFile.objects.filter(
            shared_directory_files__directory__user=self.request.user
        )
