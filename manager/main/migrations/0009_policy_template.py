# Generated by Django 3.2 on 2021-05-20 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_alter_policy_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='template',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]