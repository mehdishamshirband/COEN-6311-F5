import json
from django.core.mail import get_connection
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest, HttpResponse, JsonResponse, QueryDict
from rest_framework import serializers, exceptions, status
from rest_framework import viewsets, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import stripe
from .models import Billing, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, \
    TravelPackage, Photo, CustomUser
from .serializers import ActivitySerializer, ActivityDSerializer, BillingSerializer, HotelBookingSerializer, HotelSerializer, \
    BookingDSerializer, HotelBookingDSerializer, HotelDSerializer, FlightSerializer, NotifSerializer, PackageModificationSerializer, \
    PackageModificationDSerializer, BookingSerializer, TravelPackageSerializer, TravelPackageDSerializer, \
    PhotoSerializer, UserRegistrationSerializer, generate_unique_booking_no

from datetime import datetime
from django.utils.crypto import get_random_string


def filter_queryset_custom_package(request, results):
    def get_my_timezone_date(original_datetime):
        original_datetime = original_datetime.split('T')[0]
        new_datetime = datetime.strptime(original_datetime, '%Y-%m-%d')
        tz = timezone.get_current_timezone()
        timezone_datetime = timezone.make_aware(new_datetime, tz)
        return timezone_datetime

    for key, value in request.query_params.items():

        if value == "":
            continue
        elif "date" in key.lower():
            if type(value) is str:
                value = get_my_timezone_date(value)
            if ("depart" in key.lower() or key.lower() == "date") and "__" not in key:
                key += '__gte'
            elif "arrival" in key.lower() and "__" not in key:
                key += '__lte'
        elif "__" not in key:
            key += '__icontains'

        try:
            results = results.filter(**{key: value})
        except Exception as e:
            print(f"Error while filtering : {e}")
            continue

    return results


class IsAgent(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return request.method in ['GET']
        elif request.user.is_staff or request.user.is_agent:
            return True
        return request.user.is_authenticated and request.method in ['GET']


class CustomReadOnlyPermission(BasePermission):
    def has_permission(self, request, view):

        # Allow read-only access for anonymous users
        if request.user.is_anonymous:
            return request.method in ['GET']
        elif request.user.is_staff or request.user.is_agent:
            return True
        # Allow full CRUD access for admin or agent users
        return request.method in ['GET']


class CustomReadOnlyOrCreatePermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return request.method == 'GET'
        elif request.user.is_staff or request.user.is_agent:
            print("Has permissions here") #TODO: delete this debug line
            return True
        # Allow read-only access for authenticated users (GET requests)
        elif request.method == 'GET':
            return request.user.is_authenticated
        # Allow create access for authenticated users (POST requests)
        elif request.method == 'POST':
            return request.user.is_authenticated
        # Deny update or destroy access for all other methods
        return False

    def has_object_permission(self, request, view, obj):
        # Allow read access for authenticated users if the object belongs to them
        if request.user.is_anonymous:
            return request.method == 'GET'
        return (request.user.is_authenticated and obj.user == request.user) or (
                    request.user.is_staff or request.user.is_agent)


class NotifPerm(CustomReadOnlyOrCreatePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.recipient == request.user


# Create your views here.
class Flights(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

    def list(self, request, *args, **kwargs):
        print(request.user)
        return super().list(request, *args, **kwargs)

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'airline': ['icontains'], 'price': ['lte', 'gte'], 'arrivalAirport': ['icontains'],
                        'departureAirport': ['icontains'], 'departureDate': ['lte', 'gte'],
                        'arrivalDate': ['lte', 'gte']}

    def get_queryset(self):
        results = super(Flights, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class Hotels(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return HotelDSerializer
        else:
            return self.serializer_class

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains'], 'location': ['icontains']}

    def get_queryset(self):
        results = super(Hotels, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class HotelsBooking(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = HotelBooking.objects.all()
    serializer_class = HotelBookingSerializer

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return HotelBookingDSerializer
        else:
            return self.serializer_class

    def get_queryset(self):
        results = super(HotelsBooking, self).get_queryset()
        value = dict(self.request.query_params.items())['location']
        results = results.filter(hotel__location__icontains=value)

        return results

    filterset_fields = {'hotel': ['exact'], 'totalPrice': ['lte', 'gte'], 'checkOut': ['lte', 'gte'],
                        'checkIn': ['lte', 'gte']}


class Activities(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ActivityDSerializer
        else:
            return self.serializer_class

    filterset_fields = {'type': ['icontains'], 'name': ['icontains'], 'price': ['lte', 'gte'],
                        'location': ['icontains'], 'date': ['lte', 'gte']}

    def get_queryset(self):
        results = super(Activities, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


from datetime import datetime


"""
def dynamicpricecalc(request):
    if not HotelBooking.objects.filter(id=request.data.get("hotels")[0] or "0").first() and not Flight.objects.filter(
            id=request.data.get("flights")[0] or "0").first() and not Activity.objects.filter(
        id=request.data.get("activities")[0] or "0"):
        raise serializers.ValidationError('at least choose one service!!')

    # calc price dynamicly
    # if request.data.get("type") == "custom":
    # request.data._mutable = True
    request.data["price"] = 0
    for i in dict(request.data).get("hotels"):
        request.data["price"] += float(HotelBooking.objects.filter(id=int(i)).first().totalPrice)
    for i in dict(request.data).get("flights"):
        request.data["price"] += float(Flight.objects.filter(id=int(i)).first().price)
    for i in dict(request.data).get("activities"):
        request.data["price"] += float(Activity.objects.filter(id=int(i)).first().price)
    # request.data._mutable = False
    # print(request.data)
    return request
"""
"""
def dynamicpricecalc(request):
    mutable_data = request.data.copy()

    hotel_ids = mutable_data.get("hotels", [])
    flight_ids = mutable_data.get("flights", [])
    activity_ids = mutable_data.get("activities", [])

    if not hotel_ids and not flight_ids and not activity_ids:
        raise serializers.ValidationError('Choose at least one service!')

    total_price = 0
    if hotel_ids:
        total_price += HotelBooking.objects.filter(id__in=hotel_ids).aggregate(Sum('totalPrice'))['totalPrice__sum'] or 0
    if flight_ids:
        total_price += Flight.objects.filter(id__in=flight_ids).aggregate(Sum('price'))['price__sum'] or 0
    if activity_ids:
        total_price += Activity.objects.filter(id__in=activity_ids).aggregate(Sum('price'))['price__sum'] or 0

    mutable_data["price"] = total_price
    request.data = mutable_data

    return request
"""

def dynamicpricecalc(request):
    if not HotelBooking.objects.filter(id=request.data.get("hotels")[0] or "0").first() and not Flight.objects.filter(
            id=request.data.get("flights")[0] or "0").first() and not Activity.objects.filter(
            id=request.data.get("activities")[0] or "0"):
        raise serializers.ValidationError('at least choose one service!!')

    # calc price dynamicly
    # if request.data.get("type") == "custom":
    # request.data._mutable = True
    request.data["price"] = 0
    for i in dict(request.data).get("hotels"):
        request.data["price"] += float(HotelBooking.objects.filter(id=int(i)).first().totalPrice)
    for i in dict(request.data).get("flights"):
        request.data["price"] += float(Flight.objects.filter(id=int(i)).first().price)
    for i in dict(request.data).get("activities"):
        request.data["price"] += float(Activity.objects.filter(id=int(i)).first().price)
    # request.data._mutable = False
    # print(request.data)
    return request



class TravelPackages(viewsets.ModelViewSet):
    queryset = TravelPackage.objects.all()
    serializer_class = TravelPackageSerializer
    permission_classes = [CustomReadOnlyOrCreatePermission, ]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return TravelPackageDSerializer
        else:
            return self.serializer_class

    def create(self, request, *args, **kwargs):

        request._mutable = True
        request.data["endingDate"] = request.data.get("endingDate")[:10]  # Get only the date part, not the timezone
        request.data["startingDate"] = request.data.get("startingDate")[:10]
        for i in range(len(request.data["hotels"])):
            request.data["hotels"][i]["checkIn"] = request.data["hotels"][i]["checkIn"][:10]
            request.data["hotels"][i]["checkOut"] = request.data["hotels"][i]["checkOut"][:10]
        request._mutable = False

        return super().create(request, *args, **kwargs)

    """
    def partial_update(self, request, *args, **kwargs):
        print("Partial update here") #TODO: delete
        #raise exceptions.MethodNotAllowed(detail="You are not allowed to perform this action", method=request.method)

    def destroy(self, request, *args, **kwargs):
        print("Destroy here") #TODO: delete
        #raise exceptions.MethodNotAllowed(detail="You are not allowed to perform this action", method=request.method)
    """
    filterset_fields = {'price': ['lte', 'gte'], 'name': ['icontains'], 'type': ['icontains'],
                        'startingDate': ['lte', 'gte'], 'endingDate': ['lte', 'gte']}


    def get_queryset(self):
        all_package = super(TravelPackages, self).get_queryset()
        results = TravelPackage.objects.none()
        filtervalue = self.request.query_params.get('filterValue')
        if filtervalue is None:
            return all_package

        for key in list(all_package[0].__dict__)[1:]:  # Get all fields names except the first one which is private
            if 'user' in key.lower():
                continue

            key = f'{key}__icontains'
            if all_package.filter(**{key: filtervalue}).exists():
                results = results | all_package.filter(**{key: filtervalue})

        return results


class BillingDetail(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [CustomReadOnlyOrCreatePermission, ]

    def create(self, request, *args, **kwargs):
        try:
            #print(request.data)
            new_billing = BillingSerializer(data=request.data)

            if not new_billing.is_valid():
                raise serializers.ValidationError(new_billing.errors)

            new_billing.save()
            return Response({"msg": "billing created successfully", "id": new_billing.data.get("id")})
        except Exception as e:
            return JsonResponse({"error": {'message': str(e)}}, status=403)


class BookingDetail(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [CustomReadOnlyOrCreatePermission, ]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return BookingDSerializer
        else:
            return self.serializer_class

    def create(self, request, *args, **kwargs):

        """
        if request.data.get("travelPackage"):
            request.data._mutable = True
            request.data["cost"] = str(
                (TravelPackage.objects.filter(id=int(request.data["travelPackage"])).first()).price)
            request.data["state"] = "created"
            request.data._mutable = False
        else:
            raise serializers.ValidationError('Please select a TravelPackage!')

        # print("data:",request.data)
        return super().create(request, *args, **kwargs)
        """

        try:
            temp = request
            temp._mutable = True
            temp.data['travelPackage'] = temp.data['travelPackage']['id']
            temp.data['billing'] = temp.data['billing']['id']
            temp.data['bookingNo'] = generate_unique_booking_no()
            temp._mutable = False

            new_booking = BookingSerializer(data=temp.data)

            if not new_booking.is_valid():
                raise serializers.ValidationError(new_booking.errors)

            new_booking.save()
            # email_send_booking_details(new_booking) # From Benoit : Can't work because travel package is just and id not an object

            return Response({"msg": "booking created successfully", "bookingNo": temp.data['bookingNo']})

        except Exception as e:
            return JsonResponse({"error": {'message': str(e)}}, status=403)


    def update(self, request, *args, **kwargs):
        if self.get_object().bookingState == "confirmed":
            raise exceptions.MethodNotAllowed(detail="customer already paid!!", method=request.method)
        request.data._mutable = True
        if request.data.get("travelPackage"):
            request.data["cost"] = TravelPackage.objects.filter(id=request.data.get("travelPackage")).first().price
        else:
            request.data["cost"] = self.get_object().travelPackage.price
        request.data._mutable = False
        email_send_booking_details(self.get_object())
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if self.get_object().bookingState == "confirmed":
            raise exceptions.MethodNotAllowed(detail="customer already paid!!", method=request.method)
        return super().destroy(request, *args, **kwargs)


class PackagesModification(viewsets.ModelViewSet):
    queryset = PackageModification.objects.all()
    serializer_class = PackageModificationSerializer
    permission_classes = [CustomReadOnlyOrCreatePermission, ]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return PackageModificationDSerializer
        else:
            return self.serializer_class

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_anonymous:
            raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        if request.user.is_anonymous:
            raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        if request.data.get("package") == None:
            raise exceptions.MethodNotAllowed(
                detail="Please select a package to update.",
                method=request.method)

        if Booking.objects.filter(
                user=request.user, bookingState="confirmed",
                travelPackage__id=request.data.get("package")).first() != None:
            updated_booking = Booking.objects.filter(user=request.user,
                                                     travelPackage__id=request.data.get("package")).first()
            if updated_booking.bookingState == "confirmed":
                raise exceptions.MethodNotAllowed(
                    detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                    method=request.method)
            else:
                updated_booking.bookingState = "processing"
                updated_booking.save()

        try:
            if PackageModification.objects.filter(
                    package__id=request.data["package"]).first().state != "accepted":
                raise exceptions.MethodNotAllowed(
                    detail="you already have an active modifications request , please wait or create a new request",
                    method=request.method)
        except AttributeError as e:
            print(e)

        # print("pckmod create user:",request.user)

        request.data._mutable = True
        request = dynamicpricecalc(request)
        request.data["state"] = "pending"
        request.data["price"] = request.data.get("price")
        # request.data["agent"] = str(request.user)
        request.data._mutable = False
        # print(request.data)
        print(request.data.get("price"))

        # print(self.serializer_class(data=request.data).is_valid())
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # print(request.data,request.data["package"])
        # print(Booking.objects.filter(package__id=request.data["package"]).first().status)
        if self.get_object().state == "accepted":
            raise exceptions.MethodNotAllowed(detail="you are already accepted modified package", method=request.method)
        print(self.get_object().state)

        if Booking.objects.filter(
                user=request.user, bookingState="confirmed",
                travelPackage__id=request.data.get("package")).first() != None:
            updated_booking = Booking.objects.filter(user=request.user,
                                                     travelPackage__id=request.data.get("package")).first()
            if updated_booking.bookingState == "confirmed":
                raise exceptions.MethodNotAllowed(
                    detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                    method=request.method)

        if Booking.objects.filter(
                user=request.user, bookingState="confirmed",
                travelPackage__id=request.data.get("package")).first() != None:
            if self.get_object().booking_cancellation and request.data.get("state") == "accepted":
                updated_booking.bookingState = "canceled"
                # updated_booking.creationdate =datetime.now()
                updated_booking.save()
                return super().update(request, *args, **kwargs)

        if request.data.get("state") == "rejected":
            return super().update(request, *args, **kwargs)
        elif request.data.get("state") == "accepted":

            # print("herer",PackageSerializer(data=request.data, partial=True).is_valid())
            request.data._mutable = True
            request.data["price"] = TravelPackage.objects.filter(id=request.data.get("package")).first().price
            request.data._mutable = False
            updated_pck = TravelPackageSerializer(TravelPackage.objects.filter(id=request.data.get("package")).first(),
                                                  data=request.data, partial=True)
            if updated_pck.is_valid():
                updated_pck.save()
                if Booking.objects.filter(
                        user=request.user, bookingState="confirmed",
                        travelPackage__id=request.data.get("package")).first() != None:
                    updated_booking.bookingState = "modified"
                    updated_booking.cost = 0
                    # updated_booking.creationdate =datetime.now()
                    # print("dada",(i for i in updated_booking.package.iterator()))
                    for package in updated_booking.travelPackage.iterator():
                        updated_booking.cost += package.price
                    updated_booking.save()
                    email_send_booking_details(updated_booking)


            else:
                raise serializers.ValidationError("your package data is not valid")

        return super().update(request, *args, **kwargs)

    filterset_fields = {'name': ['icontains'], 'state': ['icontains']}


import mailtrap as mt


def email_send_booking_details(obj):
    email_body = 'Dear Valued Customers,\n\nWe are writing to inform you of your current booking records and associated package details:\n\n'

    package = obj.travelPackage
    email_body += f'Booking No: {obj.bookingNo}\n'
    email_body += f'Customer Name: {obj.firstName}\n'
    email_body += f'Total Cost: ${obj.cost}\n'
    # email_body += f'Booking Details: {obj.details}\n'
    email_body += f'Booking Status: {obj.bookingState}\n'

    # for package in packages:
    email_body += f'Package Name: {package.name}\n'
    email_body += f'Package Description: {package.description}\n'
    email_body += f'Package Price: ${package.price}\n'
    email_body += f'Travel Period: {package.startingDate} to {package.endingDate}\n'
    if package.flights.all():
        email_body += 'Flights Included:\n'
        for flight in package.flights.all():
            email_body += f'Flight Information: {flight}\n'
            email_body += f'Flight Price: {flight.price}\n'
    if package.hotels.all():
        email_body += 'Hotels Included:\n'
        for hotel in package.hotels.all():
            email_body += f'Hotel Information: {hotel}\n'
            email_body += f'Hotel Price: {hotel.totalPrice}\n'
    if package.activities.all():
        email_body += 'Activities Included:\n'
        for activity in package.activities.all():
            email_body += f'- {activity} - price : {activity.price}\n'
    email_body += '\n'

    email_body += 'Thank you for choosing us for your travel needs.\n\nBest regards,\nFlyApp'

    mail = mt.Mail(
        sender=mt.Address(email="mailtrap@demomailtrap.com", name="FlyApp Email"),
        to=[mt.Address(email="mehdi.shamshirband@mail.concordia.ca")],
        # Email notifications will only be sent to this email since this email has been signed up on the demo website.
        subject="Your booking details!",
        text=email_body,
        category="Django Test",
    )

    client = mt.MailtrapClient(token=settings.MAILTRAP_TOKEN)
    client.send(mail)


def revenueCalc(data):
    revenue = 0
    for records in data:
        revenue += records.cost

    return revenue


payment_status = (
    ('created', 'CREATED'),
    ('processing', 'PROCESSING'),
    ('canceled', 'CANCELED'),
    ('failed', 'FAILED'),
    ('modified', 'MODIFIED'),
    ('confirmed', 'CONFIRMED'),
    ('refunded', 'REFUNDED')
)

class Reports(viewsets.ViewSet):
    # permission_classes = [IsAgent, ] # It was admin ??

    def list(self, request):
        query = Booking.objects.filter().all()
        revenue = {}
        records = {}
        total_revenue = 0
        total_records = 0

        for key, _ in payment_status:
            temp = query.filter(bookingState__icontains=key).all()
            revenue[key] = round(revenueCalc(temp), 2)
            records[key] = temp.count()
            total_revenue += revenue[key]
            total_records += records[key]

        revenue["total"] = round(total_revenue, 2)
        records["total"] = total_records

        return Response({"booking_record": records, "revenue": revenue})

    def retrieve(self, request, pk=None):
        queryset = Booking.objects.filter(bookingState="confirmed").filter(firstName=pk)
        serializer = BookingSerializer(queryset, many=True)
        total = revenueCalc(queryset)
        return Response({"records": serializer.data, "revenue": total,
                         "billings": BillingSerializer(Billing.objects.filter(firstName=pk), many=True).data})


class Notifs(viewsets.ViewSet, mixins.CreateModelMixin):
    permission_classes = [NotifPerm, ]

    def create(self, request, *args, **kwargs):
        if request.data.get("message") == None:
            return Response({"msg": "your message is empty"})
        if request.data.get("recipient") == None:
            return Response({"msg": "please specify a recipient"})
        Notification.objects.create(sender=request.user,
                                    recipient=CustomUser.objects.get(pk=request.data.get("recipient")),
                                    message=request.data.get("message"))
        return Response({"msg": "message succesfully send"})

    def retrieve(self, request, pk=None, *args, **kwargs):
        notifs = Notification.objects.filter(recipient=pk)
        serializer = NotifSerializer(notifs, many=True)
        return Response(serializer.data)


class Photos(viewsets.ModelViewSet):
    permission_classes = [IsAgent, ]
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        upload_dir = self.request.data.get('upload_dir')
        if upload_dir not in ['photos/hotels', 'photos/flights', 'photos/activities', 'photos/travel-packages']:
            upload_dir = 'others'

        serializer.save(upload_dir=upload_dir)


class PhotoUploadView(APIView):
    def post(self, request, *args, **kwargs):
        photo_serializer = PhotoSerializer(data=request.data, context={'request': request})
        if photo_serializer.is_valid():
            photo_instance = photo_serializer.save()
            response_data = {
                'id': photo_instance.id,
                'url': request.build_absolute_uri(photo_instance.url.url),
                'caption': photo_instance.caption,
                'upload_dir': photo_instance.upload_dir
            }
            return Response(response_data, status=status.HTTP_201_CREATED) #photo_serializer.data
        else:
            return Response(photo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        photo = get_object_or_404(Photo, pk=pk)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreatePaymentIntents(APIView):
    def post(self, request) -> JsonResponse:
        try:
            data = request.data
            print(int(round(data['amount'] * 100, 2)))  # Cents

            stripe.api_key = settings.STRIPE_SECRET_KEY

            # Create a PaymentIntent with the order amount and currency
            intent = stripe.PaymentIntent.create(
                amount=int(round(data['amount'] * 100, 2)),
                currency='cad', # Check if we can put it in auto like in frontend
                # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods={
                    'enabled': True,
                },
            )

            return JsonResponse({
                'clientSecret': intent['client_secret'],
                'paymentIntent': {'status': 'succeeded'}
            })

        except Exception as e:
            return JsonResponse({"error": {'message': str(e)}}, status=403)


class PaymentView(generics.CreateAPIView):
    permission_classes = [IsAgent, ]

    def post(self, request, format=None):

        if not Booking.objects.get(bookingNo=request.data.get("bookingNo")):
            raise serializers.ValidationError(f"Please add a BookingNo to start the proccess")

        stripe.api_key = settings.STRIPE_SECRET_KEY
        pkgs = Booking.objects.get(bookingNo=request.data.get("bookingNo")).travelPackage.all()
        print(pkgs)
        amount = 0
        for pkg in pkgs:
            amount += int(pkg.price) * 100  # in cents
            print("good", amount)
        description = "Test payment"
        # print("good", amount)
        if amount == 0:
            raise serializers.ValidationError(f"Check the booking record!")

        try:
            # Create a payment intent
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",
                description=description,
                payment_method_types=["card"],
                payment_method_data={'type': "card",
                                     "card": {"token": request.data.get('token')
                                              }
                                     },
                metadata={
                    "bookingNo": request.data.get("bookingNo")
                }
            )

            print("see what", intent.TransferData)

            return Response({"client_secret": intent.client_secret})
        except stripe.error.StripeError as e:
            print(e)
            return Response({"error": str(e)}, status=400)


@csrf_exempt
def stripe_webhook(request):
    if request.method != 'POST':
        return HttpResponse(status=405)  # Method Not Allowed
    payload = request.body
    sig_header = request.headers['STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse({"status": "400"})

    print(event['type'])

    session = event['data']['object']
    booking = Booking.objects.get(bookingNo=session["metadata"]["bookingNo"])
    bill = booking.billing

    if event['type'] == 'payment_intent.created':
        bill.paymentState = "firstdeposit"
    if event['type'] == 'payment_intent.succeeded':
        bill.paymentState = "seconddeposit"
    if event['type'] == 'charge.succeeded':
        bill.paymentState = "lastdeposit"
        booking.bookingState = "confirmed"

    booking.save()
    email_send_booking_details(booking)
    bill.save()
    print(session)
    # customer_email = session["customer_details"]["email"]
    # payment_intent = session["payment_intent"]

    # Booking.ob
    # return HttpResponse(status=200)
    return HttpResponse({'status': '200'})


class CustomUserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer


class PasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        reset_code = get_random_string(length=6)
        user.reset_code = reset_code
        user.save()

        print("done")

        subject = "Password Recovery"
        message = f"Use the following code to reset your password: {reset_code}"
        message += "\n You can use the following link to reset your password: http://localhost:4200/reset-password"
        message += "\n\nIf you did not request a password reset, please ignore this email."

        mail = mt.Mail(
            sender=mt.Address(email="mailtrap@demomailtrap.com", name="FlyApp Email"),
            to=[mt.Address(email="mehdi.shamshirband@mail.concordia.ca")],
            # Email notifications will only be sent to this email since this email has been signed up on the demo website.
            subject=subject,
            text=message,
            category="Django Test",
        )

        client = mt.MailtrapClient(token=settings.MAILTRAP_TOKEN)
        client.send(mail)
        print("done")

        return Response({'detail': 'Email sent successfully'}, status=status.HTTP_200_OK)


class PasswordUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        reset_code = request.data.get('reset_code')
        new_password = request.data.get('new_password')

        try:
            user = CustomUser.objects.get(email=email, reset_code=reset_code)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Invalid reset code'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's password
        user.set_password(new_password)
        user.reset_code = None  # Clear the reset code
        user.save()

        return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)

