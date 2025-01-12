from django.db import models
from django.contrib.auth import get_user_model

from user.validators import semester_format

User = get_user_model()


class History(models.Model):
    subject = models.ForeignKey("subject.Subject", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    attended_in_period = models.CharField(max_length=6, validators=[semester_format])
    average = models.DecimalField(max_digits=3, decimal_places=1)

    def _split_semester(self, semester):
        entry_period = semester.split(".")
        year, year_semester = int(entry_period[0]), int(entry_period[1])
        return year, year_semester

    def _semester_to_user_period(self):
        entry_year, entry_year_semester = self._split_semester(self.user.entry_period)
        attended_in_period_year, attended_in_period_year_semester = (
            self._split_semester(self.attended_in_period)
        )

        year_difference = attended_in_period_year - entry_year
        year_semester_difference = (
            attended_in_period_year_semester - entry_year_semester
        )

        if year_semester_difference < 0:
            year_difference -= 1
            year_semester_difference += 2

        total_periods = year_difference * 2 + year_semester_difference + 1

        return total_periods

    @property
    def attended_late(self) -> bool:
        return self._semester_to_user_period() > self.subject.period

    @property
    def attended_early(self) -> bool:
        return self._semester_to_user_period() < self.subject.period

    @property
    def attended_correctly(self) -> bool:
        return self._semester_to_user_period() == self.subject.period

    class Meta:
        unique_together = ("subject", "user")
