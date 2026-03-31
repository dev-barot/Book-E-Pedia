from django.db import models
from django.core.validators import EmailValidator, RegexValidator
import datetime

# Customer Details Model (Ported for Login/Registration only)
class TBL_Customer_Details(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Cust_ID = models.AutoField(primary_key=True)
    Fname = models.CharField(max_length=20, null=False)
    Lname = models.CharField(max_length=25, null=False)
    Gender = models.CharField(max_length=1, null=False, choices=GENDER_CHOICES)
    DOB = models.DateField(null=False)
    Email = models.EmailField(unique=True, null=False, validators=[EmailValidator(message="Invalid email format")])
    Password = models.CharField(max_length=255, null=False)
    Phone_Number = models.BigIntegerField(unique=True, null=False)
    Building = models.CharField(max_length=50, null=True, blank=True)
    Street = models.CharField(max_length=150, null=True, blank=True)
    City = models.CharField(max_length=30, null=True, blank=True)
    State = models.CharField(max_length=20, null=True, blank=True)
    Country = models.CharField(max_length=25, null=True, blank=True)
    Pincode = models.CharField(max_length=6, null=True, blank=True, validators=[RegexValidator(r'^\d{6}$', message="Pincode must be exactly 6 digits")])
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return f"{self.Cust_ID} : {self.Fname} {self.Lname}"

    def save(self, *args, **kwargs):
        # Validate age is 18+
        if self.DOB > (datetime.date.today() - datetime.timedelta(days=365*18)):
            raise ValueError("Customer must be at least 18 years old")
        # Validate phone number length
        if len(str(self.Phone_Number)) != 10:
            raise ValueError("Phone number must be 10 digits")
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'tbl_customer_details'  # exact DB table name
        managed = False



# ================= EMPLOYEE =================
def employee_profile_pic_path(instance, filename):
    return f"Employee_Images/{instance.Fname}_{instance.Lname}/{filename}"

class TBL_Employee_Details(models.Model):
    EMP_TYPE_CHOICES = [('1', 'Admin'), ('0', 'Staff')]
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Emp_ID = models.IntegerField(primary_key=True)
    Emp_Type = models.CharField(max_length=1, choices=EMP_TYPE_CHOICES, default='0')
    Fname = models.CharField(max_length=20)
    Lname = models.CharField(max_length=25)
    Gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    DOB = models.DateField()
    email = models.EmailField(unique=True, validators=[EmailValidator(message="Invalid email format")])
    Password = models.CharField(max_length=15)
    Phone_Number = models.BigIntegerField(unique=True)
    Address = models.CharField(max_length=250)
    Salary = models.DecimalField(max_digits=9, decimal_places=2)
    Designation = models.CharField(max_length=25)

    Emp_Photo = models.ImageField(upload_to=employee_profile_pic_path, null=True, blank=True)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return f"{self.Fname} {self.Lname}"

    class Meta:
        db_table = 'bookapp_tbl_employee_details'
        ordering = ['Emp_ID']


# ================= CATEGORY =================
def category_pic_path(instance, filename):
    return f"Category_Images/{instance.Category_Name}/{filename}"

class TBL_Category_Details(models.Model):
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Category_ID = models.AutoField(primary_key=True)
    Category_Name = models.CharField(max_length=25, unique=True)
    Category_Photo = models.ImageField(upload_to=category_pic_path)
    Category_Description = models.CharField(max_length=250)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return self.Category_Name

    class Meta:
        managed = False
        db_table = 'bookapp_tbl_category_details'


# ================= BOOK TYPE =================
class TBL_BookType(models.Model):
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Book_ID = models.AutoField(primary_key=True)
    Book_Name = models.CharField(max_length=250)

    Physical_Book = models.CharField(max_length=1, default='0')
    Audio_Book = models.CharField(max_length=1, default='0')
    E_Book = models.CharField(max_length=1, default='0')
    Video_Book = models.CharField(max_length=1, default='0')

    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return self.Book_Name

    class Meta:
        db_table = 'bookapp_tbl_booktype'
        ordering = ['Book_ID']


# ================= PRODUCT =================
def product_photo_path(instance, filename):
    return f"Product_Images/{instance.Product_Name}/{filename}"

class TBL_Product_Details(models.Model):
    Product_ID = models.AutoField(primary_key=True)

    Category_ID = models.ForeignKey(
        TBL_Category_Details,
        on_delete=models.CASCADE,
        db_column='Category_ID_id'
    )

    Book_ID = models.ForeignKey(
        TBL_BookType,
        on_delete=models.CASCADE,
        db_column='Book_ID_id'
    )

    Emp_ID = models.ForeignKey(
        TBL_Employee_Details,
        on_delete=models.CASCADE,
        db_column='Emp_ID_id'
    )

    Product_Name = models.CharField(max_length=255)
    Author = models.CharField(max_length=255)
    Publisher = models.CharField(max_length=255)

    Language = models.CharField(max_length=50, null=True, blank=True)
    Number_of_Pages = models.IntegerField(null=True, blank=True)
    Time_Duration = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    Product_Price = models.DecimalField(max_digits=10, decimal_places=2)
    Stock = models.IntegerField(default=0)

    Product_Description = models.TextField()

    Cover_Photo = models.ImageField(upload_to=product_photo_path, null=True, blank=True)
    Back_Photo = models.ImageField(upload_to=product_photo_path, null=True, blank=True)

    IsActive = models.BooleanField(default=True)

    def __str__(self):
        return self.Product_Name

    class Meta:
        db_table = 'bookapp_tbl_product'
        ordering = ['Product_ID']