from django.db import models
from django.contrib.auth.models import User

from django.utils.timezone import now


class Task(models.Model):
    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    content = models.CharField(
        max_length=512,
        default="",
    )
    deadline_date = models.DateField(
        default=now()
    )
    finished = models.BooleanField(
        default=False
    )
    
    fields = (
        "user",
        "content",
        "deadline_date",
        "finished",
    )
    
    class Meta:
        verbose_name = ("Task")
        verbose_name_plural = ("Tasks")
        
    def __str__(self):
        return self.content
