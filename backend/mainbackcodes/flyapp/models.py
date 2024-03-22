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
    departuredatetime = models.DateField()
    arrivaldatetime = models.DateField()

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
    checkintime = models.DateField()
    checkouttime = models.DateField()

    class Meta:
        ordering = ["hotelname"]

    def __str__(self):
        return self.hotelname


class Activity(models.Model):
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    grade = models.CharField(max_length=255)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Package(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    grade = models.CharField(max_length=255)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    activity = models.ManyToManyField(Activity, null=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    start = models.DateField()
    end = models.DateField()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name