# Generated by Django 5.1.3 on 2025-01-19 19:36

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_entry_period'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='entry_period',
            field=models.CharField(blank=True, max_length=6, null=True, validators=[django.core.validators.RegexValidator(message="O formato deve ser 'NNNN.N', onde N é um número e o dígito após o ponto deve ser 1 ou 2.", regex='^\\d{4}\\.[12]$')]),
        ),
    ]
