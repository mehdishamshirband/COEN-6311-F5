from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from uuid import uuid4
import os
from django.contrib.auth.models import AbstractUser, UserManager


# Create your models here.
class CustomUserManager(UserManager):
    def create_user(self, email, password=None, is_agent=False, **extra_fields):
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.is_agent = is_agent
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_agent", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_agent") is not True:
            raise ValueError("Superuser must have is_agent=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    is_agent = models.BooleanField(default=False)
    reset_code = models.CharField(max_length=10, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = []
    REQUIRED_FIELDS = ['password']

    def __str__(self):
        return self.email


class Flight(models.Model):
    airline = models.CharField(max_length=255)
    airlineLogo = models.CharField(max_length=255)
    price = models.FloatField()
    duration = models.IntegerField()
    departureAirport = models.CharField(max_length=255)
    departureCity = models.CharField(max_length=255)
    departureCountry = models.CharField(max_length=255)
    arrivalAirport = models.CharField(max_length=255)
    arrivalCity = models.CharField(max_length=255)
    arrivalCountry = models.CharField(max_length=255)
    departureDate = models.DateTimeField()
    arrivalDate = models.DateTimeField()
    # stops = models.ManyToManyField(Flight)

    class Meta:
        ordering = ["airline"]

    def __str__(self):
        return self.airline


def photo_upload_to(instance, filename):
    #ext = filename.split('.')[-1]
    #filename = f"{uuid4()}.{ext}"
    upload_dir = instance.upload_dir
    basename, ext = os.path.splitext(filename)
    ext = ext.lower()
    if not ext.startswith('.'):
        ext = '.' + ext
    unique_id = uuid4()
    new_filename = f"{basename}_{unique_id}{ext}"

    return os.path.join(upload_dir, new_filename)

class Photo(models.Model):
    url = models.ImageField(upload_to=photo_upload_to)
    caption = models.CharField(max_length=255, null=True, blank=True)
    upload_dir = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.caption if self.caption else "No Caption"

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    website = models.CharField(max_length=255, null=True)
    photos = models.ManyToManyField(Photo, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class HotelBooking(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    totalPrice = models.FloatField()
    checkIn = models.DateField()
    checkOut = models.DateField()

    class Meta:
        ordering = ["hotel"]

    def __str__(self):
        return str(self.hotel)


class Activity(models.Model):
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date = models.DateField()
    photos = models.ManyToManyField(Photo, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


types = (
    ('pre-made', 'PRE-MADE'),
    ('custom', 'CUSTOM')
)


class TravelPackage(models.Model):
    # ignore type field in ui (only used in backend)
    type = models.CharField(max_length=255, choices=types, blank=True, default="CUSTOM")
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    flights = models.ManyToManyField(Flight, blank=True)
    activities = models.ManyToManyField(Activity, blank=True)
    hotels = models.ManyToManyField(HotelBooking, blank=True)
    startingDate = models.DateField()
    endingDate = models.DateField()
    photos = models.ManyToManyField(Photo, blank=True)
    user = models.ForeignKey(CustomUser, related_name='userpkg', on_delete=models.CASCADE)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


PaymentType = (
    ('visa', 'VISA'),
    ('paypal', 'PAYPAL'),
)

PaymentState = (
    ('firstdeposit', 'FIRSTDEPOSIT'),
    ('seconddeposit', 'SECONDDEPOSIT'),
    ('lastdeposit', 'LASTDEPOSIT'),
)


class Billing(models.Model):
    paymentType = models.CharField(max_length=255, choices=PaymentType)
    paymentState = models.CharField(max_length=255, choices=PaymentState)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    firstLineAddress = models.CharField(max_length=255)
    secondLineAddress = models.CharField(max_length=255, blank=True, default='')  # optional field
    zipCode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state_area = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, related_name='userbilling', on_delete=models.CASCADE)

    class Meta:
        ordering = ["firstName"]

    def __str__(self):
        return self.firstName


status = (
    ('created', 'CREATED'),
    ('processing', 'PROCESSING'),
    ('canceled', 'CANCELED'),
    ('failed', 'FAILED'),
    ('modified', 'MODIFIED'),
    ('confirmed', 'CONFIRMED'),
    ('refunded', 'REFUNDED')
)


class Booking(models.Model):
    bookingNo = models.IntegerField(unique=True)
    cost = models.FloatField()
    # details = models.CharField(max_length=255)
    billing = models.OneToOneField(Billing, on_delete=models.CASCADE)
    bookingState = models.CharField(max_length=255, choices=status, default='CREATED')
    travelPackage = models.ForeignKey(TravelPackage, on_delete=models.CASCADE)
    purchaseDate = models.DateTimeField(auto_now_add=True)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    firstLineAddress = models.CharField(max_length=255)
    secondLineAddress = models.CharField(max_length=255, blank=True, default='')  # optional field
    zipCode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state_area = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, blank=True, default='')  # optional field
    user = models.ForeignKey(CustomUser, related_name='userbooking', on_delete=models.CASCADE)
    nbr_adult = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(10)], blank=True)
    nbr_child = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], blank=True)

    class Meta:
        ordering = ["bookingNo"]

    def __str__(self):
        return str(self.bookingNo)


state = (
    ('pending', 'PENDING'),
    ('rejected', 'REJECTED'),
    ('accepted', 'ACCEPTED')
)


class PackageModification(models.Model):
    name = models.CharField(max_length=255)
    agent = models.ForeignKey(CustomUser, related_name='agent', on_delete=models.CASCADE)
    price = models.FloatField()
    description = models.TextField()
    state = models.CharField(max_length=255, choices=state, default='PENDING')
    flights = models.ManyToManyField(Flight, blank=True)
    activities = models.ManyToManyField(Activity, blank=True)
    hotels = models.ManyToManyField(HotelBooking, blank=True)
    startingDate = models.DateField()
    endingDate = models.DateField()
    photos = models.ManyToManyField(Photo, blank=True)
    package = models.ForeignKey(TravelPackage, on_delete=models.CASCADE)
    booking_cancellation = models.BooleanField(default=False, null=True, blank=True)
    user = models.ForeignKey(CustomUser, related_name='usermod', on_delete=models.CASCADE)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Notification(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='sender', on_delete=models.CASCADE)
    recipient = models.ForeignKey(CustomUser, related_name='recipient', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

