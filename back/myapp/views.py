from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Movimiento, PruebaConexionSQL
from django.http import JsonResponse

class TestView(APIView):
    def get(self, request):
        return Response({"mensaje": "Hola la API está funcionandooooooooo"})

class MovimientoView(APIView):
    def get(self, request):
        data = list(Movimiento.objects.values())
        return Response(data)
    
def home(request):
    return JsonResponse({"mensaje": "API ConsorcioApp funcionando"})

@api_view(['GET'])
def prueba_conexion_sql(request):
    count = PruebaConexionSQL.objects.count()
    return Response({"message": "Conexión OK", "registros": count})