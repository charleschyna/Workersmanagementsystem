
import os
import sys
import django
from django.template import Context, Template

# Add the project directory to sys.path
sys.path.append('/home/cynaz/Desktop/Martin')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskledger.settings')
django.setup()

from django.contrib.auth.models import User
from claims.models import WorkAccount

# Create a dummy user and account if they don't exist
user, created = User.objects.get_or_create(username='testuser_verify', email='test_verify@example.com')
if created:
    user.set_password('password')
    user.save()

account, created = WorkAccount.objects.get_or_create(
    account_name='TestAccount123',
    defaults={
        'employee': user,
        'browser_type': 'GoLogin',
        'status': 'Paused',
        'login_details': 'test'
    }
)

# Render the template fragment with the SPLIT tag to see if it reproduces the error
template_string_split = """
{% for account in paused_accounts %}
    <strong>{{ account.employee.username }}</strong> has PAUSED the account <strong>{{
        account.account_name }}</strong> (ID: {{ account.id }})
{% endfor %}
"""

t = Template(template_string_split)
c = Context({'paused_accounts': [account]})
rendered = t.render(c)

print("Rendered output with SPLIT tag:")
print(rendered.strip())
