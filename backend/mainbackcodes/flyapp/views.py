from django.core.mail import get_connection
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest, HttpResponse, JsonResponse, QueryDict
from rest_framework import serializers, exceptions, status
from rest_framework import viewsets, mixins, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import authentication_classes
from django.views.decorators.csrf import csrf_exempt
import stripe
from .models import Billing, CustomUser, Flight, Hotel, Activity, HotelBooking, Notification, Booking, \
    PackageModification, \
    TravelPackage, Photo
from .serializers import ActivitySerializer, BillingSerializer, HotelBookingSerializer, HotelSerializer, \
FlightSerializer, NotifSerializer, PackageModificationSerializer, BookingSerializer, TravelPackageSerializer, \
    PhotoSerializer, UserRegistrationSerializer
import stripe, json
from rest_framework.views import APIView



from datetime import datetime
from django.utils.crypto import get_random_string


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


class IsAgent(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
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
            return False
        elif request.user.is_staff or request.user.is_agent:
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
                        'arrivalDate': ['lte', 'gte'], 'showDetails': ['exact']}

    def get_queryset(self):
        results = super(Flights, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class Hotels(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains'], 'location': ['icontains']}

    def get_queryset(self):
        results = super(Hotels, self).get_queryset()
        return filter_queryset_custom_package(self.request, results)


class HotelsBooking(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = HotelBooking.objects.all()
    serializer_class = HotelBookingSerializer

    filterset_fields = {'hotel': ['exact'], 'totalPrice': ['lte', 'gte'], 'checkOut': ['lte', 'gte'],
                        'checkIn': ['lte', 'gte'], 'showDetails': ['exact']}


class Activities(viewsets.ModelViewSet):
    permission_classes = [CustomReadOnlyPermission, ]
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def list(self, request, *args, **kwargs):
        print(request.user)
        return super().list(request, *args, **kwargs)

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
    permission_classes = [CustomReadOnlyOrCreatePermission,]

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
    permission_classes = [CustomReadOnlyOrCreatePermission, ]

    def create(self, request, *args, **kwargs):
        try:
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

    '''
    def create(self, request, *args, **kwargs):
        if request.data.get("travelPackage"):
            request.data._mutable = True
            request.data["cost"] = str(
                (TravelPackage.objects.filter(id=int(request.data["travelPackage"])).first()).price)
            request.data._mutable = False
        else:
            raise serializers.ValidationError('Please select a TravelPackage!')
    '''

    def create(self, request, *args, **kwargs):

        try:

            '''
            new_booking = BookingSerializer(data=request.data, partial=True)
            new_booking.bookingNo = Booking.objects.all().count() + 1

            new_booking.billing = billing
            
            new_booking.travelPackage = travel_package
            '''

            billing = Billing.objects.get(id=request.data.get("billing").get("id"))
            travel_package = TravelPackage.objects.get(id=request.data.get("travelPackage").get("id"))

            new_booking = Booking.objects.create(
                bookingNo=Booking.objects.all().count() + 1,
                firstName=request.data.get("firstName"),
                lastName=request.data.get("lastName"),
                email=request.data.get("email"),
                phone=request.data.get("phone"),
                bookingState=request.data.get("bookingState"),
                cost=request.data.get("cost"),
                billing=billing,
                travelPackage=travel_package,
            )

            new_booking.save()

            #email_send_booking_details(new_booking)

            return Response({"msg": "booking created successfully", "bookingNo": new_booking.bookingNo})

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
        # request.data["agent"] = str(request.user)
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


class Reports(viewsets.ViewSet):
    permission_classes = [IsAdminUser, ]

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


class CreatePaymentIntents(APIView):
    def post(self, request) -> JsonResponse:
        try:
            data = request.data

            stripe.api_key = settings.STRIPE_SECRET_KEY

            # Create a PaymentIntent with the order amount and currency
            intent = stripe.PaymentIntent.create(
                amount=data['amount'],
                currency='cad', # Check if we can put it in auto
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


class PaymentView(APIView):
    permission_classes = [IsAgent, ]

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
