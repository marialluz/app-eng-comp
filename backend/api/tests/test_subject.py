from django.test import TestCase
from subject.models import Subject
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from subject.serializers import SubjectSerializer


class SubjectModelTest(TestCase):
    def setUp(self):
        self.subject1 = Subject.objects.create(
            code="SUBJ101",
            name="Introdução",
            description="Disciplina introdutória",
            period=1,
        )
        self.subject2 = Subject.objects.create(
            code="SUBJ102",
            name="Intermediário",
            description="Disciplina intermediária",
            period=2,
        )
        self.subject3 = Subject.objects.create(
            code="SUBJ103",
            name="Avançado",
            description="Disciplina avançada",
            period=3,
        )
        self.subject2.prerequisites.add(self.subject1)
        self.subject3.prerequisites.add(self.subject2)

    def test_subject_creation(self):
        """Teste para verificar se as disciplinas foram criadas corretamente."""
        self.assertEqual(Subject.objects.count(), 3)
        self.assertEqual(self.subject1.name, "Introdução")

    def test_prerequisite_relationship(self):
        """Teste para verificar as relações de pré-requisitos."""
        self.assertIn(self.subject1, self.subject2.prerequisites.all())
        self.assertIn(self.subject2, self.subject3.prerequisites.all())

    def test_required_by_relationship(self):
        """Teste para verificar a relação inversa (required_by)."""
        self.assertIn(self.subject2, self.subject1.required_by.all())
        self.assertIn(self.subject3, self.subject2.required_by.all())


class SubjectManagerTest(TestCase):
    def setUp(self):
        self.subject1 = Subject.objects.create(
            code="SUBJ101",
            name="Introdução",
            description="Disciplina introdutória",
            period=1,
        )
        self.subject2 = Subject.objects.create(
            code="SUBJ102",
            name="Intermediário",
            description="Disciplina intermediária",
            period=2,
        )
        self.subject3 = Subject.objects.create(
            code="SUBJ103",
            name="Avançado",
            description="Disciplina avançada",
            period=3,
        )
        self.subject4 = Subject.objects.create(
            code="SUBJ104",
            name="Especialização",
            description="Disciplina especializada",
            period=4,
        )

        # Configurando pré-requisitos
        self.subject2.prerequisites.add(self.subject1)
        self.subject3.prerequisites.add(self.subject2)
        self.subject4.prerequisites.add(self.subject3)

    def test_get_prerequisites(self):
        """Teste para obter os pré-requisitos diretos."""
        prerequisites = Subject.objects.get_prerequisites("SUBJ102")
        self.assertEqual(list(prerequisites), [self.subject1])

    def test_get_prerequisites_deep(self):
        """Teste para obter todos os pré-requisitos (recursivamente)."""
        prerequisites = Subject.objects.get_prerequisites_deep("SUBJ104")
        self.assertEqual(
            set(prerequisites), {self.subject1, self.subject2, self.subject3}
        )

    def test_get_prerequisites_invalid_subject(self):
        """Teste para um código de disciplina inexistente."""
        prerequisites = Subject.objects.get_prerequisites("INVALID")
        self.assertIsNone(prerequisites)


class SubjectSerializerTest(TestCase):
    def setUp(self):
        self.subject1 = Subject.objects.create(
            code="SUBJ101",
            name="Introdução",
            description="Disciplina introdutória",
            period=1,
        )
        self.subject2 = Subject.objects.create(
            code="SUBJ102",
            name="Intermediário",
            description="Disciplina intermediária",
            period=2,
        )

    def test_valid_serializer_data(self):
        """Teste para dados válidos no serializer."""
        data = {
            "code": "SUBJ103",
            "name": "Avançado",
            "description": "Disciplina avançada.",
            "period": 3,
            "prerequisites": [self.subject1.code],
        }

        serializer = SubjectSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_update_with_self_reference_prerequisite(self):
        """Teste para tentar atualizar uma disciplina com referência a si mesma."""

        data_to_update = {
            "prerequisites": ["SUBJ102"],  # Referência ao próprio código
        }

        serializer = SubjectSerializer(
            instance=self.subject2, data=data_to_update, partial=True
        )

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertIn(
            "Uma disciplina não pode ser pré-requisito de si mesma.",
            str(context.exception),
        )

    def test_missing_code_field(self):
        """Teste para dados inválidos sem o campo 'code'."""

        data = {
            "name": "Nova Disciplina Sem Código",
            "description": "Descrição sem código.",
            "period": 4,
            "prerequisites": [],
        }

        serializer = SubjectSerializer(data=data)

        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
