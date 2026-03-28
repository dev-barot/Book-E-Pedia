from django.urls import path
from .views import (
    category_list_create,
    category_detail,
    get_categories,
    add_category,
    customer_register,
    login_view
)

urlpatterns = [
    path('register/', customer_register),
    path('login/', login_view),

    path('categories/', get_categories),
    path('add-category/', add_category),

    path('category/', category_list_create),
    path('category/<int:id>/', category_detail),
]

