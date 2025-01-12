from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .serializers import PostSerializer
from .permissions import IsPostByTeacher
from .models import Post


class PostViewSet(ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsPostByTeacher]
    queryset = Post.objects.all()
