from django.urls import path

from . import views

urlpatterns = [
    # Main
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    # API
    path('api/new-group', views.new_group, name='new_group'),
    path('api/del-group', views.del_group, name='del_group'),
]