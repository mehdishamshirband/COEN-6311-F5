from django.contrib import admin

from .forms import BillingAdminForm, BookingAdminForm, PackageAdminForm, PackageModificationAdminForm, \
    UserRegistrationAdminForm
from .models import Billing, CustomUser, Hotel, Flight, Activity, HotelBooking, PackageModification, Photo, \
    TravelPackage, Booking


# Register your model, Accessible in admin site
class PackageModificationAdmin(admin.ModelAdmin):
    form = PackageModificationAdminForm
    list_display = ('name', 'state', 'booking_cancellation')
    list_filter = ('name', 'state')
    search_fields = ('user__email',)


class BookingAdmin(admin.ModelAdmin):
    form = BookingAdminForm
    list_display = ('user', 'bookingNo', 'bookingState')
    search_fields = ('user__email',)


class BillingAdmin(admin.ModelAdmin):
    form = BillingAdminForm
    list_display = ('paymentType', 'paymentState')
    search_fields = ('user__email',)


class PackageModificationAdmin(admin.ModelAdmin):
    form = PackageAdminForm
    list_display = ('name', 'price')
    list_filter = ('name',)
    search_fields = ('user__email',)


admin.site.register(Photo)
admin.site.register(Hotel)
admin.site.register(Flight)
admin.site.register(Activity)
admin.site.register(PackageModification, PackageModificationAdmin)
admin.site.register(TravelPackage)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Billing, BillingAdmin)
admin.site.register(HotelBooking)


class CustomUserAdmin(admin.ModelAdmin):
    form = UserRegistrationAdminForm
    list_display = ('email', 'is_agent')
    list_filter = ('is_agent',)
    search_fields = ('email',)
    exclude = ['reset_code']


admin.site.register(CustomUser, CustomUserAdmin)