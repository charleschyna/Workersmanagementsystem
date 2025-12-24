import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from django.contrib.auth.models import User

# Create superuser
if not User.objects.filter(username='manager').exists():
    User.objects.create_superuser('manager', 'manager@example.com', 'password123')
    print("Superuser 'manager' created.")
else:
    print("Superuser 'manager' already exists.")

# Create employee
if not User.objects.filter(username='employee').exists():
    User.objects.create_user('employee', 'employee@example.com', 'password123')
    print("User 'employee' created.")
else:
    print("User 'employee' already exists.")
