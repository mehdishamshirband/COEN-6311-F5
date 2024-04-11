# admin_tools/views.py

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, user_passes_test

@login_required
@user_passes_test(lambda u: u.is_superuser)
def make_user_admin(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return HttpResponse("User has been granted admin rights.", status=200)
    except User.DoesNotExist:
        return HttpResponse("User not found.", status=404)
