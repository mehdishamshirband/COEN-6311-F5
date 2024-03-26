from django.apps import AppConfig


class FlyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'flyapp'

    def ready(self):
        import flyapp.signals
