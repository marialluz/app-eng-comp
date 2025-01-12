from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .serializers import ScheduleSerializer
from .models import Schedule
from .permissions import IsScheduleByStudent


class ScheduleViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsScheduleByStudent]
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        user = self.request.user
        return Schedule.objects.filter(user=user)
