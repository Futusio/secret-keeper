# Generated by Django 3.2 on 2021-04-26 15:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_alter_policy_storage_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='last_update',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
