from django.contrib import admin

from application.models import (
    User,
    Task,
)

admin.site.register(User)
admin.site.register(Task)
