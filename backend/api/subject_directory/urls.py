from django.urls import path
from .views import DirectoryViewSet, DirectoryFileViewSet, SharedDirectoryFileViewSet

urlpatterns = [
    path(
        "directory/",
        DirectoryViewSet.as_view({"get": "list", "post": "create"}),
        name="directory-list",
    ),
    path(
        "directory/<int:pk>/",
        DirectoryViewSet.as_view(
            {"get": "retrieve", "patch": "update", "delete": "destroy"}
        ),
        name="directory-detail",
    ),
    path(
        "directory/<int:directory_id>/file/",
        DirectoryFileViewSet.as_view({"get": "list", "post": "create"}),
        name="directory-file-list",
    ),
    path(
        "directory/<int:directory_id>/file/<int:pk>/",
        DirectoryFileViewSet.as_view(
            {"get": "retrieve", "patch": "update", "delete": "destroy"}
        ),
        name="directory-file-detail",
    ),
    path(
        "directory/<int:directory_id>/file/<int:file_id>/share/",
        SharedDirectoryFileViewSet.as_view(
            {"post": "create", "get": "list", "delete": "destroy"}
        ),
        name="directory-file-share",
    ),
]
