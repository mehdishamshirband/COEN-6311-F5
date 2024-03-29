"""
URL configuration for mainbackcodes project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from flyapp import views


router = routers.DefaultRouter()
router.register(r'Flight', views.Flights, basename='flights')
router.register(r'Hotel', views.Hotels, basename='hotels')
router.register(r'HotelBooking', views.HotelsBooking, basename='hotelsbooking')
router.register(r'Activity', views.Activities, basename='activities')
router.register(r'Packages', views.TravelPackages, basename='packages')
router.register(r'Booking', views.BookingDetail, basename='booking')
router.register(r'BillingDetail', views.BillingDetail, basename='billing')
router.register(r'PackagesModifications', views.PackagesModification, basename='packagesmodification')
router.register(r'Report', views.Reports, basename='report')
router.register(r'Notifs', views.Notifs, basename='notifs')
router.register(r'Photos', views.Photos, basename='photos')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('searchFlights/', views.searchFlights, name='searchFlights'),
]
urlpatterns += router.urls
