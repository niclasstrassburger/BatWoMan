from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from django.http.response import JsonResponse, HttpResponseForbidden

from .models import *
from .serializers import *


class UserLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        groups = user.groups.all()
        group_names = [group.name for group in groups]
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'groups': group_names
        })
    
class UserRegister(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        print(request.data)
        if 'username' not in request.data or 'password' not in request.data:
            return HttpResponseForbidden("Username and password are required.")
            # return JsonResponse({'error': 'Username and password are required.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
        if User.objects.filter(username=request.data['username']).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)  
        
        # create user with request data username, password, and email
        user = User.objects.create_user(
            username=request.data['username'],
            password=request.data['password'],
            email=request.data['email'] if 'email' in request.data else '',
        )
        # serializer = self.serializer_class(data=request.data,
        #                                    context={'request': request})
        # serializer.is_valid(raise_exception=True)
        # user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        groups = user.groups.all()
        group_names = [group.name for group in groups]
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'groups': group_names
        })


class UserPreferencesView(APIView):
    model = UserPreferences
    serializer = UserPreferencesSerializer

    def get(self, request):
        objct, created = self.model.objects.get_or_create(user=request.user)
        serial = self.serializer(objct)
        return JsonResponse(serial.data, safe=False)

    def put(self, request):
        objct = self.model.objects.get(user=request.user)
        data = request.data

        serial = self.serializer(objct, data=data, partial=True)
        if serial.is_valid():
            serial.save()
            return JsonResponse(serial.data)
        return JsonResponse(serial.errors, status=status.HTTP_400_BAD_REQUEST)
