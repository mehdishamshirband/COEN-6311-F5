from django.db import models


# Create your models here.

class Flight(models.Model): #Flight information
    airlineName = models.CharField(max_length=255)
    flightId = models.IntegerField()
    price = models.FloatField()
    flightNumber = models.IntegerField()
    originAirportCode = models.IntegerField()
    destinationAirportCode = models.IntegerField()
    availableSeats = models.IntegerField()
    departureDateTime = models.DateField()
    arrivalDateTime = models.DateField()

    class Meta:
        ordering = ["airlineName"]


class Hotel(models.Model): #Hotel information
    hotelName = models.CharField(max_length=255)
    hotelId = models.IntegerField()
    address = models.CharField(max_length=255)
    phone = models.IntegerField()
    email = models.EmailField()
    stars = models.IntegerField()
    pricePerDay = models.FloatField()
    checkinTime = models.DateField()
    checkoutTime = models.DateField()

    class Meta:
        ordering = ["hotelName"]


class Activity(models.Model):   #Extra information or activities
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.CharField(max_length=255)
    grade = models.CharField(max_length=255)

    class Meta:
        ordering = ["name"]
