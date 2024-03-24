from rest_framework import serializers, exceptions
from rest_framework import viewsets
from .models import Flight, Hotel, Activity, Package, Booking, PackageModification
from .serializers import ActivitySerializer, HotelSerializer, FlightSerializer, PackageModificationSerializer, PackageSerializer, BookingSerializer
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

from datetime import datetime


def packagevalidator(request):
    if not Hotel.objects.filter(id=request.data.get("hotel") or "0").first() and not Flight.objects.filter(
            id=request.data.get("flight") or "0").first() and not Activity.objects.filter(
            id=int(request.data.get("activity") or "0")):
        raise serializers.ValidationError('at least choose one service!!')

    hotel = Hotel.objects.filter(id=int(request.data["hotel"])).first()
    flight = Flight.objects.filter(id=int(request.data["flight"])).first()

    if request.data.get("hotel"):
        if hotel.checkintime <= datetime.strptime(request.data.get("start"), "%Y-%m-%d").date() <= datetime.strptime(
                request.data.get("end"), "%Y-%m-%d").date() <= hotel.checkouttime:
            print("pass")
        else:
            raise serializers.ValidationError('check the date with hotel!!')

    if request.data.get("flight"):
        # print(datetime.strptime(request.data.get("start"), "%Y-%m-%d").date() , hotel.checkintime  ,hotel.checkouttime ,  datetime.strptime(request.data.get("end"), "%Y-%m-%d").date())
        if datetime.strptime(request.data.get("start"),
                             "%Y-%m-%d").date() <= flight.departuredatetime <= flight.arrivaldatetime <= datetime.strptime(
                request.data.get("end"), "%Y-%m-%d").date():
            print("pass")
        else:
            raise serializers.ValidationError('check the date with flight!!')
    return hotel, flight


def dynamicpricecalc(request, hotel, flight):
    inhabitancy = (hotel.checkouttime - hotel.checkintime).days
    if inhabitancy == 0:
        inhabitancy += 1

    # calc price dynamicly
    if request.data.get("type") == "custom":
        request.data._mutable = True
        request.data["price"] = float(hotel.priceperday)*inhabitancy
        request.data["price"] += float(flight.price)
        for i in dict(request.POST).get("activity") :
            request.data["price"] += float(Activity.objects.filter(id=int(i)).first().price)
        request.data._mutable = False
    # print(request.data)
    return request

class Packages(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

    def create(self, request, *args, **kwargs):
        # print("activity ",dict(request.POST).get("activity"))
        # print(request.data)
        # print(not Hotel.objects.filter(id=request.data.get("hotel") or "0").first() and not Flight.objects.filter(id=request.data.get("flight") or "0").first() and not Activity.objects.filter(id=int(request.data.get("activity") or "0")))
        hotel, flight = packagevalidator(request)
        request = dynamicpricecalc(request, hotel, flight)

        hotel.capacity -= 1
        flight.availableseats -= 1
        hotel.save()
        flight.save()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    def partial_update(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    def destroy(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    filterset_fields = {'price': ['lte', 'gte'], 'name': ['icontains'], 'grade': ['icontains']}


class BookingDetail(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        if request.data.get("package"):
            request.data._mutable = True
            request.data["totalcost"] = str((Package.objects.filter(id=int(request.data["package"])).first()).price)
            request.data._mutable = False

        # print("data:",request.data)
        return super().create(request, *args, **kwargs)


class PackagesModification(viewsets.ModelViewSet):
    queryset = PackageModification.objects.all()
    serializer_class = PackageModificationSerializer

    filterset_fields = {'name': ['icontains'], 'state': ['icontains']}