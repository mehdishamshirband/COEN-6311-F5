import json
from rest_framework import serializers
from .models import Billing, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, Photo, \
    TravelPackage
from django.db import transaction


"""
class PhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ['url', 'caption']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.url:  # Since the ImageField in your Photo model is named 'url'
            photo_url = obj.url.url  # Get the relative URL from the ImageField
            return request.build_absolute_uri(photo_url)  # Convert to absolute URL
        else:
            return None
"""

class PhotoSerializer(serializers.ModelSerializer):
    url = serializers.ImageField(required=False)
    upload_dir = serializers.CharField(max_length=255, allow_blank=True, required=False)
    class Meta:
        model = Photo
        fields = ['url', 'caption', 'upload_dir']

    def create(self, validated_data):
        url = validated_data.pop('url')
        upload_dir = validated_data.pop('upload_dir', 'others')
        instance = Photo.objects.create(url=url, upload_dir=upload_dir, **validated_data)
        return instance

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.url:
            return request.build_absolute_uri(obj.url.url)
        return None

    def to_representation(self, instance):
        representation = super(PhotoSerializer, self).to_representation(instance)
        representation['url'] = self.get_url(instance)
        return representation


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    photo_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Hotel
        fields = ['name', 'location', 'website', 'photos', 'photo_ids']

    @transaction.atomic
    def create(self, validated_data):
        photo_ids = validated_data.pop('photo_ids', [])
        hotel = Hotel.objects.create(**validated_data)
        if photo_ids:
            photos = Photo.objects.filter(id__in=photo_ids)
            print("Found photos for given IDs:", photos.exists())
            hotel.photos.set(photos)

        return hotel

class HotelBookingSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer()

    class Meta:
        model = HotelBooking
        fields = '__all__'

    def create(self, validated_data):
        hotel_data = validated_data.pop('hotel')
        hotel = HotelSerializer.create(HotelSerializer(), validated_data=hotel_data)
        hotel_booking = HotelBooking.objects.create(hotel=hotel, **validated_data)
        return hotel_booking

class ActivitySerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    photo_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Activity
        fields = ['type', 'name', 'price', 'description', 'location', 'date', 'photos', 'photo_ids']

    @transaction.atomic
    def create(self, validated_data):
        photo_ids = validated_data.pop('photo_ids', [])
        activity = Activity.objects.create(**validated_data)
        if photo_ids:
            photos = Photo.objects.filter(id__in=photo_ids)
            print("Found photos for given IDs:", photos.exists())
            activity.photos.set(photos)

        return activity


class TravelPackageSerializer(serializers.ModelSerializer):
    hotels = HotelBookingSerializer(many=True)
    activities = ActivitySerializer(many=True)
    #activities_data = serializers.ListField(write_only=True, required=False)
    flights = FlightSerializer(many=True, allow_null=True)
    photo_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    photos = PhotoSerializer(many=True, read_only=True)
    #photos = PhotoSerializer(many=True)
    #photos = PhotoSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = TravelPackage
        fields = ['id', 'name', 'price', 'description', 'hotels', 'activities', 'flights', 'startingDate', 'endingDate', 'photo_ids', 'photos']

    @transaction.atomic
    def create(self, validated_data):
        flights_data = validated_data.pop('flights', [])
        activities_data = validated_data.pop('activities', [])
        hotels_data = validated_data.pop('hotels', [])
        photo_ids = validated_data.pop('photo_ids', [])
        print("Received photo_ids:", photo_ids)
        travel_package = TravelPackage.objects.create(**validated_data)

        if photo_ids:
            photos = Photo.objects.filter(id__in=photo_ids)
            print("Found photos for given IDs:", photos.exists())
            travel_package.photos.set(photos)

        for flight_data in flights_data:
            flight = Flight.objects.create(**flight_data)
            travel_package.flights.add(flight)

        for activity_data in activities_data:
            activity_serializer = ActivitySerializer(data=activity_data)
            if activity_serializer.is_valid(raise_exception=True):
                activity = activity_serializer.save()
                travel_package.activities.add(activity)

        for hotel_data in hotels_data:
            hotel_serializer = HotelBookingSerializer(data=hotel_data)
            if hotel_serializer.is_valid(raise_exception=True):
                hotel = hotel_serializer.save()
                travel_package.hotels.add(hotel)

        return travel_package



class BookingSerializer(serializers.ModelSerializer):
    travelPackage = TravelPackageSerializer(read_only=True)

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
