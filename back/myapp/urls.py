from django.urls import path
from .views import TestView, MovimientoView

urlpatterns = [
    path('test/', TestView.as_view()),
    path('movimientos/', MovimientoView.as_view()),
]