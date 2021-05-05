from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms

from .models import Profile, Policy


class LoginForm(forms.Form):
    """ Login Form """
    username = forms.CharField(label='', widget=forms.TextInput(
        attrs={'placeholder': 'Введите логин', 'autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'placeholder': 'Введите пароль', 'autocomplete': 'new-password'}), label='')
    

class ProfileCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = Profile
        fields = ('username', 'first_name', 'last_name')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class ProfileChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    username = forms.CharField(disabled=True, help_text="Can't change field")
    password = ReadOnlyPasswordHashField(label= ("Password"),
            help_text= ("Raw passwords are not stored, so there is no way to see "
                    "this user's password, but you can change the password "
                    "using <a href=\"../password/\">this form</a>."))

    class Meta:
        model = Profile
        fields = ('password', 'first_name', 'last_name', 'job', 'is_active')


class PolicyCreationForm(forms.ModelForm):

    storage_time = forms.IntegerField(help_text='Specify storage time in days')
    status = forms.BooleanField(label='Active')

    class Meta:
        model = Policy
        fields = ('name', 'min_length', 'max_length', 'storage_time')