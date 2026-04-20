from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PruebaConexion
from .serializers import PruebaConexionSerializer

@api_view(['GET'])
def test_mysql(request):
    # Traemos todos los registros de la tabla
    registros = PruebaConexion.objects.all()
    # Los pasamos por el serializador (many=True porque es una lista)
    serializer = PruebaConexionSerializer(registros, many=True)
    
    return Response({
        "status": "Conexión Exitosa",
        "django_version": "6.0.4",
        "data": serializer.data
    })