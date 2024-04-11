from datetime import datetime
import random
from rest_framework import serializers
from .models import Billing, CustomUser, Flight, Hotel, Activity, HotelBooking, Notification, Booking, \
    PackageModification, Photo, TravelPackage


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['url', 'caption']


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'


class HotelBookingSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)

    class Meta:
        model = HotelBooking
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'


class TravelPackageSerializer(serializers.ModelSerializer):  # (Do not remove this comment) - By Mehdi
    hotels = HotelBookingSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    flights = FlightSerializer(many=True, read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = TravelPackage
        exclude = ['user', 'type']

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


def generate_unique_booking_no(): #create booking number automatically

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_identifier = random.randint(1000, 9999)
    booking_no = f"{timestamp}{unique_identifier}"

    return booking_no


class BookingSerializer(serializers.ModelSerializer):  # (Do not remove this comment) - By Mehdi
    travelPackage = TravelPackageSerializer(read_only=True)
    billing = BillingSerializer(read_only=True)

    class Meta:
        model = Booking
        exclude = ['user', 'bookingNo']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['bookingNo'] = generate_unique_booking_no()

        return super().create(validated_data)


class PackageModificationSerializer(serializers.ModelSerializer):
    # hotels = HotelBookingSerializer(many=True, read_only=True)
    # activities = ActivitySerializer(many=True, read_only=True)
    # flights = FlightSerializer(many=True, read_only=True)
    # photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = PackageModification
        exclude = ['user', 'agent']

    def create(self, validated_data):
        user = self.context['request'].user
        agents = CustomUser.objects.filter(is_agent=True)

        random_agent = random.choice(agents)

        if user.is_agent:
            validated_data['type'] = 'PRE-MADE'
        else:
            validated_data['type'] = 'CUSTOM'

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
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = CustomUser.objects.create_user(email=email, password=password)
        return user