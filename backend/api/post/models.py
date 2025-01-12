from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Post(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    text = models.TextField()
    file = models.FileField(upload_to="post_files/", blank=True, null=True)
