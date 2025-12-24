import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from claims.models import WorkAccount

print("Checking WorkAccounts...")
for acc in WorkAccount.objects.all():
    print(f"ID: {acc.id}, Name: '{acc.account_name}', Status: {acc.status}")
    if "{{" in acc.account_name:
        print(f"!!! FOUND SUSPICIOUS NAME IN ID {acc.id} !!!")
