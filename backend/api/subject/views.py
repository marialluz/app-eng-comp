from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from .models import Subject
from .serializers import SubjectSerializer
from .permissions import IsTeacherPermission


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsTeacherPermission]


class SubjectPrerequisitesView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        subject_code = kwargs.get("code")
        deep = request.query_params.get("deep")

        if deep:
            prerequisites = Subject.objects.get_prerequisites_deep(subject_code)
        else:
            prerequisites = Subject.objects.get_prerequisites(subject_code)

        if prerequisites is None:
            raise NotFound(detail="Disciplina não encontrada.")

        serializer = SubjectSerializer(prerequisites, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
