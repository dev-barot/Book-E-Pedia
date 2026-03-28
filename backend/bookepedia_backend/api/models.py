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


# Category Details Model
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