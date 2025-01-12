from rest_framework import serializers
from .models import History


class HistorySerializer(serializers.ModelSerializer):
    attended_late = serializers.SerializerMethodField()
    attended_early = serializers.SerializerMethodField()
    attended_correctly = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = [
            "subject",
            "average",
            "attended_in_period",
            "attended_late",
            "attended_early",
            "attended_correctly",
        ]
        read_only_field = [
            "id",
            "attended_in_period",
            "attended_late",
            "attended_early",
            "attended_correctly",
        ]

    def get_attended_late(self, obj):
        return obj.attended_late

    def get_attended_early(self, obj):
        return obj.attended_early

    def get_attended_correctly(self, obj):
        return obj.attended_correctly

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("user", None)
        return super().update(instance, validated_data)
