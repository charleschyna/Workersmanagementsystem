from django.db import models
from django.contrib.auth.models import User

class TaskClaim(models.Model):
    PLATFORM_CHOICES = [
        ('Outlier AI', 'Outlier AI'),
        ('Handshake', 'Handshake'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='claims')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    account_name = models.CharField(max_length=100)
    task_external_id = models.CharField(max_length=255)
    screenshot = models.ImageField(upload_to='proofs/%Y/%m/')
    time_spent_hours = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    is_paid = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    manager_notes = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['platform', 'task_external_id'], name='unique_task_per_platform')
        ]
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.employee.username} - {self.platform} - {self.task_external_id}"

class WorkAccount(models.Model):
    BROWSER_CHOICES = [
        ('IX Browser', 'IX Browser'),
        ('GoLogin', 'GoLogin'),
        ('MoreLogin', 'MoreLogin'),
        ('Other', 'Other'),
    ]

    employee = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='assigned_accounts', null=True, blank=True)
    account_name = models.CharField(max_length=100)
    login_details = models.TextField()
    browser_type = models.CharField(max_length=50, choices=BROWSER_CHOICES)
    status = models.CharField(max_length=20, choices=[
        ('Assigned', 'Assigned'), 
        ('Accepted', 'Accepted'),
        ('Paused', 'Paused'),
        ('Left', 'Left')
    ], default='Assigned')
    recently_unpaused = models.BooleanField(default=False)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account_name} ({self.employee.username if self.employee else 'Unassigned'})"
