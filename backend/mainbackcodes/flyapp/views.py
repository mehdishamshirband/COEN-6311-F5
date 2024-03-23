from rest_framework import viewsets
from .models import Flight, Hotel, Activity, Package, Booking
from .serializers import ActivitySerializer, HotelSerializer, FlightSerializer, PackageSerializer, BookingSerializer


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

    def create(self, request, *args, **kwargs):
        # print("activity ",dict(request.POST).get("activity"))
        hotel = Hotel.objects.filter(id=int(request.data["hotel"])).first()
        inhabitancy = (hotel.checkouttime - hotel.checkintime).days
        if inhabitancy == 0:
            inhabitancy += 1
        if request.data.get("type") == "custom":
            request.data._mutable = True
            request.data["price"] = float(
                (Hotel.objects.filter(id=int(request.data["hotel"])).first()).priceperday) * inhabitancy
            request.data["price"] += float((Flight.objects.filter(id=int(request.data["flight"])).first()).price)
            for i in dict(request.POST).get("activity"):
                request.data["price"] += float(Activity.objects.filter(id=int(i)).first().price)
            request.data._mutable = False
        # print(request.data)
        return super().create(request, *args, **kwargs)

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