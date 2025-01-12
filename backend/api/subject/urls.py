from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, SubjectPrerequisitesView

router = DefaultRouter()
router.register(r"", SubjectViewSet, basename="subject")

urlpatterns = [
    path("subject/<str:code>/prerequisites/", SubjectPrerequisitesView.as_view()),
    path("subject/", include(router.urls)),
]
