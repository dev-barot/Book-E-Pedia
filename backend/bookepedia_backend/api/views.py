import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TBL_Customer_Details, TBL_Category_Details


logger = logging.getLogger(__name__)


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

            categories = TBL_Category_Details.objects.all()

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