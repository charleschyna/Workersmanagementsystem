import os
import django
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from django.contrib.auth.models import User
from claims.models import TaskClaim
from claims.forms import TaskClaimForm

# Get users
employee = User.objects.get(username='employee')
manager = User.objects.get(username='manager')

# Clean up previous runs
TaskClaim.objects.all().delete()

print("--- Verifying Submission ---")
from io import BytesIO
from PIL import Image

# Create a valid image using PIL
img_io = BytesIO()
image = Image.new('RGB', (100, 100), color='red')
image.save(img_io, format='JPEG')
img_content = img_io.getvalue()

image = SimpleUploadedFile("test_image.jpg", img_content, content_type="image/jpeg")

# Submit a claim
form_data = {
    'platform': 'Outlier AI',
    'task_external_id': 'TASK-123',
    'time_spent_minutes': 60
}
file_data = {'screenshot': image}

form = TaskClaimForm(data=form_data, files=file_data)
if form.is_valid():
    claim = form.save(commit=False)
    claim.employee = employee
    claim.save()
    print("Claim submitted successfully.")
else:
    print("Claim submission failed:", form.errors)

print("\n--- Verifying Duplicate Prevention ---")
# Try to submit the same claim again
form2 = TaskClaimForm(data=form_data, files=file_data)
if not form2.is_valid():
    if 'This task has already been claimed.' in str(form2.errors):
        print("Duplicate prevention working: Error caught.")
    else:
        print("Duplicate prevention failed: Unexpected error:", form2.errors)
else:
    print("Duplicate prevention failed: Form is valid.")

print("\n--- Verifying Manager Approval ---")
claim = TaskClaim.objects.get(task_external_id='TASK-123')
print(f"Current status: {claim.status}")
claim.status = 'Approved'
claim.save()
print(f"New status: {claim.status}")

print("\n--- Verifying Payroll ---")
from django.db.models import Sum
approved_minutes = TaskClaim.objects.filter(employee=employee, status='Approved').aggregate(Sum('time_spent_minutes'))['time_spent_minutes__sum']
rate = 10 / 60
pay = approved_minutes * rate
print(f"Approved Minutes: {approved_minutes}")
print(f"Calculated Pay: ${pay:.2f}")

if pay == 10.0:
    print("Payroll calculation correct.")
else:
    print("Payroll calculation incorrect.")
