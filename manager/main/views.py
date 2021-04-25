from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt # Del after
from django.contrib.auth.decorators import login_required
from django.contrib import auth 

from .models import Group, Account
from .forms import LoginForm

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        groups = Group.objects.filter(user=request.user)
        return render(request, 'main/index.html', {'groups': groups})
    else:
        # Error
        print("NON NONON")
        form = LoginForm()
        return render(request, 'main/login.html', {'form': form})

# Authorizate
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = auth.authenticate(username=cd['username'], password=cd['password'])
            if user is not None:
                if user.is_active:
                    auth.login(request, user)
                    return redirect(index)
                else:
                    return HttpResponse('Disabled account')
            else:
                return HttpResponse('Invalid login')
    else:
        form = LoginForm()
    return HttpResponse('Invalid request')

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