from rest_framework import permissions
from rest_framework.exceptions import NotFound
from django.utils.translation import gettext_lazy as _

from .models import Directory, DirectoryFile


class IsOwnerOfDirectory(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class CanAccessFile(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            directory_id = view.kwargs.get("directory_id")
            return Directory.objects.filter(id=directory_id, user=request.user).exists()

        return True

    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in permissions.SAFE_METHODS:
            return (
                obj.directory.user == user
                or obj.shared_directory_files.filter(shared_to_user=user).exists()
            )

        return obj.directory.user == user


class CanShareFile(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            file_id = view.kwargs.get("file_id")

            try:
                file = DirectoryFile.objects.get(id=file_id)

                if not file.directory.user == request.user:
                    return False

            except DirectoryFile.DoesNotExist:
                raise NotFound("Arquivo não encontrado")

        return True

    def has_object_permission(self, request, view, obj):
        return obj.directory_file.directory.user == request.user
