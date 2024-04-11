# Generated by Django 5.0.3 on 2024-04-11 16:08

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flyapp', '0023_merge_20240409_2152'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activity',
            name='showDetails',
        ),
        migrations.RemoveField(
            model_name='flight',
            name='showDetails',
        ),
        migrations.RemoveField(
            model_name='hotelbooking',
            name='showDetails',
        ),
        migrations.RemoveField(
            model_name='travelpackage',
            name='nbr_adult',
        ),
        migrations.RemoveField(
            model_name='travelpackage',
            name='nbr_child',
        ),
        migrations.RemoveField(
            model_name='travelpackage',
            name='showDetails',
        ),
        migrations.AddField(
            model_name='booking',
            name='nbr_adult',
            field=models.IntegerField(blank=True, default=2, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='nbr_child',
            field=models.IntegerField(blank=True, default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)]),
            preserve_default=False,
        ),
    ]
