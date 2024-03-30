from rest_framework import serializers
from .models import Billing, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, Photo, \
    TravelPackage


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    photo = PhotoSerializer(read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'


class HotelBookingSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)

    class Meta:
        model = HotelBooking
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    photo = PhotoSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'


class TravelPackageSerializer(serializers.ModelSerializer):
    hotels = HotelBookingSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    flights = FlightSerializer(many=True, read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPackage
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    travelpackage = TravelPackageSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'


class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = '__all__'


class PackageModificationSerializer(serializers.ModelSerializer):
    hotels = HotelBookingSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    flights = FlightSerializer(many=True, read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = PackageModification
        fields = '__all__'


class NotifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'