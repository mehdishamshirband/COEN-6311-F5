# Generated by Django 5.0.1 on 2024-03-23 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flyapp', '0005_alter_package_activity'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='capacity',
            field=models.IntegerField(default=5),
        ),
    ]
