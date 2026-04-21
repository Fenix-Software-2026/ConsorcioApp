from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Movimiento
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