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
        code = data.get("code")

        if code and code in prerequisites:
            raise serializers.ValidationError(
                "Uma disciplina não pode ser pré-requisito de si mesma."
            )

        if self.instance and self.instance.code in prerequisites:
            raise serializers.ValidationError(
                "Uma disciplina não pode ser pré-requisito de si mesma."
            )

        return data
