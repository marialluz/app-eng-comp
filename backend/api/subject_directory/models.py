from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Directory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey("subject.Subject", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "subject")


class DirectoryFile(models.Model):
    directory = models.ForeignKey(Directory, on_delete=models.CASCADE)
    file = models.FileField(upload_to="directory_files/")
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)

    class Meta:
        unique_together = ("name", "directory")


class SharedDirectoryFile(models.Model):
    shared_to_user = models.ForeignKey(User, on_delete=models.CASCADE)
    directory_file = models.ForeignKey(
        DirectoryFile,
        on_delete=models.CASCADE,
        related_name="shared_directory_files",
    )

    class Meta:
        unique_together = ("shared_to_user", "directory_file")
