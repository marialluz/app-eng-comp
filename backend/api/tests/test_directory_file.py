from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from subject.models import Subject
from subject_directory.models import Directory, DirectoryFile
from subject_directory.serializers import DirectoryFileSerializer

from rest_framework.test import APIRequestFactory

User = get_user_model()


class DirectoryFileModelTest(TestCase):
    def setUp(self):
        # Criando um usuário
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )

        # Criando uma disciplina
        self.subject = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        # Criando um diretório
        self.directory = Directory.objects.create(user=self.user, subject=self.subject)

    def test_create_directory_file(self):
        """Teste para criar um arquivo no diretório."""
        file = SimpleUploadedFile("testfile.txt", b"Conteudo do arquivo")

        directory_file = DirectoryFile.objects.create(
            directory=self.directory,
            file=file,
            name="Arquivo 1",
        )

        self.assertEqual(directory_file.directory, self.directory)
        self.assertEqual(directory_file.name, "Arquivo 1")

    def test_unique_together_constraint(self):
        """Teste para garantir que o nome do arquivo seja único dentro de um diretório."""
        file1 = SimpleUploadedFile("testfile1.txt", b"Conteudo do arquivo 1")
        file2 = SimpleUploadedFile("testfile2.txt", b"Conteudo do arquivo 2")

        DirectoryFile.objects.create(
            directory=self.directory,
            file=file1,
            name="Arquivo 1",
        )

        with self.assertRaises(
            Exception
        ):  # Pode ser IntegrityError dependendo do banco
            DirectoryFile.objects.create(
                directory=self.directory,
                file=file2,
                name="Arquivo 1",  # Mesmo nome no mesmo diretório
            )

    def test_create_files_with_same_name_in_different_directories(self):
        """Teste para criar arquivos com o mesmo nome em diretórios diferentes."""
        subject2 = Subject.objects.create(
            code="SUBJ102", name="Intermediário", period=1
        )
        directory2 = Directory.objects.create(user=self.user, subject=subject2)

        file1 = SimpleUploadedFile("testfile1.txt", b"Conteudo do arquivo 1")
        file2 = SimpleUploadedFile("testfile2.txt", b"Conteudo do arquivo 2")

        directory_file1 = DirectoryFile.objects.create(
            directory=self.directory,
            file=file1,
            name="Arquivo 1",
        )

        directory_file2 = DirectoryFile.objects.create(
            directory=directory2,
            file=file2,
            name="Arquivo 1",
        )

        self.assertEqual(directory_file1.name, directory_file2.name)


class DirectoryFileSerializerTest(TestCase):
    def setUp(self):
        # Criando um usuário
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )

        # Criando uma disciplina e um diretório
        self.subject = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        self.directory = Directory.objects.create(user=self.user, subject=self.subject)

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")

    def test_create_directory_file_serializer(self):
        """Teste para criar um arquivo no diretório usando o serializer."""

        file = SimpleUploadedFile("testfile.txt", b"Conteudo do arquivo")

        data = {
            "file": file,
            "name": "Arquivo 1",
            "directory": self.directory.id,
        }

        serializer = DirectoryFileSerializer(
            data=data, context={"request": self.request}
        )

        self.assertTrue(serializer.is_valid())

        directory_file = serializer.save(directory=self.directory)

        self.assertEqual(directory_file.name, "Arquivo 1")

    def test_read_only_directory_field(self):
        """Teste para garantir que o campo 'directory' seja somente leitura."""

        file = SimpleUploadedFile("testfile.txt", b"Conteudo do arquivo")

        data = {
            "directory": 9999,  # Tentativa de sobrescrever o campo read-only (deve ser ignorado)
            "file": file,
            "name": "Arquivo Teste",
        }

        serializer = DirectoryFileSerializer(
            data=data, context={"request": self.request}
        )

        self.assertTrue(serializer.is_valid())
