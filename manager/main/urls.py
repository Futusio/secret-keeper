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
    path('api/get-accounts', views.get_accounts, name='get_accounts'),
    path('api/get-account', views.get_account, name='get_account'),
    path('api/add-account', views.add_account, name='add_account'),
    path('api/upd-account', views.upd_account, name='upd_account'),
    path('api/del-account', views.del_account, name='del_account'),
]