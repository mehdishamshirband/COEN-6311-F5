from random import choice

from django import forms

from .serializers import generate_unique_booking_no
from .models import Billing, Booking, CustomUser, PackageModification, TravelPackage


class PackageModificationAdminForm(forms.ModelForm):
    class Meta:
        model = PackageModification
        exclude = ['user', 'type', 'agent']

    def save(self, commit=True):
        instance = super().save(commit=False)
        user = self.instance.user
        agents = CustomUser.objects.filter(is_agent=True)
        random_agent = choice(agents)

        if user.is_agent:
            instance.type = 'PRE-MADE'
        else:
            instance.type = 'CUSTOM'

        instance.user = user
        instance.agent = random_agent

        if commit:
            instance.save()
        return instance


class PackageAdminForm(forms.ModelForm):
    class Meta:
        model = TravelPackage
        exclude = ['user', 'type']

    def save(self, commit=True):
        instance = super().save(commit=False)
        user = self.instance.user

        if user.is_agent:
            instance.type = 'PRE-MADE'
        else:
            instance.type = 'CUSTOM'

        instance.user = user

        if commit:
            instance.save()
        return instance


class UserRegistrationAdminForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = '__all__'

    def save(self, commit=True):
        instance = super().save(commit=False)

        if commit:
            instance.save()
        return instance


class BookingAdminForm(forms.ModelForm):
    class Meta:
        model = Booking
        exclude = ['user', 'bookingNo']

    def save(self, commit=True):
        instance = super().save(commit=False)
        user = self.instance.user

        # Set the user and generate a unique booking number
        instance.user = user
        instance.bookingNo = generate_unique_booking_no()

        if commit:
            instance.save()
        return instance


class BillingAdminForm(forms.ModelForm):
    class Meta:
        model = Billing
        exclude = ['user']

    def save(self, commit=True):
        instance = super().save(commit=False)
        user = self.instance.user

        instance.user = user

        if commit:
            instance.save()
        return instance