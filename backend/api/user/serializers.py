from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "is_student",
            "is_teacher",
            "entry_period",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "As senhas não são compatíveis."}
            )

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError(
                {"email": "Este email já está registrado."}
            )

        is_student = data.get("is_student", False)
        is_teacher = data.get("is_teacher", False)
        entry_period = data.get("entry_period", None)

        if is_student and is_teacher:
            raise serializers.ValidationError(
                {
                    "non_field_errors": "Um usuário não pode ser aluno e professor ao mesmo tempo."
                }
            )

        if not is_student and not is_teacher:
            raise serializers.ValidationError(
                {
                    "non_field_errors": "O usuário deve ser pelo menos aluno ou professor."
                }
            )

        if entry_period is not None and is_teacher:
            raise serializers.ValidationError(
                {
                    "non_field_errors": "Professores não devem informar um período de ingresso."
                }
            )

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if (
            "is_student" in validated_data
            and validated_data["is_student"] != instance.is_student
        ):
            raise serializers.ValidationError(
                {
                    "is_student": "O campo 'is_student' não pode ser alterado após a criação."
                }
            )
        if (
            "is_teacher" in validated_data
            and validated_data["is_teacher"] != instance.is_teacher
        ):
            raise serializers.ValidationError(
                {
                    "is_teacher": "O campo 'is_teacher' não pode ser alterado após a criação."
                }
            )

        validated_data.pop("confirm_password", None)

        return super().update(instance, validated_data)
