from rest_framework import permissions


class IsPostByTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_teacher and obj.created_by == request.user
