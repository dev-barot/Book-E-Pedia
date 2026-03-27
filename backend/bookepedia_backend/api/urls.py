from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='customer_login'),
    path('register/', views.customer_register, name='customer_register'),
]