from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('submit/', views.submit_claim, name='submit_claim'),
    path('dashboard/', views.manager_dashboard, name='manager_dashboard'),
    path('approve/<int:claim_id>/', views.approve_claim, name='approve_claim'),
    path('reject/<int:claim_id>/', views.reject_claim, name='reject_claim'),
    path('payroll/', views.payroll_summary, name='payroll_summary'),
    path('add-employee/', views.add_employee, name='add_employee'),
    path('manager/assign-account/', views.assign_account, name='assign_account'),
    path('accept-account/<int:account_id>/', views.accept_account, name='accept_account'),
    path('pause-account/<int:account_id>/', views.pause_account, name='pause_account'),
    path('leave-account/<int:account_id>/', views.leave_account, name='leave_account'),
    path('history/<int:employee_id>/', views.employee_history, name='employee_history'),
]
