# -*- coding: utf-8 -*-
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.contrib import admin

from .forms import ProfileCreationForm, ProfileChangeForm, PolicyCreationForm
from .models import Profile, Policy


class UserAdmin(BaseUserAdmin):

    form = ProfileChangeForm
    add_form = ProfileCreationForm

    list_display = ('username', 'first_name', 'last_name', 'job')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'job')}),
        ('Activate', {'fields': ('is_active',)}),
    )

    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()


class PolicyAdmin(admin.ModelAdmin):

    form = PolicyCreationForm
    list_display = ['name', 'min_length', 'max_length', 'template','storage_time', 'status']

    # def get_form(self, request, obj=None, **kwargs):
    #     print("Hllo, bitch")
    #     defaults = {}
    #     if obj is None:
    #         defaults['form'] = PolicyCangeForm
    #     defaults.update(kwargs)
    #     return super().get_form(request, obj, **defaults)


admin.site.register(Profile, UserAdmin)
admin.site.register(Policy, PolicyAdmin)
admin.site.unregister(Group)