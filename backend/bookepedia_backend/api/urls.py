from django.urls import path
from .views import (
    category_list_create,
    category_detail,
    get_categories,
    add_category,
    customer_register,
    login_view,
    get_book_types,
    add_book_type,
    update_book_type,
    delete_book_type,
    get_products,
    add_product,
    update_product,
    delete_product,
    get_employees
)

urlpatterns = [
    path('register/', customer_register),
    path('login/', login_view),
    path('categories/', get_categories),
    path('add-category/', add_category),
    path('category/', category_list_create),
    path('category/<int:id>/', category_detail),
    path('book-types/', get_book_types),
    path('add-book-type/', add_book_type),
    path('book-types/<int:id>/', update_book_type),
    path('delete-book-type/<int:id>/', delete_book_type),
    path("products/", get_products),
    path("add-product/", add_product),
    path("products/<int:id>/", update_product),
    path("delete-product/<int:id>/", delete_product),
    path('employees/', get_employees, name='employees'),
]

