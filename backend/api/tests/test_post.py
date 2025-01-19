from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.exceptions import ValidationError
from post.models import Post
from post.serializers import PostSerializer

User = get_user_model()


class PostModelTest(TestCase):
    def setUp(self):
        # Criando um usuário
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )

    def test_create_post(self):
        """Teste para criar um post válido."""
        post = Post.objects.create(
            created_by=self.user,
            text="Este é um post de teste.",
            file=None,
        )

        self.assertEqual(post.created_by, self.user)
        self.assertEqual(post.text, "Este é um post de teste.")

    def test_create_post_with_file(self):
        """Teste para criar um post com arquivo."""
        post = Post.objects.create(
            created_by=self.user,
            text="Post com arquivo.",
            file="post_files/testfile.txt",  # Simulando um arquivo
        )

        self.assertEqual(post.file, "post_files/testfile.txt")


class PostSerializerTest(TestCase):
    def setUp(self):
        # Criando um usuário
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()
        self.request = self.factory.post("/")
        self.request.user = self.user

    def test_create_post_serializer(self):
        """Teste para criar um post usando o serializer."""
        data = {
            "text": "Este é um post criado pelo serializer.",
            "file": None,
        }

        serializer = PostSerializer(data=data, context={"request": self.request})

        self.assertTrue(serializer.is_valid())

        post = serializer.save()

        self.assertEqual(post.created_by, self.user)
        self.assertEqual(post.text, "Este é um post criado pelo serializer.")

    def test_read_only_fields(self):
        """Teste para garantir que os campos read-only não possam ser alterados."""

        data = {
            "created_by": 9999,  # Tentativa de sobrescrever o campo read-only
            "created_at": "2025-01-01T00:00:00Z",  # Tentativa de sobrescrever o campo read-only
            "updated_at": "2025-01-01T00:00:00Z",  # Tentativa de sobrescrever o campo read-only
            "text": "Tentativa de alterar campos read-only.",
            "file": None,
        }

        serializer = PostSerializer(data=data, context={"request": self.request})

        # O serializer deve ignorar os campos read-only e validar corretamente
        self.assertTrue(serializer.is_valid())

    def test_update_post_serializer(self):
        """Teste para atualizar o texto de um post usando o serializer."""

        # Criando um post inicial
        post = Post.objects.create(
            created_by=self.user,
            text="Texto original.",
            file=None,
        )

        data_to_update = {
            "text": "Texto atualizado pelo serializer.",
        }

        serializer = PostSerializer(instance=post, data=data_to_update, partial=True)

        self.assertTrue(serializer.is_valid())

        updated_post = serializer.save()

        self.assertEqual(updated_post.text, "Texto atualizado pelo serializer.")

    def test_invalid_data(self):
        """Teste para validar dados inválidos."""

        data = {
            "text": "",  # Campo obrigatório vazio
            "file": None,
        }

        serializer = PostSerializer(data=data, context={"request": self.request})

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
