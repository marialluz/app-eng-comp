from django.db import models
from django.contrib.auth import get_user_model

from user.validators import semester_format
from subject.models import Subject

User = get_user_model()


class Schedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="schedules")
    period = models.CharField(max_length=6, validators=[semester_format])
    subjects = models.ManyToManyField(Subject, related_name="schedules")

    class Meta:
        unique_together = ("user", "period")
