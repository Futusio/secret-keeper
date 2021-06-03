from datetime import date, datetime

from django.db.models.query import RawQuerySet
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import auth 

from .models import Group, Account, Policy
from .forms import LoginForm


def get_old_accounts(request):
    policy = Policy.objects.filter(status=True)[0]
    accounts = Account.objects.filter(user=request.user)
    accounts = list(filter(lambda x: x.is_fresh(policy.storage_time), accounts))
    accounts = [{'id': x.id, 'days': x.get_days(policy.storage_time),'name': x.name} for x in accounts]
    return accounts

def get_policy(request):
    policy = Policy.objects.filter(status=True)[0]
    result = {
        'min': policy.min_length,
        'max': policy.max_length,
        'reg': policy.get_reg()
    }
    return result

def index(request):
    if request.user.is_authenticated:
        groups = Group.objects.filter(user=request.user)
        policy = Policy.objects.filter(status=True)[0]
        status = True if request.user.check_sum is not None else False
        accounts = get_old_accounts(request)
        return render(request, 'main/index.html', {'groups': groups, 'user': request.user, 'status': status,
                                                    'accounts': accounts, 'policy': get_policy(request)})
    else:
        form = LoginForm()
        return render(request, 'main/login.html', {'form': form})

# Authorizate
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            username = cd['username'].lower()
            user = auth.authenticate(username=username, password=cd['password'])
            if user is not None:
                if user.is_active:
                    auth.login(request, user)
                    return redirect(index)
                else:
                    return redirect(index)
        else:
            return redirect(index)
    else:
        return redirect(index)
    return redirect(index)

@login_required
def logout(request):
    if request.user.is_authenticated:
        auth.logout(request)
    return redirect(index)

# API
@login_required
def new_group(request):
    # TODO Add conditions later
    user = request.user
    name = request.POST['name']
    a = Group(user=user, name=name)
    a.save()
    return JsonResponse({'status': 'success', 'id': a.id})

@login_required
def del_group(request):
    # TODO Add conditions later
    id = request.POST['id']
    a = Group.objects.filter(id=id)
    a.delete()
    return JsonResponse({'status': 'success', 'id': id})

@login_required
def get_accounts(request):
    # Return All accounts of the group
    group = Group.objects.get(id=request.POST['group_id'])
    accounts = Account.objects.filter(group=group)
    result = {}
    for account in accounts:
        result.update({account.id: {
            'name': account.name,
            'description': account.get_description(),
        }})

    return JsonResponse({'status': 'success', 'accounts': result})

@login_required
def get_account(request):
    # Return all 
    account = Account.objects.get(id=request.POST['account_id'])
    result = {
        'name': account.name,
        'login': account.login,
        'password': account.password, 
        'url': account.url,
        'description': account.description
    }
    return JsonResponse({'status': 'success', 'account': result})

@login_required
def del_account(request):
    account = Account.objects.get(id=request.POST['account_id'])
    id = account.id
    account.delete()
    return JsonResponse({'status': 'success', 'id': id})


@login_required
def add_account(request):
    group = Group.objects.get(id=request.POST['group_id'])
    a = Account(
        user=request.user, group=group, 
        name=request.POST['name'], password=request.POST['password'],
        login=request.POST['login'], url=request.POST['url'], 
        description=request.POST['description']
        )
    a.save()
    result = {'id': a.id, 'name': a.name, 'description': a.get_description()}
    return JsonResponse({'status': 'success', 'account': result})

@login_required
def upd_account(request):
    data = request.POST
    a = Account.objects.get(id=data['account_id'])
    if not data['status']:
        a.last_update = datetime.now()
    a.name = data['name']
    a.login = data['login']
    a.password = data['password']
    a.url = data['url']
    a.description = data['description']
    a.save()
    result = {'id': a.id, 'name': a.name, 'description': a.get_description()}
    return JsonResponse({'status': 'success', 'account': result})

@login_required
def old_accounts(request):
    accounts = get_old_accounts(request)
    return JsonResponse({'status': 'success', 'accounts': accounts})

@login_required
def set_master(request):
    user = request.user
    master_key = request.POST['key']
    user.check_sum = master_key
    user.save()
    return JsonResponse({'status': 'success'})

@login_required
def check_master(request):
    user = request.user
    master_key = request.POST['key']
    if user.check_sum == master_key:
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error'})
