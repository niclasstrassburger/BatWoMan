from django.urls import path
from manufacturing import views


urlpatterns = [
    path('coating/', views.CoatingAPI.as_view(), name='coating'),
    path('calendering/', views.CalenderingAPI.as_view(), name='calendering'),
    path('dryingUDE/', views.DryingUDE.as_view(), name='dryingUDE'),
    path('wettingUDE/', views.WettingUDE.as_view(), name='wettingUDE'),
    path('performanceUDE/', views.UDEPerformance.as_view(), name='UDEPerformance'),
]