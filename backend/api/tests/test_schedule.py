from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.exceptions import ValidationError
from subject.models import Subject
from history.models import History
from schedule.models import Schedule
from schedule.serializers import ScheduleSerializer

User = get_user_model()


class ScheduleModelTest(TestCase):
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
        self.subject2 = Subject.objects.create(
            code="SUBJ102", name="Intermediário", description="", period=2
        )

    def test_create_schedule(self):
        """Teste para criar um horário válido."""
        schedule = Schedule.objects.create(user=self.user, period="2023.1")
        schedule.subjects.add(self.subject1, self.subject2)

        self.assertEqual(schedule.user, self.user)
        self.assertEqual(schedule.period, "2023.1")
        self.assertIn(self.subject1, schedule.subjects.all())
        self.assertIn(self.subject2, schedule.subjects.all())

    def test_unique_together_constraint(self):
        """Teste para garantir que user e period sejam únicos juntos."""
        Schedule.objects.create(user=self.user, period="2023.1")

        with self.assertRaises(
            Exception
        ):  # Pode ser IntegrityError dependendo do banco
            Schedule.objects.create(user=self.user, period="2023.1")


class ScheduleSerializerTest(TestCase):
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
        self.subject2 = Subject.objects.create(
            code="SUBJ102", name="Intermediário", description="", period=2
        )

        # Criando histórico do usuário (matérias já cursadas)
        History.objects.create(
            user=self.user,
            subject=self.subject1,
            attended_in_period="2022.2",
            average=8.0,
        )

        # Configurando request no contexto do serializer
        self.factory = APIRequestFactory()
        self.request = self.factory.post("/")
        self.request.user = self.user

    def test_create_schedule_serializer(self):
        """Teste para criar um horário usando o serializer."""

        data = {
            "period": "2023.1",
            "subjects": [self.subject2.code],  # Apenas uma disciplina não cursada
        }

        serializer = ScheduleSerializer(data=data, context={"request": self.request})

        self.assertTrue(serializer.is_valid())

        schedule = serializer.save()

        self.assertEqual(schedule.user, self.user)
        self.assertEqual(schedule.period, "2023.1")
        self.assertIn(self.subject2, schedule.subjects.all())

    def test_update_schedule_serializer(self):
        """Teste para atualizar um horário usando o serializer."""

        schedule = Schedule.objects.create(user=self.user, period="2023.1")

        data_to_update = {
            "subjects": [self.subject2.code],  # Adicionando nova disciplina ao horário
        }

        # Configurando request no contexto
        request = self.factory.patch("/")
        request.user = self.user

        serializer = ScheduleSerializer(
            instance=schedule,
            data=data_to_update,
            partial=True,
            context={"request": request},
        )

        self.assertTrue(serializer.is_valid())

        updated_schedule = serializer.save()

        self.assertIn(self.subject2, updated_schedule.subjects.all())
