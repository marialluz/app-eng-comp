from rest_framework import permissions


class IsHistoryByStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_student

    def has_object_permission(self, request, view, obj):
        user = request.user.is_student
        return user.is_student and obj.user == request.user
