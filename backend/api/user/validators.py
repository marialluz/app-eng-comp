from django.core.validators import RegexValidator

semester_format = RegexValidator(
    regex=r"^\d{4}\.[12]$",
    message="O formato deve ser 'NNNN.N', onde N é um número e o dígito após o ponto deve ser 1 ou 2.",
)
