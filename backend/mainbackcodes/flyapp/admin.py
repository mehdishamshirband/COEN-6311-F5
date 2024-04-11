from django.contrib import admin
from .models import Billing, Hotel,Flight,Activity, HotelBooking,TravelPackage,Booking
# Register your model, Accessible in admin site
admin.site.register(Hotel)
admin.site.register(Flight)
admin.site.register(Activity)
admin.site.register(TravelPackage)
admin.site.register(Booking)
admin.site.register(Billing)
admin.site.register(HotelBooking)