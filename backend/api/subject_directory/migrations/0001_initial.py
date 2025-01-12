# Generated by Django 5.1.3 on 2024-11-24 01:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('subject', '0002_alter_subject_prerequisites'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Directory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject.subject')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'subject')},
            },
        ),
        migrations.CreateModel(
            name='DirectoryFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='directory_files/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=200)),
                ('directory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject_directory.directory')),
            ],
        ),
        migrations.CreateModel(
            name='SharedDirectoryFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('directory_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shared_directory_files', to='subject_directory.directoryfile')),
                ('shared_to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('shared_to_user', 'directory_file')},
            },
        ),
    ]
