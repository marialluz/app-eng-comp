from rest_framework import permissions


class IsScheduleByStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_student

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user.is_student and obj.user == user
