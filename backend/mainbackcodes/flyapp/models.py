from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.

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
    showDetails = models.BooleanField(default=True, blank=True)

    class Meta:
        ordering = ["airline"]

    def __str__(self):
        return self.airline


class Photo(models.Model):
    url = models.CharField(max_length=255)
    caption = models.CharField(max_length=255, null=True, blank=True)


class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    website = models.CharField(max_length=255, null=True)
    photos = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class HotelBooking(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    totalPrice = models.FloatField()
    checkIn = models.DateField()
    checkOut = models.DateField()
    showDetails = models.BooleanField(default=True, blank=True)

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
    photos = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True, blank=True)
    showDetails = models.BooleanField(default=True, blank=True)

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
    showDetails = models.BooleanField(default=True, blank=True)
    nbr_adult = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(10)], blank=True)
    nbr_child = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], blank=True)

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
    secondLineAddress = models.CharField(max_length=255, blank=True, default='') # optional field
    zipCode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state_area = models.CharField(max_length=255)
    country = models.CharField(max_length=255)

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
    billing = models.ForeignKey(Billing, on_delete=models.CASCADE)
    bookingState = models.CharField(max_length=255, choices=status, default='CREATED')
    travelPackage = models.ForeignKey(TravelPackage, on_delete=models.CASCADE)
    purchaseDate = models.DateTimeField(auto_now_add=True)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    firstLineAddress = models.CharField(max_length=255)
    secondLineAddress = models.CharField(max_length=255, blank=True, default='') # optional field
    zipCode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state_area = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, blank=True, default='') # optional field

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
    agent = models.CharField(max_length=255)
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

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Notification(models.Model):
    sender = models.CharField(max_length=255)  # ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    recipient = models.CharField(max_length=255)  # ForeignKey(User, related_name='recipient', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)