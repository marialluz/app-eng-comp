from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SubjectManager(models.Manager):
    def get_prerequisites(self, subject_code):
        try:
            subject = self.get(code=subject_code)
        except self.model.DoesNotExist:
            return None

        return subject.prerequisites.all()

    def get_prerequisites_deep(self, subject_code):
        try:
            subject = self.get(code=subject_code)
        except self.model.DoesNotExist:
            return None

        prerequisites = set()

        def fetch_prerequisites(subject):
            for prereq in subject.prerequisites.all():
                if prereq not in prerequisites:
                    prerequisites.add(prereq)
                    fetch_prerequisites(prereq)

        fetch_prerequisites(subject)
        return prerequisites


class Subject(models.Model):
    code = models.CharField(unique=True, max_length=9, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    period = models.PositiveSmallIntegerField()
    prerequisites = models.ManyToManyField(
        "self",
        blank=True,
        related_name="required_by",
        symmetrical=False,
        db_constraint=False,
    )

    objects = SubjectManager()
