from django.db import models

class PruebaConexion(models.Model):
    mensaje = models.CharField(max_length=100)
    fecha = models.DateTimeField(auto_now_add=True)
