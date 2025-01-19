from django.test import TestCase
from django.contrib.auth import get_user_model
from history.models import History
from history.serializers import HistorySerializer
from subject.models import Subject

from rest_framework.test import APIRequestFactory
from rest_framework.exceptions import ValidationError

User = get_user_model()


class HistoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
            entry_period="2022.1",
        )
        self.subject1 = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )
        self.subject2 = Subject.objects.create(
            code="SUBJ102", name="Intermediário", description="", period=2
        )

    def test_attended_late(self):
        """Teste para verificar se a disciplina foi cursada atrasada."""
        history = History.objects.create(
            subject=self.subject1,
            user=self.user,
            attended_in_period="2023.1",
            average=7.5,
        )
        self.assertTrue(history.attended_late)

    def test_attended_early(self):
        """Teste para verificar se a disciplina foi cursada adiantada."""
        history = History.objects.create(
            subject=self.subject2,
            user=self.user,
            attended_in_period="2022.1",
            average=8.0,
        )
        self.assertTrue(history.attended_early)

    def test_attended_correctly(self):
        """Teste para verificar se a disciplina foi cursada no período correto."""
        history = History.objects.create(
            subject=self.subject1,
            user=self.user,
            attended_in_period="2022.1",
            average=9.0,
        )
        self.assertTrue(history.attended_correctly)

    def test_unique_together_constraint(self):
        """Teste para garantir que não é possível duplicar uma combinação de subject e user."""
        History.objects.create(
            subject=self.subject1,
            user=self.user,
            attended_in_period="2022.1",
            average=7.0,
        )

        with self.assertRaises(
            Exception
        ):  # Pode ser IntegrityError dependendo do banco
            History.objects.create(
                subject=self.subject1,
                user=self.user,
                attended_in_period="2023.1",
                average=8.0,
            )


class HistorySerializerTest(TestCase):
    def setUp(self):
        # Criando um usuário
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
            entry_period="2022.1",
        )

        # Criando disciplinas
        self.subject1 = Subject.objects.create(
            code="SUBJ101", name="Introdução", description="", period=1
        )

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")
        self.request.user = self.user

    def test_create_valid_history(self):
        """Teste para criar um histórico válido."""
        data = {
            "subject": self.subject1.code,  # Usando ID da disciplina como chave primária
            "attended_in_period": "2023.1",
            "average": 7.5,
        }

        serializer = HistorySerializer(data=data, context={"request": self.request})

        self.assertTrue(serializer.is_valid())

        history = serializer.save()

        self.assertEqual(history.subject, self.subject1)
        self.assertEqual(history.user, self.user)
        self.assertEqual(history.attended_in_period, "2023.1")
        self.assertEqual(history.average, 7.5)

    def test_attended_late_field(self):
        """Teste para verificar o campo 'attended_late' calculado pelo serializer."""
        history = History.objects.create(
            subject=self.subject1,
            user=self.user,
            attended_in_period="2023.1",
            average=7.5,
        )

        serializer = HistorySerializer(instance=history)

        self.assertTrue(serializer.data["attended_late"])

    def test_update_average(self):
        """Teste para atualizar a média de uma entrada no histórico."""

        history = History.objects.create(
            subject=self.subject1,
            user=self.user,
            attended_in_period="2022.1",
            average=6.0,
        )

        data_to_update = {"average": 8.5}

        serializer = HistorySerializer(
            instance=history, data=data_to_update, partial=True
        )

        self.assertTrue(serializer.is_valid())

        updated_history = serializer.save()

        self.assertEqual(updated_history.average, 8.5)

    def test_invalid_data(self):
        """Teste para dados inválidos no serializer."""

        data = {
            "subject": None,  # Campo obrigatório ausente
            "attended_in_period": "2023.3",  # Formato inválido (deve ser 'YYYY.S')
            "average": -5,  # Média inválida (deve ser entre 0 e 10)
        }

        serializer = HistorySerializer(data=data, context={"request": self.request})

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
