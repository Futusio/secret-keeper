from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import auth 

from .forms import LoginForm

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request, 'main/index.html')
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