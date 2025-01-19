from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from user.serializers import UserSerializer

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_student_user(self):
        """Teste para criar um usuário com perfil de estudante."""
        user = User.objects.create_user(
            username="student_user",
            email="student@example.com",
            password="password123",
            is_student=True,
            entry_period="2023.1",
        )
        self.assertTrue(user.is_student)
        self.assertFalse(user.is_teacher)
        self.assertEqual(user.entry_period, "2023.1")

    def test_create_teacher_user(self):
        """Teste para criar um usuário com perfil de professor."""
        user = User.objects.create_user(
            username="teacher_user",
            email="teacher@example.com",
            password="password123",
            is_teacher=True,
        )
        self.assertTrue(user.is_teacher)
        self.assertFalse(user.is_student)
        self.assertIsNone(user.entry_period)


class UserSerializerTest(TestCase):
    def setUp(self):
        self.valid_student_data = {
            "username": "student_user",
            "password": "password123",
            "confirm_password": "password123",
            "is_student": True,
            "is_teacher": False,
            "entry_period": "2023.1",
        }

        self.valid_teacher_data = {
            "username": "teacher_user",
            "email": "teacher@example.com",
            "password": "password123",
            "confirm_password": "password123",
            "is_student": False,
            "is_teacher": True,
        }

    def test_create_valid_student(self):
        """Teste para criar um estudante válido."""
        serializer = UserSerializer(data=self.valid_student_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertTrue(user.is_student)
        self.assertEqual(user.entry_period, "2023.1")

    def test_create_valid_teacher(self):
        """Teste para criar um professor válido."""
        serializer = UserSerializer(data=self.valid_teacher_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertTrue(user.is_teacher)
        self.assertIsNone(user.entry_period)

    def test_password_mismatch(self):
        """Teste para senhas incompatíveis."""
        invalid_data = self.valid_student_data.copy()
        invalid_data["confirm_password"] = "different_password"

        serializer = UserSerializer(data=invalid_data)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn("As senhas não são compatíveis.", str(context.exception))

    def test_both_student_and_teacher(self):
        """Teste para usuário ser aluno e professor ao mesmo tempo."""
        invalid_data = self.valid_student_data.copy()
        invalid_data["is_teacher"] = True

        serializer = UserSerializer(data=invalid_data)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn(
            "Um usuário não pode ser aluno e professor ao mesmo tempo.",
            str(context.exception),
        )

    def test_neither_student_nor_teacher(self):
        """Teste para usuário que não é nem aluno nem professor."""
        invalid_data = self.valid_student_data.copy()
        invalid_data["is_student"] = False

        serializer = UserSerializer(data=invalid_data)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn(
            "O usuário deve ser pelo menos aluno ou professor.",
            str(context.exception),
        )

    def test_entry_period_for_teacher(self):
        """Teste para verificar que professores não podem informar entry_period."""
        invalid_data = self.valid_teacher_data.copy()
        invalid_data["entry_period"] = "2023.1"

        serializer = UserSerializer(data=invalid_data)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn(
            "Professores não devem informar um período de ingresso.",
            str(context.exception),
        )

    def test_update_is_student_field(self):
        """Teste para garantir que o campo 'is_student' não pode ser alterado após a criação."""

        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
            is_student=True,
        )

        data_to_update = {"is_student": False}

        serializer = UserSerializer(instance=user, data=data_to_update, partial=True)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
