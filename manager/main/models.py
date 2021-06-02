from datetime import datetime
from django.core.exceptions import FieldError, ValidationError

from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.db.models.fields import Field


class ProfileManager(BaseUserManager):
    def create_user(self, username, first_name=None, last_name=None, password=None, job=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            username=username,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class Profile(AbstractBaseUser):
    username = models.CharField(max_length=64, unique=True)
    passwod = models.CharField(max_length=256)
    first_name = models.CharField(max_length=64, blank=True, null=True)
    last_name = models.CharField(max_length=128, blank=True, null=True)
    job = models.CharField(max_length=128, blank=True, null=True)
    check_sum = models.CharField(max_length=256, blank=True, null=True)
    # Needed 
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = ProfileManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class Group(models.Model):
    """ The model contains foreign key to Profile and Name of the Group """
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=48)


class Account(models.Model):
    """ The model contains all data about user account
     A few fields are encrypted
    """
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    url = models.CharField(max_length=1024)
    login = models.CharField(max_length=128)
    password = models.CharField(max_length=256)
    description = models.TextField()
    last_update = models.DateTimeField(default=datetime.now)


class Policy(models.Model):
    """ The model define when the user will receive a notification
    with requirement to change its password and also sets min and max length
    """
    name = models.CharField(max_length=1024, verbose_name='Name')
    min_length = models.IntegerField(verbose_name='Minimal length')
    max_length = models.IntegerField(verbose_name='Maximum length')
    template = models.CharField(max_length=256, blank=True, null=True)
    storage_time = models.IntegerField(verbose_name='Storage time')
    status = models.BooleanField(verbose_name='Status', default=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        """ The conditions to save model """
        if self.available_activate():
            raise ValidationError('Only one policy can be active at a time')
        else:
            super().save(*args, **kwargs)  # Call the "real" save() method.

    def available_activate(self):
        if self.status == True and (Policy.exist_active() and self.id is not None):
            return True
        else: 
            return False

    @staticmethod
    def exist_active():
        return bool(Policy.objects.filter(status=True))
