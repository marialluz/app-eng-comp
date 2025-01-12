# Generated by Django 5.1.3 on 2024-11-23 03:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('code', models.CharField(max_length=9, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, default='')),
                ('period', models.PositiveSmallIntegerField()),
                ('prerequisites', models.ManyToManyField(blank=True, related_name='required_by', to='subject.subject')),
            ],
        ),
    ]
