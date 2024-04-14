import json
from rest_framework import serializers
from .models import Billing, CustomUser, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, Photo, \
    TravelPackage
from django.db import transaction
from datetime import datetime
import random


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
class HotelDSerializer(serializers.ModelSerializer):  # Detailed

    class Meta:
        model = Hotel
        fields = '__all__'
        depth = 2



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

class HotelBookingDSerializer(serializers.ModelSerializer):  # Detailed
    class Meta:
        model = HotelBooking
        fields = '__all__'
        depth = 2

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



class ActivityDSerializer(serializers.ModelSerializer):  # Detailed
    class Meta:
        model = Activity
        fields = '__all__'
        depth = 1


class TravelPackageSerializer(serializers.ModelSerializer):   # (Do not remove this comment) - By Mehdi <-- ???
    hotels = HotelBookingSerializer(many=True)
    activities = ActivitySerializer(many=True)
    flights = FlightSerializer(many=True, allow_null=True)
    photo_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPackage
        fields = ['id', 'name', 'price', 'description', 'hotels', 'activities', 'flights', 'startingDate', 'endingDate', 'photo_ids', 'photos']
    exclude = ['user', 'type']

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

        user = self.context['request'].user

        if user.is_agent:
            validated_data['type'] = 'PRE-MADE'
        else:
            validated_data['type'] = 'CUSTOM'

        validated_data['user'] = user

        return travel_package


class TravelPackageDSerializer(serializers.ModelSerializer):  # Detailed

    class Meta:
        model = TravelPackage
        exclude = ['user', 'type']
        depth = 2

    def create(self, validated_data):
        user = self.context['request'].user

        if user.is_agent:
            validated_data['type'] = 'PRE-MADE'
        else:
            validated_data['type'] = 'CUSTOM'

        validated_data['user'] = user

        return super().create(validated_data)


class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        exclude = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user

        return super().create(validated_data)


def generate_unique_booking_no():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    unique_identifier = random.randint(1000, 9999)
    booking_no = f"{timestamp}{unique_identifier}"

    return booking_no


class BookingDSerializer(serializers.ModelSerializer):  # Detailed

    class Meta:
        model = Booking
        exclude = ['user']
        depth = 4


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        exclude = ['user', 'bookingNo', 'bookingState']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['bookingNo'] = generate_unique_booking_no()

        return super().create(validated_data)


class PackageModificationDSerializer(serializers.ModelSerializer):  # Detaield

    class Meta:
        model = PackageModification
        exclude = ['user', 'agent']
        depth = 3


class PackageModificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageModification
        exclude = ['user', 'agent', 'price', 'state']

    def create(self, validated_data):
        user = self.context['request'].user
        agents = CustomUser.objects.filter(is_agent=True)

        random_agent = random.choice(agents)

        validated_data['user'] = user
        validated_data['agent'] = random_agent

        return super().create(validated_data)


class NotifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_Name', 'last_Name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        print(validated_data)
        first_Name = validated_data.get('first_Name')
        last_Name = validated_data.get('last_Name')
        user = CustomUser.objects.create_user(email=email, password=password, first_Name=first_Name, last_Name=last_Name)
        return user
