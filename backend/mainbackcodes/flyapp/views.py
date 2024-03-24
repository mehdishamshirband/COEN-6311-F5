from django.http import HttpRequest, JsonResponse, QueryDict
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
    # if request.data.get("type") == "custom":
    request.data._mutable = True
    request.data["price"] = float(hotel.priceperday)*inhabitancy
    request.data["price"] += float(flight.price)
    for i in dict(request.data).get("activity") :
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

    def create(self, request, *args, **kwargs):
        # print(request.data)
        # print(PackageSerializer(data=request.data, partial=True).is_valid())
        if Booking.objects.filter(package__id=request.data["package"]).first().status == "checked":
            raise exceptions.MethodNotAllowed(
                detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                method=request.method)

        updated_booking = Booking.objects.filter(package__id=1).first()
        updated_booking.status = "pending"
        updated_booking.save()

        if PackageModification.objects.filter(package__id=request.data["package"]).first().state != "accepted":
            raise exceptions.MethodNotAllowed(detail="you already have an active modifications request , please wait",
                                              method=request.method)

        # print("pckmod create user:",request.user)

        request.data._mutable = True
        request.data["state"] = "pending"
        request.data["agent"] = str(request.user)
        request.data._mutable = False
        # print(request.data)
        hotel, flight = packagevalidator(request)
        request = dynamicpricecalc(request, hotel, flight)
        print(request.data.get("price"))

        # print(self.serializer_class(data=request.data).is_valid())
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # print(request.data,request.data["package"])
        # print(Booking.objects.filter(package__id=request.data["package"]).first().status)
        if Booking.objects.filter(package__id=request.data["package"]).first().status == "checked":
            raise exceptions.MethodNotAllowed(
                detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                method=request.method)

        # if self.get_object().state == "accepted":
        #     raise exceptions.MethodNotAllowed(detail="you are already accepted modified package", method=request.method)
        # # print(self.get_object().state)

        updated_booking = Booking.objects.filter(package__id=1).first()
        if self.get_object().booking_cancellation and request.data.get("state") == "accepted":
                updated_booking.status = "canceled"
                updated_booking.save()
                return super().update(request, *args, **kwargs)

        if request.data.get("state") == "rejected":
            return super().update(request, *args, **kwargs)
        elif request.data.get("state") == "accepted":

            # print("herer",PackageSerializer(data=request.data, partial=True).is_valid())
            request.data._mutable = True
            request.data["price"] = Package.objects.filter(id=request.data.get("package")).first().price
            request.data._mutable = False
            updated_pck = PackageSerializer(Package.objects.filter(id=request.data.get("package")).first(),
                                            data=request.data, partial=True)
            if updated_pck.is_valid():
                updated_pck.save()
                updated_booking.status = "modified"
                # print("dada",(i for i in updated_booking.package.iterator()))
                for package in updated_booking.package.iterator():
                    updated_booking.totalcost = package.price
                updated_booking.save()


            else:
                raise serializers.ValidationError("your package data is not valid")

        return super().update(request, *args, **kwargs)

    filterset_fields = {'name': ['icontains'], 'state': ['icontains']}