from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory
from subject.models import Subject
from subject_directory.models import Directory
from subject_directory.serializers import DirectorySerializer

User = get_user_model()


class DirectoryTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )
        self.subject1 = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )
        self.subject2 = Subject.objects.create(
            code="SUBJ102", name="Intermediário", description="", period=2
        )

    def test_create_directory(self):
        """Teste para criar uma entrada válida no diretório."""
        directory = Directory.objects.create(user=self.user, subject=self.subject1)

        self.assertEqual(directory.user, self.user)
        self.assertEqual(directory.subject, self.subject1)

    def test_unique_together_constraint(self):
        """Teste para garantir que user e subject sejam únicos juntos."""
        Directory.objects.create(user=self.user, subject=self.subject1)

        with self.assertRaises(Exception):
            Directory.objects.create(user=self.user, subject=self.subject1)

    def test_create_multiple_directories_for_same_user(self):
        """Teste para criar múltiplas entradas para o mesmo usuário com disciplinas diferentes."""
        directory1 = Directory.objects.create(user=self.user, subject=self.subject1)
        directory2 = Directory.objects.create(user=self.user, subject=self.subject2)

        self.assertEqual(directory1.user, self.user)
        self.assertEqual(directory2.user, self.user)
        self.assertNotEqual(directory1.subject, directory2.subject)


class DirectorySerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )

        # Criando disciplinas
        self.subject1 = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")
        self.request.user = self.user

    def test_create_directory_serializer(self):
        """Teste para criar uma entrada no diretório usando o serializer."""
        data = {
            "subject": self.subject1.code,
        }

        serializer = DirectorySerializer(data=data, context={"request": self.request})

        self.assertTrue(serializer.is_valid())

        directory = serializer.save(user=self.request.user)

        self.assertEqual(directory.user, self.user)
        self.assertEqual(directory.subject, self.subject1)
