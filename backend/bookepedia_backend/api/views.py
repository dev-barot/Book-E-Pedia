import json
import os
import logging
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.core.mail import send_mail
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    TBL_Customer_Details,
    TBL_Category_Details,
    TBL_BookType,
    TBL_Product_Details,
    TBL_Employee_Details,
    TBL_Cart_Details,
    TBL_Payment,
    TBL_Order_Details,
    TBL_MasterOrder_Details,
    TBL_Feedback_Details,
    # TBL_PasswordResetToken
)
logger = logging.getLogger(__name__)
from django.http import FileResponse, HttpResponse
from django.conf import settings
import mimetypes
import cloudinary.uploader
from django.db.models import Sum
from django.db.models import Count
from django.views.static import serve
from django.http import Http404

import re
from django.http import HttpResponse, StreamingHttpResponse, Http404
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.utils.http import urlsafe_base64_decode
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import secrets  # For generating the secure token
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.cache import cache_page

def file_iterator(file_path, offset, length, chunk_size=8192):
    with open(file_path, 'rb') as f:
        f.seek(offset)
        remaining = length
        while remaining > 0:
            bytes_to_read = min(chunk_size, remaining)
            data = f.read(bytes_to_read)
            if not data:
                break
            remaining -= len(data)
            yield data

def serve_media(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)

    if not os.path.exists(file_path):
        return HttpResponse("File not found", status=404)

    content_type, _ = mimetypes.guess_type(file_path)
    if not content_type:
        content_type = 'application/octet-stream'

    statobj = os.stat(file_path)
    file_size = statobj.st_size
    range_header = request.META.get('HTTP_RANGE', '')

    if range_header:
        match = re.search(r'bytes=(\d+)-(\d*)', range_header)
        if match:
            start = int(match.group(1))
            end_match = match.group(2)
            end = int(end_match) if end_match else file_size - 1
            length = end - start + 1

            response = StreamingHttpResponse(
                file_iterator(file_path, start, length),
                status=206,
                content_type=content_type
            )
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Content-Length'] = str(length)
        else:
            response = HttpResponse(status=416)
            response['Content-Range'] = f'bytes */{file_size}'
    else:
        response = StreamingHttpResponse(
            file_iterator(file_path, 0, file_size),
            content_type=content_type
        )
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = str(file_size)

    # Disable frame options and add broad CORS just in case
    if "X-Frame-Options" in response:
        del response["X-Frame-Options"]
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Expose-Headers"] = "Accept-Ranges, Content-Range, Content-Encoding, Content-Length"

    return response

def to_bool(value):
    return str(value).lower() in ["true","1","yes"]
@csrf_exempt
def ping(request):
    return JsonResponse({"status": "awake", "time": datetime.now().isoformat()})

@csrf_exempt
def api_init(request):
    """
    Combined API to fetch categories and products in one go to reduce network roundtrips.
    """
    try:
        from .models import TBL_Category_Details, TBL_Product_Details
        
        # 1. Get Categories
        categories = TBL_Category_Details.objects.filter(IsActive='1')
        cat_data = []
        for cat in categories:
            img = ""
            try:
                img = cat.Category_Photo.url if cat.Category_Photo else ""
                if img and "cloudinary" in img and "f_auto" not in img:
                    img = img.replace("/upload/", "/upload/f_auto,q_auto/")
            except:
                pass
                
            cat_data.append({
                "id": cat.Category_ID,
                "name": cat.Category_Name,
                "description": cat.Category_Description,
                "image": img,
                "Category_Name": cat.Category_Name, 
                "Category_Photo": img,
                "IsActive": cat.IsActive
            })

        # 2. Get Products
        products = TBL_Product_Details.objects.filter(IsActive=True).order_by('-Product_ID')[:20]
        prod_data = []
        for p in products:
            cover = None
            try:
                cover = p.Cover_Photo.url if p.Cover_Photo else None
                if cover and "cloudinary" in cover and "f_auto" not in cover:
                    cover = cover.replace("/upload/", "/upload/f_auto,q_auto/")
            except:
                pass
                
            prod_data.append({
                "id": p.Product_ID,
                "name": p.Product_Name,
                "author": p.Author,
                "price": str(p.Product_Price),
                "cover_photo": cover,
                "is_active": p.IsActive
            })

        return JsonResponse({
            "categories": cat_data,
            "products": prod_data,
            "status": "success"
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)

@cache_page(60 * 5)  # Cache for 5 minutes
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
                "cover_photo": product.Cover_Photo.build_url(transformation=[{'quality': 'auto', 'fetch_format': 'auto'}]) if product.Cover_Photo else None,
                "back_photo": product.Back_Photo.build_url(transformation=[{'quality': 'auto', 'fetch_format': 'auto'}]) if product.Back_Photo else None,
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
            building = data.get('building')
            street = data.get('street')
            city = data.get('city')
            state = data.get('state')
            country = data.get('country')
            pincode = data.get('pincode')

            # ===== Required field validation =====
            if not all([fname, lname, email, number, pwd, pwd_confirm, gen, date_str]):
                return JsonResponse({'bool': False, 'msg': 'Mandatory fields (Name, Email, Number, Password, Gender, DOB) are required'})

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
                Building=building,
                Street=street,
                City=city,
                State=state,
                Country=country,
                Pincode=pincode,
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

# =========================
# Employee Login API
# =========================
@csrf_exempt
def employee_login(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'bool': False, 'msg': 'Empty request body'})

            data = json.loads(request.body.decode('utf-8'))

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'bool': False, 'msg': 'Email and password required'})

            employee = TBL_Employee_Details.objects.filter(email=email).first()

            if employee and employee.Password == password:
                return JsonResponse({
                    'bool': True,
                    'emp_id': employee.Emp_ID,
                    'emp_name': f"{employee.Fname} {employee.Lname}",
                    'emp_type': employee.Emp_Type
                })

            return JsonResponse({'bool': False, 'msg': 'Invalid email or password'})

        except json.JSONDecodeError:
            return JsonResponse({'bool': False, 'msg': 'Invalid JSON format'})

        except Exception as e:
            logger.error(f"Employee Login error: {str(e)}")
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

@cache_page(60 * 5)  # Cache for 5 minutes
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
                    image_url = category.Category_Photo.build_url(transformation=[{'quality': 'auto', 'fetch_format': 'auto'}])

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

# @csrf_exempt
# def get_book_types(request):
#     if request.method == "GET":
#         books = TBL_BookType.objects.all().values()

#         data = []
#         for book in books:
#             data.append({
#                 "id": book["Book_ID"],
#                 "name": book["Book_Name"],
#                 "physical": book["Physical_Book"],
#                 "audio": book["Audio_Book"],
#                 "ebook": book["E_Book"],
#                 "video": book["Video_Book"],
#                 "is_active": book["IsActive"]
#             })

#         return JsonResponse({"data": data}, safe=False)

@csrf_exempt
def get_book_types(request):
    if request.method == "GET":
        books = TBL_BookType.objects.all()

        data = []
        for book in books:
            data.append({
                "id": book.Book_ID,
                "name": book.Book_Name,
                "physical": book.Physical_Book,
                "audio": book.Audio_Book,
                "ebook": book.E_Book,
                "video": book.Video_Book,

                # 🔥 FILE URLS - Explicitly set resource_type for safe URL generation
                "audio_file": book.Audio_File.build_url(resource_type="video") if book.Audio_File else None,
                "video_file": book.Video_File.build_url(resource_type="video") if book.Video_File else None,
                "ebook_file": book.E_Book_File.build_url(resource_type="raw") if book.E_Book_File else None,

                "is_active": book.IsActive
            })

        return JsonResponse({"data": data})

@csrf_exempt
def add_book_type(request):
    if request.method == "POST":
        try:
            # 🔥 MANUAL CLOUDINARY UPLOADS
            audio_file = request.FILES.get("Audio_File")
            video_file = request.FILES.get("Video_File")
            ebook_file = request.FILES.get("E_Book_File")

            audio_upload = None
            if audio_file:
                audio_upload = cloudinary.uploader.upload(audio_file, resource_type="video")["public_id"]

            video_upload = None
            if video_file:
                video_upload = cloudinary.uploader.upload(video_file, resource_type="video")["public_id"]

            ebook_upload = None
            if ebook_file:
                ebook_upload = cloudinary.uploader.upload(ebook_file, resource_type="raw")["public_id"]

            book = TBL_BookType.objects.create(
                Book_Name=request.POST.get("Book_Name"),
                Physical_Book=request.POST.get("Physical_Book", "0"),
                Audio_Book=request.POST.get("Audio_Book", "0"),
                E_Book=request.POST.get("E_Book", "0"),
                Video_Book=request.POST.get("Video_Book", "0"),
                Audio_File=audio_upload,
                Video_File=video_upload,
                E_Book_File=ebook_upload,
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
            }, status=500)
# @csrf_exempt
# def update_book_type(request, id):
#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body)

#             book = TBL_BookType.objects.get(Book_ID=id)

#             book.Book_Name = data.get("name", book.Book_Name)
#             book.Physical_Book = data.get("physical", book.Physical_Book)
#             book.Audio_Book = data.get("audio", book.Audio_Book)
#             book.E_Book = data.get("ebook", book.E_Book)
#             book.Video_Book = data.get("video", book.Video_Book)

#             book.save()

#             return JsonResponse({
#                 "bool": True,
#                 "msg": "Book type updated successfully"
#             })

#         except Exception as e:
#             return JsonResponse({
#                 "bool": False,
#                 "msg": str(e)
#             })
@csrf_exempt
def update_book_type(request, id):
    if request.method in ["PUT", "POST"]:
        try:
            book = TBL_BookType.objects.get(Book_ID=id)

            book.Book_Name = request.POST.get("Book_Name", book.Book_Name)
            book.Physical_Book = request.POST.get("Physical_Book", book.Physical_Book)
            book.Audio_Book = request.POST.get("Audio_Book", book.Audio_Book)
            book.E_Book = request.POST.get("E_Book", book.E_Book)
            book.Video_Book = request.POST.get("Video_Book", book.Video_Book)

            if request.FILES.get("Audio_File"):
                audio_upload = cloudinary.uploader.upload(request.FILES.get("Audio_File"), resource_type="video")
                book.Audio_File = audio_upload["public_id"]

            if request.FILES.get("Video_File"):
                video_upload = cloudinary.uploader.upload(request.FILES.get("Video_File"), resource_type="video")
                book.Video_File = video_upload["public_id"]

            if request.FILES.get("E_Book_File"):
                ebook_upload = cloudinary.uploader.upload(request.FILES.get("E_Book_File"), resource_type="raw")
                book.E_Book_File = ebook_upload["public_id"]

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


@csrf_exempt
def update_product(request, id):
    if request.method in ["PUT", "POST"]:
        try:
            product = TBL_Product_Details.objects.get(Product_ID=id)

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
                "Emp_ID": emp.Emp_ID,
                "Emp_Type": emp.Emp_Type,
                "Fname": emp.Fname,
                "Lname": emp.Lname,
                "Gender": emp.Gender,
                "DOB": emp.DOB,
                "email": emp.email,
                "Password": emp.Password,
                "Phone_Number": emp.Phone_Number,
                "Address": emp.Address,
                "Salary": emp.Salary,
                "Designation": emp.Designation,
                "Emp_Photo": emp.Emp_Photo.url if emp.Emp_Photo else None,
                "IsActive": emp.IsActive,
            }
            for emp in employees
        ]

        return JsonResponse({"data": data}, safe=False)

    elif request.method == "POST":
        try:
            emp_id = request.POST.get("Emp_ID")
            if not emp_id:
                return JsonResponse({"bool": False, "msg": "Employee ID is required"}, status=400)
            
            if TBL_Employee_Details.objects.filter(Emp_ID=emp_id).exists():
                return JsonResponse({"bool": False, "msg": "Employee ID already exists"}, status=400)

            emp = TBL_Employee_Details.objects.create(
                Emp_ID=emp_id,
                Emp_Type=request.POST.get("Emp_Type", "0"),
                Fname=request.POST.get("Fname"),
                Lname=request.POST.get("Lname"),
                Gender=request.POST.get("Gender"),
                DOB=request.POST.get("DOB"),
                email=request.POST.get("email"),
                Password=request.POST.get("Password"),
                Phone_Number=request.POST.get("Phone_Number"),
                Address=request.POST.get("Address"),
                Salary=request.POST.get("Salary"),
                Designation=request.POST.get("Designation"),
                Emp_Photo=request.FILES.get("Emp_Photo"),
                IsActive=request.POST.get("IsActive", "1")
            )

            return JsonResponse({
                "bool": True,
                "msg": "Employee added successfully",
                "id": emp.Emp_ID
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

    return JsonResponse(
        {"bool": False, "msg": "Method not allowed"},
        status=405
    )

@csrf_exempt
def employee_detail(request, id):
    try:
        emp = TBL_Employee_Details.objects.get(Emp_ID=id)
    except TBL_Employee_Details.DoesNotExist:
        return JsonResponse({"bool": False, "msg": "Employee not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "Emp_ID": emp.Emp_ID,
            "Emp_Type": emp.Emp_Type,
            "Fname": emp.Fname,
            "Lname": emp.Lname,
            "Gender": emp.Gender,
            "DOB": emp.DOB,
            "email": emp.email,
            "Password": emp.Password,
            "Phone_Number": emp.Phone_Number,
            "Address": emp.Address,
            "Salary": emp.Salary,
            "Designation": emp.Designation,
            "Emp_Photo": emp.Emp_Photo.url if emp.Emp_Photo else None,
            "IsActive": emp.IsActive,
        })

    elif request.method == "POST":  # ✅ fixed
        try:
            emp.Emp_Type = request.POST.get("Emp_Type", emp.Emp_Type)
            emp.Fname = request.POST.get("Fname", emp.Fname)
            emp.Lname = request.POST.get("Lname", emp.Lname)
            emp.Gender = request.POST.get("Gender", emp.Gender)
            emp.DOB = request.POST.get("DOB", emp.DOB)
            emp.email = request.POST.get("email", emp.email)
            emp.Password = request.POST.get("Password", emp.Password)
            emp.Phone_Number = request.POST.get("Phone_Number", emp.Phone_Number)
            emp.Address = request.POST.get("Address", emp.Address)
            emp.Salary = request.POST.get("Salary", emp.Salary)
            emp.Designation = request.POST.get("Designation", emp.Designation)

            emp.IsActive = request.POST.get("IsActive", emp.IsActive)

            if "Emp_Photo" in request.FILES:
                emp.Emp_Photo = request.FILES.get("Emp_Photo")

            emp.save()
            return JsonResponse({"bool": True, "msg": "Employee updated successfully"})

        except Exception as e:
            return JsonResponse({"bool": False, "msg": str(e)}, status=500)

    elif request.method == "DELETE":
        emp.IsActive = '0'  # ✅ fixed
        emp.save()
        return JsonResponse({"bool": True, "msg": "Employee deleted successfully"})

    return JsonResponse({"bool": False, "msg": "Method not allowed"}, status=405)
@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            cust_id = data.get("cust_id")
            product_id = data.get("product_id")
            quantity = int(data.get("quantity", 1))

            if not cust_id or not product_id:
                return JsonResponse({
                    "bool": False,
                    "msg": "cust_id and product_id required"
                })

            customer = TBL_Customer_Details.objects.get(Cust_ID=cust_id)
            product = TBL_Product_Details.objects.get(Product_ID=product_id)

            # 🔥 CHECK IF ALREADY EXISTS
            cart_item = TBL_Cart_Details.objects.filter(
                Cust_ID=customer,
                Product_ID=product
            ).first()

            stock = product.Stock  # adjust field name if different

            new_quantity = quantity
            if cart_item:
                new_quantity = cart_item.Product_Quantity + quantity

            if new_quantity > stock:
                return JsonResponse({
                    "bool": False,
                    "msg": f"Only {stock} items available in stock"
                })

            # proceed
            if cart_item:
                cart_item.Product_Quantity = new_quantity
                cart_item.save()
                msg = "Cart updated"
            else:
                cart_item = TBL_Cart_Details.objects.create(
                    Cust_ID=customer,
                    Product_ID=product,
                    Product_Quantity=quantity,
                    Total_Amount=product.Product_Price * quantity
                )
                msg = "Added to cart"


            return JsonResponse({
                "bool": True,
                "msg": msg,
                "cart_id": cart_item.Cart_ID,
                "quantity": cart_item.Product_Quantity,
                "total": str(cart_item.Total_Amount)
            })

        except TBL_Product_Details.DoesNotExist:
            return JsonResponse({"bool": False, "msg": "Product not found"})

        except TBL_Customer_Details.DoesNotExist:
            return JsonResponse({"bool": False, "msg": "Customer not found"})

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
def get_cart(request, cust_id):
    if request.method == "GET":
        try:
            cart_items = TBL_Cart_Details.objects.filter(Cust_ID=cust_id)

            data = []
            for item in cart_items:
                data.append({
                    "cart_id": item.Cart_ID,
                    "product_id": item.Product_ID.Product_ID,
                    "product_name": item.Product_ID.Product_Name,
                    "price": str(item.Product_ID.Product_Price),
                    "quantity": item.Product_Quantity,
                    "total": str(item.Total_Amount),
                    "stock": item.Product_ID.Stock, 
                    "image": item.Product_ID.Cover_Photo.url if item.Product_ID.Cover_Photo else ""
                })

            return JsonResponse({
                "bool": True,
                "data": data
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

@csrf_exempt
def remove_from_cart(request, cart_id):
    if request.method == "DELETE":
        try:
            cart_item = TBL_Cart_Details.objects.get(Cart_ID=cart_id)
            cart_item.delete()

            return JsonResponse({
                "bool": True,
                "msg": "Item removed from cart"
            })

        except TBL_Cart_Details.DoesNotExist:
            return JsonResponse({
                "bool": False,
                "msg": "Cart item not found"
            }, status=404)

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
def update_cart_quantity(request, cart_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            quantity = int(data.get("quantity"))

            if quantity <= 0:
                return JsonResponse({
                    "bool": False,
                    "msg": "Quantity must be greater than 0"
                })

            cart_item = TBL_Cart_Details.objects.get(Cart_ID=cart_id)
            stock = cart_item.Product_ID.Stock  # ✅ correct

            if quantity > stock:
                return JsonResponse({
                    "bool": False,
                    "msg": f"Only {stock} items available"
                })

            cart_item.Product_Quantity = quantity
            cart_item.save()
            return JsonResponse({
                "bool": True,
                "msg": "Quantity updated",
                "quantity": cart_item.Product_Quantity,
                "total": str(cart_item.Total_Amount)
            })

        except TBL_Cart_Details.DoesNotExist:
            return JsonResponse({
                "bool": False,
                "msg": "Cart item not found"
            }, status=404)

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
def create_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            cust_id = data.get("cust_id")
            emp_id = data.get("emp_id", 1)

            if not cust_id:
                return JsonResponse({"bool": False, "msg": "cust_id required"})

            customer = TBL_Customer_Details.objects.get(Cust_ID=cust_id)
            employee = TBL_Employee_Details.objects.get(Emp_ID=emp_id)

            cart_items = TBL_Cart_Details.objects.filter(Cust_ID=customer)

            if not cart_items.exists():
                return JsonResponse({"bool": False, "msg": "Cart is empty"})

            total_amount = 0
            total_quantity = 0

            # Determine if any item is a physical book
            has_physical = False
            for item in cart_items:
                if item.Product_ID.Book_ID and (item.Product_ID.Book_ID.Physical_Book == '1' or item.Product_ID.Book_ID.Physical_Book == True):
                    has_physical = True
                    break

            initial_status = "Pending" if has_physical else "Completed"

            master_order = TBL_MasterOrder_Details.objects.create(
                Cust_ID=customer,
                Emp_ID=employee,
                T_Quantity=0,
                T_Amount=0,
                Order_Status=initial_status
            )

            for item in cart_items:
                product = item.Product_ID
                qty = item.Product_Quantity
                if qty > product.Stock:
                    return JsonResponse({
                        "bool": False,
                        "msg": f"{product.Product_Name} out of stock"
                    })
                product.Stock -= qty
                product.save()
                price = product.Product_Price
                amount = price * qty

                TBL_Order_Details.objects.create(
                    MasterOrder_ID=master_order,
                    Product_ID=product,
                    Product_Quantity=qty,
                    Product_Price=price,
                    T_amount=amount,
                    Confirmation='1'
                )

                total_amount += amount
                total_quantity += qty

            master_order.T_Amount = total_amount
            master_order.T_Quantity = total_quantity
            master_order.save()

            cart_items.delete()

            return JsonResponse({
                "bool": True,
                "msg": "Order created successfully",
                "order_id": master_order.MasterOrder_ID,
                "total_amount": str(total_amount)
            })

        except TBL_Customer_Details.DoesNotExist:
            return JsonResponse({"bool": False, "msg": "Customer not found"})

        except Exception as e:
            return JsonResponse({"bool": False, "msg": str(e)}, status=500)

    return JsonResponse({"bool": False, "msg": "Invalid request"}, status=405)

@csrf_exempt
def create_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get("order_id")

            order = TBL_MasterOrder_Details.objects.get(MasterOrder_ID=order_id)

            payment = TBL_Payment.objects.create(
                MasterOrder_ID=order,
                Payment_Mode="Razorpay-Test",
                Payment_Status='1'  # Direct success (test mode)
            )

            # ✅ Mark order as completed
            order.Order_Status = "Completed"
            order.save()

            return JsonResponse({
                "bool": True,
                "msg": "Payment successful",
                "payment_id": payment.Transaction_ID
            })

        except TBL_MasterOrder_Details.DoesNotExist:
            return JsonResponse({"bool": False, "msg": "Order not found"})

        except Exception as e:
            return JsonResponse({"bool": False, "msg": str(e)}, status=500)

    return JsonResponse({"bool": False, "msg": "Invalid request"}, status=405)

@csrf_exempt
def get_order_details(request, order_id):
    if request.method == "GET":
        try:
            order = TBL_MasterOrder_Details.objects.get(MasterOrder_ID=order_id)
            items = TBL_Order_Details.objects.filter(MasterOrder_ID=order)

            data = []

            for item in items:
                data.append({
                    "product_name": item.Product_ID.Product_Name,
                    "price": str(item.Product_Price),
                    "quantity": item.Product_Quantity,
                    "total": str(item.T_amount),
                    "image": item.Product_ID.Cover_Photo.url if item.Product_ID.Cover_Photo else ""
                })

            return JsonResponse({
                "bool": True,
                "order_id": order.MasterOrder_ID,
                "status": order.Order_Status,
                "total_amount": str(order.T_Amount),
                "items": data
            })

        except Exception as e:
            return JsonResponse({"bool": False, "msg": str(e)}, status=500)

@csrf_exempt
def get_customer_orders(request, cust_id):
    if request.method == "GET":
        try:
            orders = TBL_Order_Details.objects.filter(
                MasterOrder_ID__Cust_ID=cust_id
            ).select_related("Product_ID", "MasterOrder_ID")

            data = []

            for order in orders:
                product = order.Product_ID
                book_type = product.Book_ID

                data.append({
                    "Order_ID": order.Order_ID,
                    "MasterOrder_ID": order.MasterOrder_ID.MasterOrder_ID,
                    "Order_Status": order.MasterOrder_ID.Order_Status,
                    "Product_Quantity": order.Product_Quantity,
                    "Product_Price": str(order.Product_Price),
                    "T_amount": str(order.T_amount),

                    "product_details": {
                        "Product_ID": product.Product_ID,
                        "Product_Name": product.Product_Name,
                        "Author": product.Author,
                        "Cover_Photo": product.Cover_Photo.url if product.Cover_Photo else None,

                        "Book_Type_Details": {
                            "Physical_Book": book_type.Physical_Book,
                            "Audio_Book": book_type.Audio_Book,
                            "Video_Book": book_type.Video_Book,
                            "E_Book": book_type.E_Book,
                            "Audio_File": book_type.Audio_File.url if book_type.Audio_File else None,
                            "Video_File": book_type.Video_File.url if book_type.Video_File else None,
                            "E_Book_File": book_type.E_Book_File.url if book_type.E_Book_File else None,
                        }
                    }
                })

            return JsonResponse({
                "bool": True,
                "data": data
            })

        except Exception as e:
            return JsonResponse({
                "bool": False,
                "msg": str(e)
            }, status=500)

@csrf_exempt
def get_customer(request, cust_id):
    try:
        customer = TBL_Customer_Details.objects.get(Cust_ID=cust_id)

        if request.method == "GET":
            return JsonResponse({
                "Cust_ID": customer.Cust_ID,
                "Fname": customer.Fname,
                "Lname": customer.Lname,
                "Email": customer.Email,
                "Gender": customer.Gender,
                "DOB": customer.DOB.strftime('%Y-%m-%d') if customer.DOB else "",
                "Phone_Number": customer.Phone_Number,
                "Building": customer.Building,
                "Street": customer.Street,
                "City": customer.City,
                "State": customer.State,
                "Country": customer.Country,
                "Pincode": customer.Pincode,
            })
        
        elif request.method in ["PUT", "POST"]:
            import json
            data = json.loads(request.body.decode('utf-8'))
            customer.Fname = data.get("Fname", customer.Fname)
            customer.Lname = data.get("Lname", customer.Lname)
            customer.Gender = data.get("Gender", customer.Gender)
            
            # Email, DOB, and Phone_Number are kept constant from registration
            
            customer.Building = data.get("Building", customer.Building)
            customer.Street = data.get("Street", customer.Street)
            customer.City = data.get("City", customer.City)
            customer.State = data.get("State", customer.State)
            customer.Country = data.get("Country", customer.Country)
            customer.Pincode = data.get("Pincode", customer.Pincode)
            
            customer.save()
            return JsonResponse({"bool": True, "msg": "Profile updated successfully"})

    except TBL_Customer_Details.DoesNotExist:
        return JsonResponse({"msg": "Customer not found"}, status=404)
    except Exception as e:
        return JsonResponse({"msg": str(e)}, status=500)

@csrf_exempt
def get_all_orders(request):
    if request.method == "GET":
        try:
            orders = TBL_MasterOrder_Details.objects.all().order_by('-MasterOrder_ID')

            data = []
            for order in orders:
                # Check if this master order has any physical books
                has_physical = TBL_Order_Details.objects.filter(
                    MasterOrder_ID=order,
                    Product_ID__Book_ID__Physical_Book='1'
                ).exists()

                data.append({
                    "MasterOrder_ID": order.MasterOrder_ID,
                    "Cust_ID": order.Cust_ID_id,
                    "Emp_ID": order.Emp_ID_id,
                    "Order_DateTime": order.Order_DateTime,
                    "T_Quantity": order.T_Quantity,
                    "T_Amount": str(order.T_Amount),
                    "Order_Status": order.Order_Status,
                    "has_physical": has_physical
                })

            return JsonResponse({"orders": data})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def update_order_status(request, order_id):
    if request.method in ["PUT", "POST"]:   # 👈 FIX
        try:
            data = json.loads(request.body)

            order = TBL_MasterOrder_Details.objects.get(MasterOrder_ID=order_id)
            order.Order_Status = data.get("Order_Status", order.Order_Status)
            order.save()

            return JsonResponse({"msg": "Status updated"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)




from django.db.models import Sum
from django.http import JsonResponse

def get_trending_books(request):
    try:
        trending = (
            TBL_Order_Details.objects
            .values(
                "Product_ID__Product_ID",
                "Product_ID__Product_Name",
                "Product_ID__Cover_Photo"
            )
            .annotate(total_ordered=Sum("Product_Quantity"))
            .order_by("-total_ordered")[:5]
        )

        data = []
        for item in trending:
            image_path = item["Product_ID__Cover_Photo"]

            data.append({
                "product_id": item["Product_ID__Product_ID"],
                "name": item["Product_ID__Product_Name"],
                "image": f"/media/{image_path}" if image_path else None,
                "total": item["total_ordered"]
            })

        return JsonResponse({"books": data})

    except Exception as e:
        print("TRENDING ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)


def dashboard_counts(request):
    try:
        total_orders = TBL_MasterOrder_Details.objects.count()
        completed_orders = TBL_MasterOrder_Details.objects.filter(Order_Status="Completed").count()

        total_sales = sum([o.T_Amount for o in TBL_MasterOrder_Details.objects.all()])

        fulfillment_rate = int((completed_orders / total_orders) * 100) if total_orders else 0

        return JsonResponse({
            "total_customers": TBL_Customer_Details.objects.count(),
            "total_products": TBL_Product_Details.objects.count(),
            "total_categories": TBL_Category_Details.objects.count(),
            "total_orders": total_orders,
            "total_sales": total_sales,
            "completed_orders": completed_orders,
            "fulfillment_rate": fulfillment_rate
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_low_stock_products(request):
    try:
        low_stock = TBL_Product_Details.objects.filter(Stock__lt=10)

        data = [
            {
                "id": p.Product_ID,
                "name": p.Product_Name,
                "stock": p.Stock,
                "image": f"/media/{p.Cover_Photo}" if p.Cover_Photo else None
            }
            for p in low_stock
        ]

        return JsonResponse({"products": data})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def get_feedbacks(request):
    try:
        product_id = request.GET.get("product_id")

        feedbacks = TBL_Feedback_Details.objects.filter(IsActive='1')

        if product_id:
            feedbacks = feedbacks.filter(Product_ID_id=product_id)  # 👈 THIS LINE SAVES YOU

        feedbacks = feedbacks.order_by('-Feedback_DateTime')[:3]

        data = []
        for fb in feedbacks:
            data.append({
                "Feedback_ID": fb.Feedback_ID,
                "Product_ID": fb.Product_ID_id,
                "Cust_ID": fb.Cust_ID_id,
                "rating": fb.Rating,
                "Description": fb.Description,
                "Feedback_DateTime": fb.Feedback_DateTime.strftime("%Y-%m-%d %H:%M:%S"),
                "customer_name": f"{fb.Cust_ID.Fname} {fb.Cust_ID.Lname}" if fb.Cust_ID else "Unknown"
            })

        return JsonResponse({"data": data})

    except Exception as e:
        print("🔥 FEEDBACK ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_feedback(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            cust_id = data.get("cust_id")
            product_id = data.get("product_id")
            description = data.get("description")
            rating = data.get("rating", 0)

            if not all([cust_id, product_id, description]):
                return JsonResponse({"error": "Missing fields"}, status=400)

            # 🔒 CHECK: has user purchased this product?
            has_purchased = TBL_Order_Details.objects.filter(
                MasterOrder_ID__Cust_ID=cust_id,
                Product_ID=product_id
            ).exists()

            if not has_purchased:
                return JsonResponse({
                    "error": "You can only review purchased products"
                }, status=403)

            feedback = TBL_Feedback_Details.objects.create(
                Cust_ID_id=cust_id,
                Product_ID_id=product_id,
                Description=description,
                Rating=rating,
                IsActive='1'
            )

            return JsonResponse({
                "msg": "Feedback added",
                "id": feedback.Feedback_ID
            })

        except Exception as e:
            print("FEEDBACK CREATE ERROR:", str(e))
            return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def soft_delete_feedback(request, feedback_id):
    if request.method == "PUT":
        try:
            feedback = TBL_Feedback_Details.objects.get(Feedback_ID=feedback_id)
            feedback.IsActive = '0'
            feedback.save()

            return JsonResponse({"msg": "Feedback archived successfully"})

        except TBL_Feedback_Details.DoesNotExist:
            return JsonResponse({"error": "Feedback not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_all_customers(request):
    if request.method == "GET":
        try:
            customers = TBL_Customer_Details.objects.all()

            data = []
            for c in customers:
                data.append({
                    "Cust_ID": c.Cust_ID,
                    "Fname": c.Fname,
                    "Lname": c.Lname,
                    "Email": c.Email,
                    "Gender": c.Gender,
                    "Phone_Number": c.Phone_Number,
                    "Building": c.Building,
                    "Street": c.Street,
                    "City": c.City,
                    "State": c.State,
                    "Country": c.Country,
                    "Pincode": c.Pincode,
                    "IsActive": getattr(c, "IsActive", "1")
                })

            return JsonResponse({"data": data})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def deactivate_customer(request, cust_id):
    if request.method == "PUT":
        try:
            customer = TBL_Customer_Details.objects.get(Cust_ID=cust_id)
            customer.IsActive = '0'   # soft delete
            customer.save()

            return JsonResponse({"msg": "Customer deactivated"})

        except TBL_Customer_Details.DoesNotExist:
            return JsonResponse({"error": "Customer not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

from django.utils.dateparse import parse_date

@csrf_exempt
def get_report_data(request, report_type):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)
        
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    start = parse_date(start_date) if start_date else None
    end = parse_date(end_date) if end_date else None

    def filter_by_date(queryset, date_field):
        if start and end:
            return queryset.filter(**{f"{date_field}__range": (start, end)})
        elif start:
            return queryset.filter(**{f"{date_field}__gte": start})
        elif end:
            return queryset.filter(**{f"{date_field}__lte": end})
        return queryset

    try:
        if report_type == "customer":
            customers = TBL_Customer_Details.objects.values(
                'Cust_ID', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 
                'Phone_Number', 'City', 'State', 'Country', 'IsActive'
            )
            return JsonResponse(list(customers), safe=False)

        elif report_type == "order":
            from .models import TBL_Order_Details
            orders = TBL_Order_Details.objects.select_related(
                'MasterOrder_ID', 'Product_ID', 'MasterOrder_ID__Cust_ID'
            )
            
            orders = filter_by_date(orders, "MasterOrder_ID__Order_DateTime")

            orders_list = orders.values(
                'Order_ID',
                'MasterOrder_ID',
                'MasterOrder_ID__Order_DateTime',
                'MasterOrder_ID__Order_Status',
                'MasterOrder_ID__Cust_ID__Fname',
                'MasterOrder_ID__Cust_ID__Lname',
                'Product_ID__Product_Name',
                'Product_Price',
                'Product_Quantity',
                'T_amount'
            )

            # Format datetime
            formatted_orders = list(orders_list)
            for o in formatted_orders:
                if isinstance(o['MasterOrder_ID__Order_DateTime'], datetime):
                    o['MasterOrder_ID__Order_DateTime'] = o['MasterOrder_ID__Order_DateTime'].strftime("%Y-%m-%d %H:%M:%S")

            return JsonResponse(formatted_orders, safe=False)

        elif report_type == "payment":
            payments = TBL_Payment.objects.select_related(
                'MasterOrder_ID', 'MasterOrder_ID__Cust_ID'
            )

            payments = filter_by_date(payments, "Payment_Date")

            payments_list = payments.values(
                'Transaction_ID',
                'MasterOrder_ID',
                'MasterOrder_ID__Cust_ID__Fname',
                'MasterOrder_ID__Cust_ID__Lname',
                'Payment_Status',
                'Payment_Mode',
                'Payment_Date'
            )
            
            formatted_payments = list(payments_list)
            for p in formatted_payments:
                if isinstance(p['Payment_Date'], datetime):
                    p['Payment_Date'] = p['Payment_Date'].strftime("%Y-%m-%d %H:%M:%S")

            return JsonResponse(formatted_payments, safe=False)

        elif report_type == "product":
            products = TBL_Product_Details.objects.select_related('Category_ID', 'Book_ID').values(
                'Product_ID', 'Product_Name', 'Category_ID__Category_Name', 
                'Book_ID__Book_Name', 'Product_Price', 'Stock', 'IsActive'
            )
            return JsonResponse(list(products), safe=False)

        elif report_type == "category":
            categories = TBL_Category_Details.objects.values(
                'Category_ID', 'Category_Name', 'Category_Description', 'IsActive'
            )
            return JsonResponse(list(categories), safe=False)

        return JsonResponse({"error": "Invalid report type"}, status=400)
    except Exception as e:
        logger.error(f"Report Error: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

from email.mime.text import MIMEText
import base64
from urllib.parse import quote
from django.core.mail import get_connection
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from urllib.parse import quote

import secrets
from django.core.cache import cache

# @csrf_exempt
# def forgot_password_request(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body.decode('utf-8'))
#             email = data.get('email')

#             if not email:
#                 return JsonResponse({'bool': False, 'msg': 'Email is required'}, status=400)

#             try:
#                 customer = TBL_Customer_Details.objects.get(Email=email)
#             except TBL_Customer_Details.DoesNotExist:
#                 # Return OK to prevent email enumeration
#                 return JsonResponse({"bool": True, "msg": "If an account exists, a reset link has been sent."})

#             # ✅ Simple URL-safe random token — no = or % characters at all
#             token = secrets.token_urlsafe(32)

#             # ✅ Store token → email mapping for 1 hour using Django cache
#             cache.set(f"pwd_reset_{token}", email, timeout=3600)

#             reset_url = f"http://localhost:3000/customer/reset-password/?token={token}&email={email}"

#             email_subject = "Password Reset Request - Book E-Pedia"
#             email_body = (
#                 f"Hi {customer.Fname},\n\n"
#                 f"Click the link below to reset your password:\n\n"
#                 f"{reset_url}\n\n"
#                 f"This link expires in 1 hour.\n"
#             )

#             try:
#                 email_obj = EmailMessage(
#                     email_subject,
#                     email_body,
#                     settings.DEFAULT_FROM_EMAIL,
#                     [customer.Email],
#                 )
#                 email_obj.send()
#                 logger.info(f"Reset link sent to {email}")
#                 return JsonResponse({"bool": True, "msg": "If an account exists, a reset link has been sent."})
#             except Exception as e:
#                 logger.error(f"Email send failed: {str(e)}")
#                 return JsonResponse({'bool': False, 'msg': 'Failed to send email.'}, status=500)

#         except json.JSONDecodeError:
#             return JsonResponse({'bool': False, 'msg': 'Invalid JSON format'}, status=400)
#         except Exception as e:
#             logger.error(f"Forgot password error: {str(e)}")
#             return JsonResponse({'bool': False, 'msg': 'An internal error occurred.'}, status=500)

#     return JsonResponse({'bool': False, 'msg': 'Invalid method'}, status=405)


# from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
# from django.utils.http import urlsafe_base64_decode
# import base64

# @csrf_exempt
# def reset_password_confirm(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body.decode('utf-8'))
#             token = data.get('token')
#             password = data.get('password')

#             if not token or not password:
#                 return JsonResponse({'bool': False, 'msg': 'Token and password are required'}, status=400)

#             # ✅ Look up email from cache using token
#             email = cache.get(f"pwd_reset_{token}")

#             if not email:
#                 return JsonResponse({'bool': False, 'msg': 'Invalid or expired token'}, status=400)

#             try:
#                 customer = TBL_Customer_Details.objects.get(Email=email)
#                 customer.Password = password
#                 customer.save()

#                 # ✅ Delete token so it can't be reused
#                 cache.delete(f"pwd_reset_{token}")

#                 return JsonResponse({'bool': True, 'msg': 'Password updated successfully'})

#             except TBL_Customer_Details.DoesNotExist:
#                 return JsonResponse({'bool': False, 'msg': 'User not found'}, status=404)

#         except Exception as e:
#             print("RESET ERROR:", str(e))
#             return JsonResponse({'bool': False, 'msg': 'Internal error'}, status=500)

#     return JsonResponse({'bool': False, 'msg': 'Invalid method'}, status=405)

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import TBL_Customer_Details #TBL_PasswordResetToken
from django.db import ProgrammingError, OperationalError

@api_view(['POST'])
def forgot_password_request(request):
    email = request.data.get('email')

    if not email:
        return Response(
            {'bool': False, 'msg': 'Email is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        customer = TBL_Customer_Details.objects.filter(Email=email).first()

        if customer:
            token  = secrets.token_urlsafe(16)

            # TBL_PasswordResetToken.objects.create(
            #     customer=customer,
            #     key=token_key,
            #     ip_address=request.META.get('REMOTE_ADDR'),
            #     user_agent=request.META.get('HTTP_USER_AGENT')
            # )

            reset_link = f"{settings.FRONTEND_BASE_URL}/customer/reset-password?email={email}&token={token}"

            send_mail(
                "Password Reset - Book E-Pedia",
                f"Hi {customer.Fname},\n\nReset your password:\n{reset_link}",
                settings.DEFAULT_FROM_EMAIL,
                [email]
            )

        return Response({
            'bool': True,
            'msg': 'If account exists, reset link sent'
        })

    except Exception as e:
        return Response(
            {'bool': False, 'msg': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def reset_password_confirm(request):
    email = request.data.get('email')
    new_password = request.data.get('password')

    if not email or not new_password:
        return Response(
            {'bool': False, 'msg': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        customer = TBL_Customer_Details.objects.filter(Email=email).first()

        if not customer:
            return Response(
                {'bool': False, 'msg': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        customer.Password = new_password
        customer.save()

        return Response({
            'bool': True,
            'msg': 'Password updated successfully'
        })

    except Exception as e:
        return Response(
            {'bool': False, 'msg': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def employee_forgot_password_request(request):
    email = request.data.get('email')

    if not email:
        return Response(
            {'bool': False, 'msg': 'Email is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        employee = TBL_Employee_Details.objects.filter(email=email).first()

        if employee:
            import secrets
            token  = secrets.token_urlsafe(16)

            reset_link = f"{settings.FRONTEND_BASE_URL}/employee/reset-password?email={email}&token={token}"

            send_mail(
                "Employee Password Reset - Book E-Pedia",
                f"Hi {employee.Fname},\n\nReset your password:\n{reset_link}",
                settings.DEFAULT_FROM_EMAIL,
                [email]
            )

        return Response({
            'bool': True,
            'msg': 'If account exists, reset link sent'
        })

    except Exception as e:
        return Response(
            {'bool': False, 'msg': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def employee_reset_password_confirm(request):
    email = request.data.get('email')
    new_password = request.data.get('password')

    if not email or not new_password:
        return Response(
            {'bool': False, 'msg': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        employee = TBL_Employee_Details.objects.filter(email=email).first()

        if not employee:
            return Response(
                {'bool': False, 'msg': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        employee.Password = new_password
        employee.save()

        return Response({
            'bool': True,
            'msg': 'Password updated successfully'
        })

    except Exception as e:
        return Response(
            {'bool': False, 'msg': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def contact_us(request):
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return Response(
                {'bool': False, 'msg': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email_message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        
        send_mail(
            subject=f"Contact Us: {subject}",
            message=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['bookepedia.business@gmail.com'],
            fail_silently=False,
        )

        return Response({
            'bool': True,
            'msg': 'Message sent successfully'
        })

    except Exception as e:
        logger.error(f"Contact Us email error: {str(e)}")
        return Response(
            {'bool': False, 'msg': 'Failed to send message'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
