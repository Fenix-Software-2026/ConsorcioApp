from django.db import models

class Movimiento(models.Model):
    tipo = models.CharField(max_length=10)
    monto = models.FloatField()
    descripcion = models.TextField()

    def __str__(self):
        return f"{self.tipo} - {self.monto}"
class PruebaConexionSQL(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name