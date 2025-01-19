from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory
from django.contrib.auth import get_user_model
from subject.models import Subject
from subject_directory.models import Directory, DirectoryFile, SharedDirectoryFile
from subject_directory.serializers import SharedDirectoryFileSerializer

User = get_user_model()


class SharedDirectoryFileTest(TestCase):
    def setUp(self):
        # Criando usuários
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="password123",
        )
        self.shared_user = User.objects.create_user(
            username="shared_user",
            email="shared_user@example.com",
            password="password123",
        )

        # Criando disciplinas
        self.subject = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        # Criando diretórios e arquivos
        self.owner_directory = Directory.objects.create(
            user=self.owner, subject=self.subject
        )
        self.shared_directory = Directory.objects.create(
            user=self.shared_user, subject=self.subject
        )

        self.directory_file = DirectoryFile.objects.create(
            directory=self.owner_directory,
            file="testfile.txt",
            name="Arquivo 1",
        )

    def test_create_shared_directory_file(self):
        """Teste para criar um compartilhamento válido."""
        shared_file = SharedDirectoryFile.objects.create(
            shared_to_user=self.shared_user,
            directory_file=self.directory_file,
        )

        self.assertEqual(shared_file.shared_to_user, self.shared_user)
        self.assertEqual(shared_file.directory_file, self.directory_file)

    def test_unique_together_constraint(self):
        """Teste para garantir que shared_to_user e directory_file sejam únicos juntos."""
        SharedDirectoryFile.objects.create(
            shared_to_user=self.shared_user,
            directory_file=self.directory_file,
        )

        with self.assertRaises(
            Exception
        ):  # Pode ser IntegrityError dependendo do banco
            SharedDirectoryFile.objects.create(
                shared_to_user=self.shared_user,
                directory_file=self.directory_file,
            )


class SharedDirectoryFileSerializerTest(TestCase):
    def setUp(self):
        # Criando usuários
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="password123",
        )
        self.shared_user = User.objects.create_user(
            username="shared_user",
            email="shared_user@example.com",
            password="password123",
        )

        # Criando disciplinas e diretórios
        self.subject = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        self.owner_directory = Directory.objects.create(
            user=self.owner, subject=self.subject
        )

        self.shared_directory = Directory.objects.create(
            user=self.shared_user, subject=self.subject
        )

        # Criando arquivo no diretório do proprietário
        self.directory_file = DirectoryFile.objects.create(
            directory=self.owner_directory,
            file="testfile.txt",
            name="Arquivo 1",
        )

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()

    def test_create_shared_directory_file_serializer(self):
        """Teste para criar um compartilhamento válido usando o serializer."""

        request = self.factory.post("/")
        request.parser_context = {
            "kwargs": {
                "file_id": self.directory_file.id,
                "directory_id": self.owner_directory.id,
            }
        }

        data = {
            "shared_to_user": self.shared_user.id,
        }

        serializer = SharedDirectoryFileSerializer(
            data=data, context={"request": request}
        )

        self.assertTrue(serializer.is_valid())

        shared_file = serializer.save()

        self.assertEqual(shared_file.shared_to_user, self.shared_user)
        self.assertEqual(shared_file.directory_file, self.directory_file)

    def test_invalid_directory_or_file(self):
        """Teste para validar erro quando o arquivo ou diretório não existe."""

        request = self.factory.post("/")
        request.parser_context = {
            "kwargs": {"file_id": 9999, "directory_id": 9999}
        }  # IDs inválidos

        data = {
            "shared_to_user": self.shared_user.id,
        }

        serializer = SharedDirectoryFileSerializer(
            data=data, context={"request": request}
        )

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn("Arquivo ou diretório não encontrado.", str(context.exception))

    def test_invalid_shared_to_user_without_directory(self):
        """Teste para validar erro quando o usuário compartilhado não possui um diretório na disciplina."""

        # Remover o diretório do usuário compartilhado
        self.shared_directory.delete()

        request = self.factory.post("/")
        request.parser_context = {
            "kwargs": {
                "file_id": self.directory_file.id,
                "directory_id": self.owner_directory.id,
            }
        }

        data = {
            "shared_to_user": self.shared_user.id,
        }

        serializer = SharedDirectoryFileSerializer(
            data=data, context={"request": request}
        )

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        error_message = f"O usuário {self.shared_user} não possui uma pasta para a disciplina {self.subject.code} ({self.subject.name})."

        self.assertIn(error_message, str(context.exception))
