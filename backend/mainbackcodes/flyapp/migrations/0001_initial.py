# Generated by Django 5.0.3 on 2024-04-11 16:29

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import flyapp.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Flight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('airline', models.CharField(max_length=255)),
                ('airlineLogo', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('duration', models.IntegerField()),
                ('departureAirport', models.CharField(max_length=255)),
                ('departureCity', models.CharField(max_length=255)),
                ('departureCountry', models.CharField(max_length=255)),
                ('arrivalAirport', models.CharField(max_length=255)),
                ('arrivalCity', models.CharField(max_length=255)),
                ('arrivalCountry', models.CharField(max_length=255)),
                ('departureDate', models.DateTimeField()),
                ('arrivalDate', models.DateTimeField()),
                ('showDetails', models.BooleanField(blank=True, default=True)),
            ],
            options={
                'ordering': ['airline'],
            },
        ),
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('website', models.CharField(max_length=255, null=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(max_length=255)),
                ('caption', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_agent', models.BooleanField(default=False)),
                ('reset_code', models.CharField(blank=True, max_length=10, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', flyapp.models.CustomUserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Billing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paymentType', models.CharField(choices=[('visa', 'VISA'), ('paypal', 'PAYPAL')], max_length=255)),
                ('paymentState', models.CharField(choices=[('firstdeposit', 'FIRSTDEPOSIT'), ('seconddeposit', 'SECONDDEPOSIT'), ('lastdeposit', 'LASTDEPOSIT')], max_length=255)),
                ('firstName', models.CharField(max_length=255)),
                ('lastName', models.CharField(max_length=255)),
                ('firstLineAddress', models.CharField(max_length=255)),
                ('secondLineAddress', models.CharField(blank=True, default='', max_length=255)),
                ('zipCode', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('state_area', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userbilling', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['firstName'],
            },
        ),
        migrations.CreateModel(
            name='HotelBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('totalPrice', models.FloatField()),
                ('checkIn', models.DateField()),
                ('checkOut', models.DateField()),
                ('showDetails', models.BooleanField(blank=True, default=True)),
                ('hotel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flyapp.hotel')),
            ],
            options={
                'ordering': ['hotel'],
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipient', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='hotel',
            name='photos',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='flyapp.photo'),
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('description', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('showDetails', models.BooleanField(blank=True, default=True)),
                ('photos', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='flyapp.photo')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='TravelPackage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(blank=True, choices=[('pre-made', 'PRE-MADE'), ('custom', 'CUSTOM')], default='CUSTOM', max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('description', models.CharField(max_length=255)),
                ('startingDate', models.DateField()),
                ('endingDate', models.DateField()),
                ('showDetails', models.BooleanField(blank=True, default=True)),
                ('activities', models.ManyToManyField(blank=True, to='flyapp.activity')),
                ('flights', models.ManyToManyField(blank=True, to='flyapp.flight')),
                ('hotels', models.ManyToManyField(blank=True, to='flyapp.hotelbooking')),
                ('photos', models.ManyToManyField(blank=True, to='flyapp.photo')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userpkg', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='PackageModification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('description', models.TextField()),
                ('state', models.CharField(choices=[('pending', 'PENDING'), ('rejected', 'REJECTED'), ('accepted', 'ACCEPTED')], default='PENDING', max_length=255)),
                ('startingDate', models.DateField()),
                ('endingDate', models.DateField()),
                ('booking_cancellation', models.BooleanField(blank=True, default=False, null=True)),
                ('activities', models.ManyToManyField(blank=True, to='flyapp.activity')),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agent', to=settings.AUTH_USER_MODEL)),
                ('flights', models.ManyToManyField(blank=True, to='flyapp.flight')),
                ('hotels', models.ManyToManyField(blank=True, to='flyapp.hotelbooking')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usermod', to=settings.AUTH_USER_MODEL)),
                ('photos', models.ManyToManyField(blank=True, to='flyapp.photo')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flyapp.travelpackage')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bookingNo', models.IntegerField(unique=True)),
                ('cost', models.FloatField()),
                ('bookingState', models.CharField(choices=[('created', 'CREATED'), ('processing', 'PROCESSING'), ('canceled', 'CANCELED'), ('failed', 'FAILED'), ('modified', 'MODIFIED'), ('confirmed', 'CONFIRMED'), ('refunded', 'REFUNDED')], default='CREATED', max_length=255)),
                ('purchaseDate', models.DateTimeField(auto_now_add=True)),
                ('firstName', models.CharField(max_length=255)),
                ('lastName', models.CharField(max_length=255)),
                ('firstLineAddress', models.CharField(max_length=255)),
                ('secondLineAddress', models.CharField(blank=True, default='', max_length=255)),
                ('zipCode', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('state_area', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('phone', models.CharField(blank=True, default='', max_length=255)),
                ('billing', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='flyapp.billing')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userbooking', to=settings.AUTH_USER_MODEL)),
                ('nbr_adult', models.IntegerField(blank=True, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(10)])),
                ('nbr_child', models.IntegerField(blank=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('travelPackage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flyapp.travelpackage')),
            ],
            options={
                'ordering': ['bookingNo'],
            },
        ),
    ]