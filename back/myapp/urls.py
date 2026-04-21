from django.urls import path
from .views import TestView, MovimientoView, prueba_conexion_sql

urlpatterns = [
    path('test/', TestView.as_view()),
    path('movimientos/', MovimientoView.as_view()),
    path('sql/', prueba_conexion_sql),
]
