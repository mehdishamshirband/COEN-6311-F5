from rest_framework import serializers
from .models import Flight, Hotel, Activity, Notification, Package, Booking, PackageModification


class FlightSerializer(serializers.ModelSerializer):
    departureAirport = serializers.CharField(source='originairport')
    arrivalAirport = serializers.CharField(source='destinationairport')
    departureDate = serializers.DateTimeField(source='departuredatetime')
    arrivalDate = serializers.DateTimeField(source='arrivaldatetime')

    class Meta:
        model = Flight
        fields = ('id', 'airlinename', 'flightid', 'price', 'flightnumber',
                  'departureAirport', 'arrivalAirport', 'availableseats',
                  'departureDate', 'arrivalDate')


class HotelSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='hotelname')
    location = serializers.CharField(source='address')
    checkIn = serializers.DateField(source='checkintime')
    checkOut = serializers.DateField(source='checkouttime')

    class Meta:
        model = Hotel
        fields = ('id', 'name', 'location', 'phone', 'email', 'stars',
                  'priceperday', 'capacity', 'checkIn', 'checkOut')


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'type', 'name', 'price', 'description', 'grade')


class PackageSerializer(serializers.ModelSerializer):
    flights = FlightSerializer(source='flight', many=False, read_only=True)
    hotels = HotelSerializer(source='hotel', many=False, read_only=True)
    activities = ActivitySerializer(source='activity', many=True, read_only=True)
    startingDate = serializers.DateField(source='start')
    endingDate = serializers.DateField(source='end')

    class Meta:
        model = Package
        fields = ('id', 'name', 'description', 'price', 'startingDate', 'endingDate', 'flights', 'hotels', 'activities')


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class PackageModificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageModification
        fields = '__all__'


class NotifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'