from django.db import models


# Create your models here.

class Flight(models.Model):
    airlinename = models.CharField(max_length=255)
    flightid = models.IntegerField()
    price = models.FloatField()
    flightnumber = models.IntegerField()
    originairport = models.CharField(max_length=255)
    destinationairport = models.CharField(max_length=255)
    availableseats = models.IntegerField()
    departuredatetime = models.DateTimeField()
    arrivaldatetime = models.DateTimeField()

    class Meta:
        ordering = ["airlinename"]

    def __str__(self):
        return self.airlinename


class Hotel(models.Model):
    hotelname = models.CharField(max_length=255)
    hotelid = models.IntegerField()
    address = models.CharField(max_length=255)
    phone = models.IntegerField()
    email = models.EmailField()
    stars = models.IntegerField()
    priceperday = models.FloatField()
    capacity = models.IntegerField(default=5)
    checkintime = models.DateField()
    checkouttime = models.DateField()

    class Meta:
        ordering = ["hotelname"]

    def __str__(self):
        return self.hotelname


grade = (
    ('a', 'A'),
    ('b', 'B'),
    ('c', 'C')
)


class Activity(models.Model):
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    grade = models.CharField(max_length=255, choices=grade)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


types = (
    ('pre-made', 'PRE-MADE'),
    ('custom', 'CUSTOM')
)


class Package(models.Model):
    # ignore type field in ui (only used in backend)
    type = models.CharField(max_length=255, choices=types, blank=True, default="CUSTOM")
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    grade = models.CharField(max_length=255, choices=grade)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, null=True, blank=True)
    activity = models.ManyToManyField(Activity, null=True, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True)
    start = models.DateField()
    end = models.DateField()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


status = (
    ('created', 'CREATED'),
    ('pending', 'PENDING'),
    ('canceled', 'CANCELED'),
    ('modified', 'MODIFIED'),
    ('checked', 'CHECKED')
)


class Booking(models.Model):
    bookingid = models.IntegerField(unique=True)
    customer = models.CharField(max_length=255)
    totalcost = models.FloatField()
    details = models.CharField(max_length=255)
    status = models.CharField(max_length=255, choices=status, default='CREATED')
    package = models.ManyToManyField(Package)
    creationdate = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["bookingid"]

    def __str__(self):
        return str(self.bookingid)


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
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, null=True, blank=True)
    activity = models.ManyToManyField(Activity, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True)
    start = models.DateField()
    end = models.DateField()
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
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