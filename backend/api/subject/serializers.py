from rest_framework import serializers
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    prerequisites = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Subject
        fields = ["code", "name", "description", "period", "prerequisites"]

    def validate(self, data):
        prerequisites = data.get("prerequisites", [])
        code = data.get("code", self.instance.code if self.instance else None)

        # Converte os códigos dos pré-requisitos em instâncias do modelo
        prerequisites_instances = Subject.objects.filter(
            code__in=[p.code if isinstance(p, Subject) else p for p in prerequisites]
        )

        # Para atualizações parciais, combine os pré-requisitos existentes com os novos
        if self.instance:
            prerequisites_instances = list(self.instance.prerequisites.all()) + list(
                prerequisites_instances
            )

        # Validação: disciplina não pode ser pré-requisito de si mesma
        if code and code in [prereq.code for prereq in prerequisites_instances]:
            raise serializers.ValidationError(
                "Uma disciplina não pode ser pré-requisito de si mesma."
            )

        return data
