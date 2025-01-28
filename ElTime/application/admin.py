from django.contrib import admin

from application.models import (
    Board,
    Task,
)

admin.site.register(Board)
admin.site.register(Task)
