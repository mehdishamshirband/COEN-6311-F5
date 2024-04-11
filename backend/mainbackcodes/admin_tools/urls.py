# admin_tools/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('make-admin/<int:user_id>/', views.make_user_admin, name='make-admin'),
]
