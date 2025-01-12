from rest_framework import serializers
from .models import Schedule
from subject.models import Subject
from history.models import History


class ScheduleSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), many=True
    )

    class Meta:
        model = Schedule
        fields = ["id", "subjects", "period"]
        read_only_fields = ["id", "user"]

    def validate(self, data):
        user = self.context["request"].user
        subjects = data.get("subjects", [])

        if self.instance:
            history_exists = (
                History.objects.filter(subject__code__in=subjects, user=user)
                .exclude(id=self.instance.id)
                .exists()
            )
        else:
            history_exists = History.objects.filter(
                subject__code__in=subjects, user=user
            ).exists()

        if history_exists:
            raise serializers.ValidationError(
                "Você já cursou uma das matérias selecionadas"
            )

        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("user", None)
        return super().update(instance, validated_data)
