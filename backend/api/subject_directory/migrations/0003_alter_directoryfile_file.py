# Generated by Django 5.1.3 on 2025-01-20 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subject_directory', '0002_alter_directoryfile_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='directoryfile',
            name='file',
            field=models.FileField(upload_to=''),
        ),
    ]
