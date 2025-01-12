from rest_framework import serializers
from .models import Directory, DirectoryFile, SharedDirectoryFile


class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ["id", "user", "subject"]
        read_only_fields = ["user"]


class DirectoryFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectoryFile
        fields = ["id", "directory", "file", "created_at", "name"]
        read_only_fields = ["created_at", "directory"]


class SharedDirectoryFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedDirectoryFile
        fields = ["id", "shared_to_user", "directory_file"]
        read_only_fields = ["directory_file"]

    def validate(self, data):
        request = self.context["request"]
        shared_to_user = data["shared_to_user"]
        file_id = request.parser_context["kwargs"].get("file_id")
        directory_id = request.parser_context["kwargs"].get("directory_id")

        try:
            directory_file = DirectoryFile.objects.get(
                id=file_id, directory_id=directory_id
            )
        except DirectoryFile.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Arquivo ou diretório não encontrado."}
            )

        subject = directory_file.directory.subject

        try:
            Directory.objects.get(user=shared_to_user, subject=subject)
        except Directory.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "detail": f"O usuário {shared_to_user} não possui uma pasta para a disciplina {subject.code} ({(subject.name)})."
                }
            )

        data["directory_file"] = directory_file

        return data
