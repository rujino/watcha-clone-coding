# Generated by Django 4.1.3 on 2023-01-04 08:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('coupons', '0003_rename_owner_coupon_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coupon',
            old_name='user',
            new_name='username',
        ),
    ]
