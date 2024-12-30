from django.db import models
from django.utils.timezone import now
# from django.contrib.auth.hashers import make_password


class User(models.Model):
    user_id = models.AutoField(
        primary_key=True,
    )
    name = models.CharField(
        max_length=32
    )
    surname = models.CharField(
        max_length=32
    )
    password = models.CharField(
        max_length=88,
    )
    email = models.EmailField()

    fields = (
        "user_id",
        "name",
        "surname",
        "password",
        "email",
    )
    
    class Meta:
        verbose_name = ("User")
        verbose_name_plural = ("Users")
        
    def __str__(self):
        return self.name


class Task(models.Model):
    user_id = models.ForeignKey(
        User,
        to_field="user_id",
        on_delete=models.CASCADE
    )
    content = models.CharField(
        max_length=128,
        default="",
    )
    created = models.TimeField(
        default=now
    )
    expired = models.BooleanField(
        default=False
    )
    finished = models.BooleanField(
        default=False
    )
    
    fields = (
        "user_id",
        "content",
        "created",
        "expired",
        "finished",
    )
    
    class Meta:
        verbose_name = ("Task")
        verbose_name_plural = ("Tasks")
        
    def __str__(self):
        return self.content
