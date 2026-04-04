import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    TBL_Customer_Details,
    TBL_Category_Details,
    TBL_BookType,
    TBL_Product_Details,
    TBL_Employee_Details
)
logger = logging.getLogger(__name__)

def to_bool(value):
    return str(value).lower() in ["true","1","yes"]
@csrf_exempt
def get_products(request):
    # ======================
    # GET ALL PRODUCTS
    # ======================
    if request.method == "GET":
        products = TBL_Product_Details.objects.filter(IsActive=True)

        data = []
        for product in products:
            data.append({
                "id": product.Product_ID,
                "name": product.Product_Name,
                "author": product.Author,
                "publisher": product.Publisher,
                "language": getattr(product, "Language", ""),
                "pages": getattr(product, "Number_of_Pages", 0),
                "duration": str(getattr(product, "Time_Duration", 0)),
                "price": str(product.Product_Price),
                "stock": product.Stock,
                "description": product.Product_Description,
                "cover_photo": product.Cover_Photo.url if product.Cover_Photo else "",
                "back_photo": product.Back_Photo.url if hasattr(product, "Back_Photo") and product.Back_Photo else "",
                "category_id": product.Category_ID.Category_ID,
                "category_name": product.Category_ID.Category_Name,
                "book_id": product.Book_ID.Book_ID,
                "book_name": product.Book_ID.Book_Name,
                "emp_id": getattr(product, "Emp_ID_id", None),
                "is_active": product.IsActive
            })

        return JsonResponse({"data": data})

    # ======================
    # ADD PRODUCT
    # ======================
    elif request.method == "POST":
        try:
            category = TBL_Category_Details.objects.get(
                Category_ID=request.POST.get("Category_ID")
            )

            book_type = TBL_BookType.objects.get(
                Book_ID=request.POST.get("Book_ID")
            )

            employee = TBL_Employee_Details.objects.get(
                Emp_ID=request.POST.get("Emp_ID")
            )

            product = TBL_Product_Details.objects.create(
                Product_Name=request.POST.get("Product_Name"),
                Category_ID=category,
                Book_ID=book_type,
                Emp_ID=employee,
                Product_Description=request.POST.get("Product_Description"),
                Author=request.POST.get("Author"),
                Publisher=request.POST.get("Publisher"),
                Language=request.POST.get("Language"),
                Number_of_Pages=request.POST.get("Number_of_Pages") or 0,
                Time_Duration=request.POST.get("Time_Duration") or 0,
                Product_Price=request.POST.get("Product_Price"),
                Stock=request.POST.get("Stock"),
                Cover_Photo=request.FILES.get("Cover_Image"),
                Back_Photo=request.FILES.get("Back_Image"),
                IsActive=to_bool(request.POST.get("IsActive", True))
            )

            return JsonResponse({
                "bool": True,
                "msg": "Product added successfully",
                "id": product.Product_ID
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

    return JsonResponse({
        "bool": False,
        "msg": "Method not allowed"
    }, status=405)

# =========================
# Registration API
# =========================
@csrf_exempt
def customer_register(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'bool': False, 'msg': 'Empty request body'})

            data = json.loads(request.body.decode('utf-8'))

            fname = data.get('fname')
            lname = data.get('lname')
            email = data.get('email')
            number = data.get('number')
            pwd = data.get('pwd')
            pwd_confirm = data.get('pwd_confirm')
            gen = data.get('gen')
            date_str = data.get('date')

            # ===== Required field validation =====
            if not all([fname, lname, email, number, pwd, pwd_confirm, gen, date_str]):
                return JsonResponse({'bool': False, 'msg': 'All fields are required'})

            # ===== Password match =====
            if pwd != pwd_confirm:
                return JsonResponse({'bool': False, 'msg': 'Passwords do not match'})

            # ===== Date parsing =====
            try:
                date_of_birth = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'bool': False, 'msg': 'Invalid date format (YYYY-MM-DD required)'})

            # ===== Duplicate checks =====
            if TBL_Customer_Details.objects.filter(Email=email).exists():
                return JsonResponse({'bool': False, 'msg': 'Email already exists'})

            if TBL_Customer_Details.objects.filter(Phone_Number=number).exists():
                return JsonResponse({'bool': False, 'msg': 'Phone number already exists'})

            # ===== Create user =====
            customer = TBL_Customer_Details.objects.create(
                Fname=fname,
                Lname=lname,
                Gender=gen,
                DOB=date_of_birth,
                Email=email,
                Password=pwd,
                Phone_Number=number,
            )

            return JsonResponse({
                'bool': True,
                'user': customer.Cust_ID,
                'msg': 'Registration successful'
            })

        except json.JSONDecodeError:
            return JsonResponse({'bool': False, 'msg': 'Invalid JSON format'})

        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return JsonResponse({'bool': False, 'msg': 'Something went wrong'})

    return JsonResponse({'bool': False, 'msg': 'Invalid method'}, status=405)


# =========================
# Login API
# =========================
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'bool': False, 'msg': 'Empty request body'})

            data = json.loads(request.body.decode('utf-8'))

            email = data.get('email')
            password = data.get('password')

            # ===== Validation =====
            if not email or not password:
                return JsonResponse({'bool': False, 'msg': 'Email and password required'})

            customer = TBL_Customer_Details.objects.filter(Email=email).first()

            if customer and customer.Password == password:
                return JsonResponse({
                    'bool': True,
                    'user': customer.Fname,
                    'user_id': customer.Cust_ID
                })

            return JsonResponse({'bool': False, 'msg': 'Invalid email or password'})

        except json.JSONDecodeError:
            return JsonResponse({'bool': False, 'msg': 'Invalid JSON format'})

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return JsonResponse({'bool': False, 'msg': 'Something went wrong'})

    return JsonResponse({'bool': False, 'msg': 'Method not allowed'}, status=405)

@csrf_exempt
def add_category(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            image = request.FILES.get('image')

            if not name or not description or not image:
                return JsonResponse({"bool": False, "msg": "All fields required"})

            if TBL_Category_Details.objects.filter(Category_Name=name).exists():
                return JsonResponse({"bool": False, "msg": "Category already exists"})

            category = TBL_Category_Details.objects.create(
                Category_Name=name,
                Category_Description=description,
                Category_Photo=image,
                IsActive='1'
            )

            return JsonResponse({
                "bool": True,
                "msg": "Category added successfully",
                "id": category.Category_ID
            })

        except Exception as e:
            return JsonResponse({"bool": False, "msg": str(e)})

    return JsonResponse({"bool": False, "msg": "Invalid method"})

@csrf_exempt
def get_categories(request):
    if request.method == 'GET':
        try:
            from .models import TBL_Category_Details

            categories = TBL_Category_Details.objects.filter(IsActive='1')

            data = []
            for category in categories:
                image_url = ""
                if category.Category_Photo:
                    image_url = request.build_absolute_uri(
                        category.Category_Photo.url
                    )

                data.append({
                    "id": category.Category_ID,
                    "name": category.Category_Name,
                    "description": category.Category_Description,
                    "image": image_url,
                    "is_active": category.IsActive
                })

            return JsonResponse({
                "bool": True,
                "data": data
            })

        except Exception as e:
            logger.error(f"Category fetch error: {str(e)}")
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            })

    return JsonResponse({
        "bool": False,
        "msg": "Invalid method"
    }, status=405)

@csrf_exempt
def category_list_create(request):
    if request.method == 'GET':
        try:
            categories = TBL_Category_Details.objects.all()

            data = []
            for c in categories:
                data.append({
                    "Category_ID": c.Category_ID,
                    "Category_Name": c.Category_Name,
                    "Category_Description": c.Category_Description,
                    "Category_Photo": c.Category_Photo.url if c.Category_Photo else "",
                    "IsActive": c.IsActive
                })

            return JsonResponse({"data": data})

        except Exception as e:
            return JsonResponse({"msg": str(e)}, status=500)

    elif request.method == 'POST':
        try:
            name = request.POST.get('Category_Name')
            description = request.POST.get('Category_Description')
            is_active = request.POST.get('IsActive', '1')
            image = request.FILES.get('Category_Photo')

            category = TBL_Category_Details.objects.create(
                Category_Name=name,
                Category_Description=description,
                Category_Photo=image,
                IsActive=is_active
            )

            return JsonResponse({
                "msg": "Category created successfully",
                "id": category.Category_ID
            })

        except Exception as e:
            return JsonResponse({"msg": str(e)}, status=500)

    return JsonResponse({"msg": "Method not allowed"}, status=405)

@csrf_exempt
def category_detail(request, id):
    try:
        category = TBL_Category_Details.objects.get(Category_ID=id)

    except TBL_Category_Details.DoesNotExist:
        return JsonResponse({"msg": "Category not found"}, status=404)

    if request.method in ['PUT', 'POST']:
        try:
            name = request.POST.get('Category_Name')
            description = request.POST.get('Category_Description')
            is_active = request.POST.get('IsActive')

            if name:
                category.Category_Name = name

            if description:
                category.Category_Description = description

            if is_active:
                category.IsActive = is_active

            if 'Category_Photo' in request.FILES:
                category.Category_Photo = request.FILES['Category_Photo']

            category.save()

            return JsonResponse({"msg": "Category updated successfully"})

        except Exception as e:
            return JsonResponse({"msg": str(e)}, status=500)

    elif request.method == 'DELETE':
        category.delete()
        return JsonResponse({"msg": "Category deleted successfully"})

    return JsonResponse({"msg": "Method not allowed"}, status=405)

@csrf_exempt
def get_book_types(request):
    if request.method == "GET":
        books = TBL_BookType.objects.all().values()

        data = []
        for book in books:
            data.append({
                "id": book["Book_ID"],
                "name": book["Book_Name"],
                "physical": book["Physical_Book"],
                "audio": book["Audio_Book"],
                "ebook": book["E_Book"],
                "video": book["Video_Book"],
                "is_active": book["IsActive"]
            })

        return JsonResponse({"data": data}, safe=False)

@csrf_exempt
def add_book_type(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            book = TBL_BookType.objects.create(
                Book_Name=data.get("name"),
                Physical_Book=data.get("physical", "0"),
                Audio_Book=data.get("audio", "0"),
                E_Book=data.get("ebook", "0"),
                Video_Book=data.get("video", "0"),
                IsActive='1'
            )

            return JsonResponse({
                "bool": True,
                "msg": "Book type added successfully",
                "id": book.Book_ID
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            })

@csrf_exempt
def update_book_type(request, id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            book = TBL_BookType.objects.get(Book_ID=id)

            book.Book_Name = data.get("name", book.Book_Name)
            book.Physical_Book = data.get("physical", book.Physical_Book)
            book.Audio_Book = data.get("audio", book.Audio_Book)
            book.E_Book = data.get("ebook", book.E_Book)
            book.Video_Book = data.get("video", book.Video_Book)

            book.save()

            return JsonResponse({
                "bool": True,
                "msg": "Book type updated successfully"
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            })

@csrf_exempt
def delete_book_type(request, id):
    if request.method == "DELETE":
        try:
            book = TBL_BookType.objects.get(Book_ID=id)
            book.delete()

            return JsonResponse({
                "bool": True,
                "msg": "Book type deleted successfully"
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            })



@csrf_exempt
def add_product(request):
    if request.method == "POST":
        try:
            category = TBL_Category_Details.objects.get(
                Category_ID=request.POST.get("category_id")
            )

            book = TBL_BookType.objects.get(
                Book_ID=request.POST.get("book_id")
            )

            product = TBL_Product_Details.objects.create(
                Category_ID=category,
                Book_ID=book,
                Product_Name=request.POST.get("name"),
                Author=request.POST.get("author"),
                Publisher=request.POST.get("publisher"),
                Product_Price=request.POST.get("price"),
                Language=request.POST.get("language"),
                Number_of_Pages=request.POST.get("pages"),
                Time_Duration=request.POST.get("duration"),
                Back_Photo=request.FILES.get("back_photo"),
                Stock=request.POST.get("stock"),
                Product_Description=request.POST.get("description"),
                Cover_Photo=request.FILES.get("image"),
                IsActive=to_bool(request.POST.get("IsActive", True))
            )

            return JsonResponse({
                "bool": True,
                "msg": "Product added successfully",
                "id": product.Product_ID
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)
            
@csrf_exempt
def delete_product(request, id):
    if request.method == "DELETE":
        try:
            product = TBL_Product_Details.objects.get(Product_ID=id)

            # SOFT DELETE
            product.IsActive = False
            product.save()

            return JsonResponse({
                "bool": True,
                "msg": "Product deactivated successfully"
            })

        except TBL_Product_Details.DoesNotExist:
            return JsonResponse({
                "bool": False,
                "msg": "Product not found"
            }, status=404)

        except Exception as e:
            print("DELETE ERROR:", str(e))
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

    return JsonResponse({
        "bool": False,
        "msg": "Method not allowed"
    }, status=405)

# @csrf_exempt
# def update_product(request, id):
#     if request.method in ["PUT", "POST"]:
#         try:
#             product = TBL_Product_Details.objects.get(
#                 Product_ID=id
#             )

#             category_id = request.POST.get("category_id")
#             book_id = request.POST.get("book_id")

#             if category_id:
#                 product.Category_ID = TBL_Category_Details.objects.get(
#                     Category_ID=category_id
#                 )

#             if book_id:
#                 product.Book_ID = TBL_BookType.objects.get(
#                     Book_ID=book_id
#                 )

#             product.Product_Name = request.POST.get(
#                 "name",
#                 product.Product_Name
#             )

#             product.Author = request.POST.get(
#                 "author",
#                 product.Author
#             )

#             product.Publisher = request.POST.get(
#                 "publisher",
#                 product.Publisher
#             )

#             product.Product_Price = request.POST.get(
#                 "price",
#                 product.Product_Price
#             )

#             product.Stock = request.POST.get(
#                 "stock",
#                 product.Stock
#             )

#             product.Product_Description = request.POST.get(
#                 "description",
#                 product.Product_Description
#             )
#             product.Language = request.POST.get(
#                 "language",
#                 product.Language
#             )

#             product.Number_of_Pages = request.POST.get(
#                 "pages",
#                 product.Number_of_Pages
#             )

#             product.Time_Duration = request.POST.get(
#                 "duration",
#                 product.Time_Duration
#             )

#             if "back_photo" in request.FILES:
#                 product.Back_Photo = request.FILES["back_photo"]

#             if "image" in request.FILES:
#                 product.Cover_Photo = request.FILES["image"]

#             product.save()

#             return JsonResponse({
#                 "bool": True,
#                 "msg": "Product updated successfully"
#             })

#         except Exception as e:
#             return JsonResponse({
#                 "bool": False,
#                 "msg": str(e)
#             }, status=500)

@csrf_exempt
def update_product(request, id):
    if request.method in ["PUT", "POST"]:
        try:
            product = TBL_Product_Details.objects.get(Product_ID=id)

            # VERY IMPORTANT LINE
            data = request.POST if request.POST else request.FILES

            product.Product_Name = request.POST.get("Product_Name", product.Product_Name)

            if request.POST.get("Category_ID"):
                product.Category_ID = TBL_Category_Details.objects.get(
                    Category_ID=request.POST.get("Category_ID")
                )

            if request.POST.get("Book_ID"):
                product.Book_ID = TBL_BookType.objects.get(
                    Book_ID=request.POST.get("Book_ID")
                )

            if request.POST.get("Emp_ID"):
                product.Emp_ID = TBL_Employee_Details.objects.get(
                    Emp_ID=request.POST.get("Emp_ID")
                )

            product.Product_Description = request.POST.get("Product_Description", product.Product_Description)
            product.Author = request.POST.get("Author", product.Author)
            product.Publisher = request.POST.get("Publisher", product.Publisher)
            product.Language = request.POST.get("Language", product.Language)

            if request.POST.get("Number_of_Pages"):
                product.Number_of_Pages = request.POST.get("Number_of_Pages")

            if request.POST.get("Time_Duration"):
                product.Time_Duration = request.POST.get("Time_Duration")

            product.Product_Price = request.POST.get("Product_Price", product.Product_Price)
            product.Stock = request.POST.get("Stock", product.Stock)

            if "Cover_Image" in request.FILES:
                product.Cover_Photo = request.FILES["Cover_Image"]

            if "Back_Image" in request.FILES:
                product.Back_Photo = request.FILES["Back_Image"]

            if request.POST.get("IsActive") is not None:
                product.IsActive = to_bool(request.POST.get("IsActive"))

            product.save()

            return JsonResponse({
                "bool": True,
                "msg": "Product updated successfully"
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

    return JsonResponse({
        "bool": False,
        "msg": "Method not allowed"
    }, status=405)

@csrf_exempt
def get_employees(request):
    if request.method == "GET":
        employees = TBL_Employee_Details.objects.filter(IsActive='1')

        data = [
            {
                "id": emp.Emp_ID,
                "fname": emp.Fname,
                "lname": emp.Lname,
                "designation": emp.Designation,
                "email":emp.email,
                "phone":emp.Phone_Number
            }
            for emp in employees
        ]

        return JsonResponse({"data": data}, safe=False)

    return JsonResponse(
        {"bool": False, "msg": "Method not allowed"},
        status=405
    )
