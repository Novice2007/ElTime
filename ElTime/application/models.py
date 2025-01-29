from django.db import models
from django.contrib.auth.models import User

from django.utils.timezone import now

class Board(models.Model):
    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="boards"
    )
    name = models.CharField(
        max_length=50,
        default="Мои задачи"
    )

    fields = (
        "user",
        "name",
    )

    class Meta:
        verbose_name = ("Board")
        verbose_name_plural = ("Boards")
    
    def __str__(self) -> str:
        return f"<{self.user.pk}:{self.user.username}> - {self.name}"


class Task(models.Model):
    board = models.ForeignKey(
        to=Board,
        on_delete=models.CASCADE,
        related_name="tasks",
        null=True
    )
    title = models.CharField(
        max_length=50,
        default="Заголовок"
    )
    content = models.CharField(
        max_length=512,
        default="",
    )
    deadline_date = models.DateField(
        default=now
    )
    
    fields = (
        "board",
        "user",
        "content",
        "deadline_date",
    )
    
    class Meta:
        verbose_name = ("Task")
        verbose_name_plural = ("Tasks")
        
    def __str__(self) -> str:
        return self.content
