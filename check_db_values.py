
import os
import sys
import django

# Add the project directory to sys.path
sys.path.append('/home/cynaz/Desktop/Martin')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from claims.models import WorkAccount

print("Checking WorkAccount objects for ID 1 and 4...")
for account_id in [1, 4]:
    try:
        account = WorkAccount.objects.get(id=account_id)
        print(f"ID: {account.id}")
        print(f"Account Name (repr): {repr(account.account_name)}")
        print(f"Account Name (str): {account.account_name}")
    except WorkAccount.DoesNotExist:
        print(f"Account with ID {account_id} does not exist.")
