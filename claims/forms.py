from django import forms
from .models import TaskClaim
from django.contrib.auth.models import User

class TaskClaimForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(TaskClaimForm, self).__init__(*args, **kwargs)
        
        if user:
            # Get accounts assigned to this user
            # Filter for Accepted accounts ideally, but Assigned is okay too if they haven't clicked accept yet
            # Let's show all assigned accounts for now
            accounts = WorkAccount.objects.filter(employee=user)
            choices = [(acc.account_name, acc.account_name) for acc in accounts]
            if not choices:
                choices = [('', 'No accounts assigned')]
            
            self.fields['account_name'] = forms.ChoiceField(
                choices=choices,
                widget=forms.Select(attrs={'class': 'form-select'})
            )

    class Meta:
        model = TaskClaim
        fields = ['platform', 'account_name', 'task_external_id', 'screenshot', 'time_spent_hours']
        widgets = {
            'platform': forms.Select(attrs={'class': 'form-select'}),
            # account_name widget is handled in __init__
            'task_external_id': forms.TextInput(attrs={'class': 'form-control'}),
            'screenshot': forms.FileInput(attrs={'class': 'form-control'}),
            'time_spent_hours': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.1'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        platform = cleaned_data.get('platform')
        task_external_id = cleaned_data.get('task_external_id')

        if platform and task_external_id:
            if TaskClaim.objects.filter(platform=platform, task_external_id=task_external_id).exists():
                raise forms.ValidationError("This task has already been claimed.")
        
        return cleaned_data

from .models import TaskClaim, WorkAccount

class EmployeeCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
        }

class WorkAccountForm(forms.ModelForm):
    class Meta:
        model = WorkAccount
        fields = ['employee', 'account_name', 'login_details', 'browser_type']
        widgets = {
            'employee': forms.Select(attrs={'class': 'form-select'}),
            'account_name': forms.TextInput(attrs={'class': 'form-control'}),
            'login_details': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'browser_type': forms.Select(attrs={'class': 'form-select'}),
        }
