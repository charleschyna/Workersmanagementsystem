import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from django.contrib.auth.models import User

try:
    user = User.objects.get(username='charles')
    print("User 'charles' exists.")
except User.DoesNotExist:
    User.objects.create_user('charles', 'charles@example.com', 'password123')
    print("User 'charles' created with password 'password123'.")
