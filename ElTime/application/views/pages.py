from django.http import (
    HttpRequest,
    HttpResponse
)
from django.shortcuts import (
    render,
    redirect
)

from django.contrib.auth.models import (
    User,
)
from ..models import (
    Task,
)

import datetime


def welcome(
    request: HttpRequest
) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect(home, permanent=True)

    return render(
        request=request,
        template_name="welcome.html"
    )


def home(
    request: HttpRequest
) -> HttpResponse:
    if not request.user.is_authenticated:
        return redirect(welcome, permanent=True)
    
    return render(
        request=request,
        template_name="home.html",
    )
