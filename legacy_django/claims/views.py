from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import TaskClaim
from .forms import TaskClaimForm, EmployeeCreationForm

def is_manager(user):
    return user.is_superuser

def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.user.is_superuser:
        return redirect('manager_dashboard')
    return redirect('submit_claim')

@login_required
def submit_claim(request):
    if request.method == 'POST':
        form = TaskClaimForm(request.POST, request.FILES, user=request.user)
        if form.is_valid():
            claim = form.save(commit=False)
            claim.employee = request.user
            claim.save()
            messages.success(request, 'Task submitted successfully!')
            return redirect('submit_claim')
        else:
            print(form.errors)
    else:
        form = TaskClaimForm(user=request.user)
    return render(request, 'claims/submit_claim.html', {'form': form})

@user_passes_test(is_manager)
def manager_dashboard(request):
    # Group pending claims by employee
    pending_claims = TaskClaim.objects.filter(status='Pending').order_by('employee__username', '-submitted_at')
    
    grouped_claims = {}
    for claim in pending_claims:
        if claim.employee not in grouped_claims:
            grouped_claims[claim.employee] = []
        grouped_claims[claim.employee].append(claim)
    
    # Get all employees for history selection
    all_employees = User.objects.filter(is_superuser=False).order_by('username')

    # Get all assigned accounts
    # Get all assigned accounts
    all_accounts = WorkAccount.objects.all().order_by('-assigned_at')
    
    # Get accounts with status changes for notifications
    paused_accounts = WorkAccount.objects.filter(status='Paused').order_by('-assigned_at')
    left_accounts = WorkAccount.objects.filter(status='Left').order_by('-assigned_at')
    unpaused_accounts = WorkAccount.objects.filter(recently_unpaused=True).order_by('-assigned_at')
    
    return render(request, 'claims/manager_dashboard.html', {
        'grouped_claims': grouped_claims,
        'all_employees': all_employees,
        'all_accounts': all_accounts,
        'paused_accounts': paused_accounts,
        'left_accounts': left_accounts
    })

@user_passes_test(is_manager)
def approve_claim(request, claim_id):
    claim = get_object_or_404(TaskClaim, id=claim_id)
    claim.status = 'Approved'
    claim.save()
    messages.success(request, f'Claim {claim.task_external_id} approved.')
    return redirect('manager_dashboard')

@user_passes_test(is_manager)
def reject_claim(request, claim_id):
    claim = get_object_or_404(TaskClaim, id=claim_id)
    if request.method == 'POST':
        reason = request.POST.get('reason')
        claim.status = 'Rejected'
        claim.manager_notes = reason
        claim.save()
        messages.warning(request, f'Claim {claim.task_external_id} rejected.')
        return redirect('manager_dashboard')
    return redirect('manager_dashboard')

@user_passes_test(is_manager)
def payroll_summary(request):
    if request.method == 'POST':
        employee_id = request.POST.get('mark_paid_employee')
        if employee_id:
            user = get_object_or_404(User, id=employee_id)
            # Mark all approved, unpaid claims for this user as paid
            updated_count = TaskClaim.objects.filter(
                employee=user, 
                status='Approved', 
                is_paid=False
            ).update(is_paid=True)
            messages.success(request, f'Marked {updated_count} claims as paid for {user.username}.')
            return redirect('payroll_summary')

    # Calculate total pay per employee for UNPAID approved claims
    RATE_PER_HOUR = 15
    
    summary = []
    # Get all employees who have approved but unpaid claims
    employees = set(TaskClaim.objects.filter(status='Approved', is_paid=False).values_list('employee', flat=True))
    
    for user_id in employees:
        user = User.objects.get(id=user_id)
        approved_hours = TaskClaim.objects.filter(
            employee=user, 
            status='Approved', 
            is_paid=False
        ).aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0
        
        total_pay = float(approved_hours) * RATE_PER_HOUR
        summary.append({
            'employee': user,
            'approved_hours': approved_hours,
            'total_pay': round(total_pay, 2)
        })
    
    return render(request, 'claims/payroll_summary.html', {'summary': summary})

@user_passes_test(is_manager)
def add_employee(request):
    if request.method == 'POST':
        form = EmployeeCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            # Generate random 5-character password
            import secrets
            import string
            alphabet = string.ascii_letters + string.digits
            password = ''.join(secrets.choice(alphabet) for i in range(5))
            user.set_password(password)
            user.save()
            messages.success(request, f'Employee account for {user.username} created. Password: {password}')
            return redirect('manager_dashboard')
    else:
        form = EmployeeCreationForm()
    return render(request, 'claims/add_employee.html', {'form': form})

from .models import WorkAccount
from .forms import WorkAccountForm

@user_passes_test(is_manager)
def assign_account(request):
    if request.method == 'POST':
        form = WorkAccountForm(request.POST)
        if form.is_valid():
            account = form.save()
            messages.success(request, f'Account "{account.account_name}" assigned to {account.employee.username if account.employee else "Unassigned"}.')
            return redirect('manager_dashboard')
    else:
        form = WorkAccountForm()
    
    return render(request, 'claims/assign_account.html', {'form': form})

@login_required
def accept_account(request, account_id):
    account = get_object_or_404(WorkAccount, id=account_id, employee=request.user)
    if request.method == 'POST':
        if account.status == 'Paused':
            account.recently_unpaused = True
        account.status = 'Accepted'
        account.save()
        messages.success(request, f'You have accepted the account: {account.account_name}')
    return redirect('submit_claim')

@login_required
def pause_account(request, account_id):
    account = get_object_or_404(WorkAccount, id=account_id, employee=request.user)
    if request.method == 'POST':
        account.status = 'Paused'
        account.save()
        messages.info(request, f'You have paused the account: {account.account_name}')
    return redirect('submit_claim')

@login_required
def leave_account(request, account_id):
    account = get_object_or_404(WorkAccount, id=account_id, employee=request.user)
    if request.method == 'POST':
        account.status = 'Left'
        account.save()
        messages.warning(request, f'You have left the account: {account.account_name}')
    return redirect('submit_claim')

@user_passes_test(is_manager)
def dismiss_unpause_notification(request, account_id):
    account = get_object_or_404(WorkAccount, id=account_id)
    if request.method == 'POST':
        account.recently_unpaused = False
        account.save()
        messages.success(request, f'Notification dismissed for {account.account_name}')
    return redirect('manager_dashboard')

from django.utils import timezone
from datetime import datetime

@user_passes_test(is_manager)
def employee_history(request, employee_id):
    employee = get_object_or_404(User, id=employee_id)
    
    # Get date from request or default to today
    date_str = request.GET.get('date')
    if date_str:
        try:
            selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            selected_date = timezone.now().date()
    else:
        selected_date = timezone.now().date()
        
    # Filter claims for that day
    claims = TaskClaim.objects.filter(
        employee=employee,
        submitted_at__date=selected_date
    ).order_by('-submitted_at')
    
    # Calculate totals
    total_hours = claims.aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0
    RATE_PER_HOUR = 15
    total_pay = float(total_hours) * RATE_PER_HOUR
    
    context = {
        'employee': employee,
        'claims': claims,
        'selected_date': selected_date,
        'total_hours': total_hours,
        'total_pay': round(total_pay, 2),
        'today': timezone.now().date(),
    }
    return render(request, 'claims/employee_history.html', context)
