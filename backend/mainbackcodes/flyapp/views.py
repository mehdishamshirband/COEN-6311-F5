from rest_framework import viewsets
from .models import Flight, Hotel, Activity, Package
from .serializers import ActivitySerializer, HotelSerializer, FlightSerializer, PackageSerializer


# Create your views here.
class Flights(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

    filterset_fields = {'airlinename': ['icontains'], 'price': ['lte', 'gte'], 'destinationairport': ['icontains'],
                        'originairport': ['icontains'], 'departuredatetime': ['lte', 'gte'],
                        'arrivaldatetime': ['lte', 'gte']}


class Hotels(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    filterset_fields = {'hotelname': ['icontains'], 'address': ['icontains'], 'priceperday': ['lte', 'gte']}


class Activities(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    filterset_fields = {'type': ['icontains'], 'name': ['icontains'], 'price': ['lte', 'gte'], 'grade': ['icontains']}


class Packages(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

    filterset_fields = {'price': ['lte', 'gte'], 'name': ['icontains'], 'grade': ['icontains']}
