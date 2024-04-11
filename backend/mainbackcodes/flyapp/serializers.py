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
    photos = PhotoSerializer(many=True, allow_null=True, required=False)

    class Meta:
        model = Hotel
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        photos_data = validated_data.pop('photos', [])
        hotel = Hotel.objects.create(**validated_data)
        for photo_data in photos_data:
            Photo.objects.create(hotel=hotel, **photo_data)

        return hotel

class HotelBookingSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)

    class Meta:
        model = HotelBooking
        fields = '__all__'


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
    hotels = HotelBookingSerializer(many=True, read_only=True)
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
            """"
            activity_photo_ids = activity_data.pop('photo_ids', [])
            activity = Activity.objects.create(**activity_data)
            if activity_photo_ids:
                activity_photos = Photo.objects.filter(id__in=activity_photo_ids)
                activity.photos.set(activity_photos)
            travel_package.activities.add(activity)
            """
            activity_serializer = ActivitySerializer(data=activity_data)
            if activity_serializer.is_valid(raise_exception=True):
                activity = activity_serializer.save()
                travel_package.activities.add(activity)

        return travel_package


    """
    @transaction.atomic
    def create(self, validated_data):
        flights_data = validated_data.pop('flights', [])
        photos_data = validated_data.pop('photos', [])
        with transaction.atomic():
            travel_package = TravelPackage.objects.create(**validated_data)
            for flight_data in flights_data:
                flight = Flight.objects.create(**flight_data)
                travel_package.flights.add(flight)

            # Associate photos with the travel package
            for photo_data in photos_data:
                #photo = Photo.objects.create(**photo_data)
                #travel_package.photos.add(photo)
                Photo.objects.create(**photo_data, travel_package=travel_package)

        return travel_package
    """

    """
    @transaction.atomic
    def create(self, validated_data):
        flights_data = validated_data.pop('flights', [])
        with transaction.atomic():
            travel_package = TravelPackage.objects.create(**validated_data)
            # Create flights and add them to the travel package
            for flight_data in flights_data:
                flight = Flight.objects.create(**flight_data)
                travel_package.flights.add(flight)

        photos = self.context['request'].FILES.getlist('photos')
        for photo in photos:
            photo_instance = Photo.objects.create(url=photo)
            travel_package.photos.add(photo_instance)

        travel_package.save()  # Save the travel package to update the ManyToMany relationship
        return travel_package
    """

    """
    def to_internal_value(self, data):
        # Parse the 'flights' field from JSON string to Python objects
        flights_data = data.get('flights')
        if flights_data:
            try:
                data['flights'] = json.loads(flights_data)
            except ValueError:
                raise serializers.ValidationError({"flights": "Invalid JSON format for flights."})
        return super().to_internal_value(data)
    """

    """
    def create(self, validated_data):
        flights_data = validated_data.pop('flights', [])
        travel_package = TravelPackage.objects.create(**validated_data)
        for flight_data in flights_data:
            Flight.objects.create(**flight_data, travel_package=travel_package)

        return travel_package
    """

    #@transaction.atomic
"""    def create(self, validated_data):
        flights_data = validated_data.pop('flights', [])
        travel_package = TravelPackage.objects.create(**validated_data)

        
        for flight_data in flights_data:
            flight_serializer = FlightSerializer(data=flight_data)
            flight_serializer.is_valid(raise_exception=True)
            flight_serializer.save(travel_package=travel_package)  # Assuming FlightSerializer handles travel_package

        return travel_package"""


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
