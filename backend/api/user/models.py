from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db import models

from .validators import semester_format


class User(AbstractUser):
    entry_period = models.CharField(max_length=6, validators=[semester_format])
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
