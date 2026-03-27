import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TBL_Customer_Details

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