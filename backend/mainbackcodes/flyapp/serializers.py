import json
from rest_framework import serializers
from .models import Billing, CustomUser, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, Photo, \
    TravelPackage
from django.db import transaction
from datetime import datetime
import random


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
    #photos = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = ['name', 'location', 'website', 'photos', 'photo_ids']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print("Photos instance check:", instance.photos.all())  # Check what's being retrieved here
        representation['photos'] = PhotoSerializer(instance.photos.all(), many=True,
                                                   context={'request': self.context.get('request')}).data
        return representation

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

        """
        hotel_data = validated_data.pop('hotel')
        hotel_serializer = HotelSerializer(data=hotel_data, context=self.context)
        if hotel_serializer.is_valid(raise_exception=True):
            hotel = hotel_serializer.save()
        hotel_booking = HotelBooking.objects.create(hotel=hotel, **validated_data)
        return hotel_booking
        """
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
    def update(self, instance, validated_data):
        # Handle the basic fields first
        instance_fields = ['type', 'name', 'price', 'description', 'location', 'date']
        for field in instance_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()

        # Handle the photo_ids
        if 'photo_ids' in validated_data:
            photo_ids = set(validated_data.pop('photo_ids'))
            current_photos = set(instance.photos.values_list('id', flat=True))

            # Photos to add
            new_photos = photo_ids - current_photos
            if new_photos:
                new_photo_instances = Photo.objects.filter(id__in=new_photos)
                instance.photos.add(*new_photo_instances)

            # Photos to remove
            photos_to_remove = current_photos - photo_ids
            if photos_to_remove:
                old_photo_instances = Photo.objects.filter(id__in=photos_to_remove)
                instance.photos.remove(*old_photo_instances)

        return instance

    @transaction.atomic
    def create(self, validated_data):
        photo_ids = validated_data.pop('photo_ids', [])
        activity = Activity.objects.create(**validated_data)
        if photo_ids:
            photos = Photo.objects.filter(id__in=photo_ids)
            activity.photos.set(photos)

        return activity


class ActivityDSerializer(serializers.ModelSerializer):  # Detailed
    class Meta:
        model = Activity
        fields = '__all__'
        depth = 1


class TravelPackageSerializer(serializers.ModelSerializer):
    hotels = HotelBookingSerializer(many=True)
    activities = ActivitySerializer(many=True)
    flights = FlightSerializer(many=True, allow_null=True)
    photo_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPackage
        fields = ['id', 'name', 'price', 'description', 'hotels', 'activities', 'flights', 'startingDate', 'endingDate', 'photo_ids', 'photos', 'user']

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
            print(user)
            validated_data['type'] = 'CUSTOM'

        validated_data['user'] = user

        return travel_package

    @transaction.atomic
    def update(self, instance, validated_data):
        # instance fields
        instance_fields = ['name', 'description', 'price', 'startingDate', 'endingDate', 'user']
        for field in instance_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()

        # nested fields
        nested_fields = {
            'hotels': (HotelBookingSerializer, instance.hotels),
            'activities': (ActivitySerializer, instance.activities),
            'flights': (FlightSerializer, instance.flights)
        }
        for field_name, (serializer_class, relationship) in nested_fields.items():
            if field_name in validated_data:
                items_data = validated_data.pop(field_name)
                self.update_nested_relationships(items_data, serializer_class, relationship)

        # photos
        if 'photo_ids' in validated_data:
            photo_ids = set(validated_data.pop('photo_ids'))
            current_photos = set(instance.photos.values_list('id', flat=True))
            print("current_photos: ", current_photos)

            # Photos to add
            new_photos = photo_ids - current_photos
            print("new_photos: ", new_photos)
            if new_photos:
                new_photo_instances = Photo.objects.filter(id__in=new_photos)
                instance.photos.add(*new_photo_instances)

            # Photos to remove
            photos_to_remove = current_photos - photo_ids
            print("photos_to_remove: ", photos_to_remove)
            if photos_to_remove:
                old_photo_instances = Photo.objects.filter(id__in=photos_to_remove)
                instance.photos.remove(*old_photo_instances)

        return instance

    """
    def update_nested_relationships(self, items_data, serializer_class, relationship):
        # Existing item IDs
        existing_item_ids = {item.id for item in relationship.all()}
        incoming_item_ids = {item.get('id') for item in items_data if item.get('id')}

        # Delete items not present in the incoming data
        relationship.filter(id__in=(existing_item_ids - incoming_item_ids)).delete()

        # Update existing items and create new ones
        for item_data in items_data:
            item_id = item_data.get('id', None)
            if item_id:
                item_instance = relationship.get(id=item_id)
                serializer_class(context={'request': self.context.get('request')}).update(item_instance, item_data)
                photo_ids = item_data.get('photo_ids', None)
            else:
                # Create new instance if id is not provided (it's a new item)
                new_item = serializer_class(context={'request': self.context.get('request')}).create(item_data)
                relationship.add(new_item)
    """

    def update_nested_relationships(self, items_data, serializer_class, relationship):
        # Map of existing items by ID
        existing_items = {item.id: item for item in relationship.all()}

        # Track IDs processed to identify and remove any not included in the update
        processed_ids = set()

        for item_data in items_data:
            item_id = item_data.get('id')

            if item_id:
                if item_id in existing_items:
                    # Update existing item
                    item_instance = existing_items[item_id]
                    serializer_class(context={'request': self.context.get('request')}).update(item_instance, item_data)
                    processed_ids.add(item_id)
                else:
                    # Log or handle the case where an expected ID is not found
                    print(
                        f"Warning: No existing item found with ID {item_id} - This should not happen under normal conditions.")
            else:
                # Create new item (since no ID provided)
                new_item = serializer_class(context={'request': self.context.get('request')}).create(item_data)
                relationship.add(new_item)
                processed_ids.add(new_item.id)

        # Optional: If you need to remove items not included in the update
        current_ids = set(existing_items.keys())
        ids_to_remove = current_ids - processed_ids
        for item_id in ids_to_remove:
            existing_items[item_id].delete()  # Or handle differently if deletion is not desired

    @transaction.atomic
    def delete(self, instance):
        # Ensure the instance exists
        if not instance:
            raise NotFound('The requested travel package does not exist.')

        # Remove relationships
        instance.hotels.clear()
        instance.activities.clear()
        instance.flights.clear()
        instance.photos.clear()

        # Finally, delete the instance itself
        instance.delete()


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
        # exclude = ['user']
        fields = '__all__'

    def create(self, validated_data):
        # user = self.context['request'].user # This line is causing an error, self.context is an empty dict
        # validated_data['user'] = user

        return super().create(validated_data)


def generate_unique_booking_no():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    unique_identifier = random.randint(1000, 9999)
    booking_no = int(f"{timestamp}{unique_identifier}")

    return booking_no


class BookingDSerializer(serializers.ModelSerializer):  # Detailed

    class Meta:
        model = Booking
        exclude = ['user']
        depth = 4


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        exclude = ['bookingState']

    def create(self, validated_data):
        # user = self.context['request'].user # It never works, self.context is an empty dict
        # validated_data['user'] = user

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
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
        return user
