# Generated by Django 5.0.1 on 2024-03-24 15:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flyapp', '0006_hotel_capacity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='package',
            name='flight',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='flyapp.flight'),
        ),
        migrations.AlterField(
            model_name='package',
            name='hotel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='flyapp.hotel'),
        ),
    ]
