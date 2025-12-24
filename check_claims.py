import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from claims.models import TaskClaim

pending_claims = TaskClaim.objects.filter(status='Pending')
print(f"Pending Claims Count: {pending_claims.count()}")
for claim in pending_claims:
    print(f"- {claim.employee.username}: {claim.platform} (ID: {claim.task_external_id})")
