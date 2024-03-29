from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking, Package, Notification
from django.contrib.auth.models import User

@receiver(post_save, sender=Package)
def package_created(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            sender='System',
            recipient="me",
            message=f'New package available: {instance.name}'
        )

@receiver(post_save, sender=Booking)
def booking_created(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            sender='System',
            recipient=instance.customer,
            message=f'Your booking with ID {instance.bookingid} has been created.'
        )

# after updating records
@receiver(post_save, sender=Booking)
def booking_updated(sender, instance, created, **kwargs):
    if not created:
        Notification.objects.create(
            sender='System',
            recipient=instance.customer,
            message=f'Your booking with ID {instance.bookingid} has been updated.'
        )