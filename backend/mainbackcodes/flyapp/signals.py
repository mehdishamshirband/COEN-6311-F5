from django.db.models.signals import post_save
from django.dispatch import receiver

from flyapp.views import email_send_booking_details
from .models import Booking, CustomUser, TravelPackage, Notification

@receiver(post_save, sender=TravelPackage)
def package_created(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            sender=CustomUser.objects.get(email="sys@info.com"),
            recipient=instance.user,
            message=f'New package available: {instance.name}'
        )

@receiver(post_save, sender=Booking)
def booking_created(sender, instance, created, **kwargs):
    if created:
        email_send_booking_details(instance)
        Notification.objects.create(
            sender=CustomUser.objects.get(email="sys@info.com"),
            recipient=instance.user,
            message=f'Your booking with ID {instance.bookingNo} has been created.'
        )

# after updating records
@receiver(post_save, sender=Booking)
def booking_updated(sender, instance, created, **kwargs):
    if not created:
        Notification.objects.create(
            sender=CustomUser.objects.get(email="sys@info.com"),
            recipient=instance.user,
            message=f'Your booking with ID {instance.bookingNo} has been updated.'
        )