from rest_framework import serializers
from models import Flight, Hotel, Activity


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'