from django.contrib import admin
from .models import Hotel,Flight,Activity,Package,Booking
# Register your model, Accessible in admin site
admin.site.register(Hotel)
admin.site.register(Flight)
admin.site.register(Activity)
admin.site.register(Package)
admin.site.register(Booking)