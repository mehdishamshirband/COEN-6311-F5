# Generated by Django 5.0.3 on 2024-03-23 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flyapp', '0003_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='package',
            name='type',
            field=models.CharField(blank=True, choices=[('pre-made', 'PRE-MADE'), ('custom', 'CUSTOM')], default='CUSTOM', max_length=255),
        ),
    ]
