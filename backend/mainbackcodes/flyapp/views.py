from rest_framework import viewsets
from .models import Flight, Hotel, Activity, Package
from .serializers import ActivitySerializer, HotelSerializer, FlightSerializer, PackageSerializer


# Create your views here.
class Flights(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer


class Hotels(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


class Activities(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class Packages(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
