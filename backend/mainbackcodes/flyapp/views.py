from django.core.mail import get_connection
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest, HttpResponse, JsonResponse, QueryDict
from rest_framework import serializers, exceptions
from rest_framework import viewsets, mixins, generics
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
import stripe
from .models import Billing, Flight, Hotel, Activity, HotelBooking, Notification, Booking, PackageModification, \
    TravelPackage, Photo
from .serializers import ActivitySerializer, BillingSerializer, HotelBookingSerializer, HotelSerializer, \
    FlightSerializer, NotifSerializer, PackageModificationSerializer, BookingSerializer, TravelPackageSerializer, \
    PhotoSerializer

from datetime import datetime


def filter_queryset_custom_package(request, results):
    def get_my_timezone_date(original_datetime):
        original_datetime = original_datetime.split('T')[0]
        new_datetime = datetime.strptime(original_datetime, '%Y-%m-%d')
        tz = timezone.get_current_timezone()
        timezone_datetime = timezone.make_aware(new_datetime, tz, True)
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


# Create your views here.
class Flights(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'airline': ['icontains'], 'price': ['lte', 'gte'], 'arrivalAirport': ['icontains'],
                        'departureAirport': ['icontains'], 'departureDate': ['lte', 'gte'],
                        'arrivalDate': ['lte', 'gte'], 'showDetails': ['exact']}

    def get_queryset(self):
        results = super(Flights, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class Hotels(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains'], 'location': ['icontains']}

    def get_queryset(self):
        results = super(Hotels, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class HotelsBooking(viewsets.ModelViewSet):
    queryset = HotelBooking.objects.all()
    serializer_class = HotelBookingSerializer

    filterset_fields = {'hotel': ['exact'], 'totalPrice': ['lte', 'gte'], 'checkOut': ['lte', 'gte'],
                        'checkIn': ['lte', 'gte'], 'showDetails': ['exact']}


class Activities(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    filterset_fields = {'type': ['icontains'], 'name': ['icontains'], 'price': ['lte', 'gte'],
                        'location': ['icontains'], 'date': ['lte', 'gte'], 'showDetails': ['exact']}

    def get_queryset(self):
        results = super(Activities, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


from datetime import datetime


def dynamicpricecalc(request):
    if not HotelBooking.objects.filter(id=request.data.get("hotels") or "0").first() and not Flight.objects.filter(
            id=request.data.get("flights") or "0").first() and not Activity.objects.filter(
        id=int(request.data.get("activities") or "0")):
        raise serializers.ValidationError('at least choose one service!!')

    # calc price dynamicly
    # if request.data.get("type") == "custom":
    request.data._mutable = True
    request.data["price"] = 0
    for i in dict(request.data).get("hotels"):
        request.data["price"] += float(HotelBooking.objects.filter(id=int(i)).first().totalPrice)
    for i in dict(request.data).get("flights"):
        request.data["price"] += float(Flight.objects.filter(id=int(i)).first().price)
    for i in dict(request.data).get("activities"):
        request.data["price"] += float(Activity.objects.filter(id=int(i)).first().price)
    request.data._mutable = False
    # print(request.data)
    return request


class TravelPackages(viewsets.ModelViewSet):
    queryset = TravelPackage.objects.all()
    serializer_class = TravelPackageSerializer

    def create(self, request, *args, **kwargs):
        request = dynamicpricecalc(request)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    def partial_update(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    def destroy(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(detail="you'r not allow to perform this action", method=request.method)

    filterset_fields = {'price': ['lte', 'gte'], 'name': ['icontains'], 'type': ['icontains'], 'showDetails': ['exact'],
                        'startingDate': ['lte', 'gte'], 'endingDate': ['lte', 'gte']}

    def get_queryset(self):
        all_package = super(TravelPackages, self).get_queryset()
        results = TravelPackage.objects.none()
        filtervalue = self.request.query_params.get('filterValue')
        if filtervalue is None:
            return all_package

        for key in list(all_package[0].__dict__)[1:]:  # Get all fields names except the first one which is private
            key = f'{key}__icontains'
            if all_package.filter(**{key: filtervalue}).exists():
                results = results | all_package.filter(**{key: filtervalue})

        return results


class BillingDetail(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer


class BookingDetail(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        if request.data.get("travelPackage"):
            request.data._mutable = True
            request.data["cost"] = str(
                (TravelPackage.objects.filter(id=int(request.data["travelPackage"])).first()).price)
            request.data._mutable = False
        else:
            raise serializers.ValidationError('Please select a TravelPackage!')

        # print("data:",request.data)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if self.get_object().bookingState == "confirmed":
            raise exceptions.MethodNotAllowed(detail="customer already paid!!", method=request.method)
        request.data._mutable = True
        if request.data.get("travelPackage"):
            request.data["cost"] = TravelPackage.objects.filter(id=request.data.get("travelPackage")).first().price
        else:
            request.data["cost"] = self.get_object().travelPackage.first().price
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

    def create(self, request, *args, **kwargs):
        # print(request.data)
        # print(PackageSerializer(data=request.data, partial=True).is_valid())
        if Booking.objects.filter(
                travelPackage__id=request.data.get("travelPackage")).first().bookingState == "confirmed":
            raise exceptions.MethodNotAllowed(
                detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                method=request.method)

        if request.data.get("travelPackage") == None:
            raise exceptions.MethodNotAllowed(
                detail="Please select a package to update.",
                method=request.method)

        updated_booking = Booking.objects.filter(travelPackage__id=request.data.get("travelPackage")).first()
        updated_booking.bookingState = "processing"
        updated_booking.save()
        try:  # Temporary exception handling and it will be updated in the Sprint 3 (Mehdi while solving)
            if PackageModification.objects.filter(
                    package__id=request.data["travelPackage"]).first().state != "accepted":
                raise exceptions.MethodNotAllowed(
                    detail="you already have an active modifications request , please wait or create a new request",
                    method=request.method)
        except Exception as e:
            print(e)

        # print("pckmod create user:",request.user)

        request = dynamicpricecalc(request)
        request.data._mutable = True
        request.data["state"] = "pending"
        request.data["cost"] = request.data.get("price")
        request.data["agent"] = str(request.user)
        request.data._mutable = False
        # print(request.data)
        print(request.data.get("price"))

        # print(self.serializer_class(data=request.data).is_valid())
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # print(request.data,request.data["package"])
        # print(Booking.objects.filter(package__id=request.data["package"]).first().status)
        if Booking.objects.filter(travelPackage__id=request.data.get("package")).first().bookingState == "confirmed":
            raise exceptions.MethodNotAllowed(
                detail="you paid for this package, for modification contatct the agent or to add new services buy a new package",
                method=request.method)

        if self.get_object().state == "accepted":
            raise exceptions.MethodNotAllowed(detail="you are already accepted modified package", method=request.method)
        print(self.get_object().state)

        updated_booking = Booking.objects.filter(travelPackage__id=request.data.get("package")).first()
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

    packages = obj.travelPackage.all()
    email_body += f'Booking No: {obj.bookingNo}\n'
    email_body += f'Customer Name: {obj.firstName}\n'
    email_body += f'Total Cost: ${obj.cost}\n'
    # email_body += f'Booking Details: {obj.details}\n'
    email_body += f'Booking Status: {obj.bookingState}\n'

    for package in packages:
        email_body += f'Package Name: {package.name}\n'
        email_body += f'Package Description: {package.description}\n'
        email_body += f'Package Price: ${package.price}\n'
        email_body += f'Travel Period: {package.startingDate} to {package.endingDate}\n'
        if package.flights.all():
            email_body += 'Flights Included:\n'
            for flight in package.flight.all():
                email_body += f'Flight Information: {flight}\n'
                email_body += f'Flight Price: {flight.price}\n'
        if package.hotels.all():
            email_body += 'Hotels Included:\n'
            for hotel in package.hotel.all():
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
        revenue += records.totalcost

    return revenue


class Reports(viewsets.ViewSet):

    def list(self, request):
        query = Booking.objects.filter(bookingState="confirmed").all()
        serializer = BookingSerializer(query, many=True)
        print("fooo", serializer)
        total = revenueCalc(query)
        return Response({"records": serializer.data, "revenue": total,
                         "billings": BillingSerializer(Billing.objects.all(), many=True).data})

    def retrieve(self, request, pk=None):
        queryset = Booking.objects.filter(bookingState="confirmed").filter(firstName=pk)
        serializer = BookingSerializer(queryset, many=True)
        total = revenueCalc(queryset)
        return Response({"records": serializer.data, "revenue": total,
                         "billings": BillingSerializer(Billing.objects.filter(firstName=pk), many=True).data})


class Notifs(viewsets.ViewSet, mixins.CreateModelMixin):

    def create(self, request, *args, **kwargs):
        if request.data.get("message") == None:
            return Response({"msg": "your message is empty"})
        if request.data.get("recipient") == None:
            return Response({"msg": "please specify a recipient"})
        Notification.objects.create(sender=request.user, recipient=request.data.get("recipient"),
                                    message=request.data.get("message"))
        return Response({"msg": "message succesfully send"})

    def retrieve(self, request, pk=None, *args, **kwargs):
        notifs = Notification.objects.filter(recipient=pk)
        serializer = NotifSerializer(notifs, many=True)
        return Response(serializer.data)


class Photos(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer


class PaymentView(generics.CreateAPIView):

    def post(self, request, format=None):
        print(request.data)

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
