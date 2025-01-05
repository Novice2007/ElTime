from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponseRedirect,
    HttpResponsePermanentRedirect
)
from django.shortcuts import (
    redirect,
)
from django.contrib.auth import (
    aauthenticate,
    alogin,
)

from .pages import (
    welcome,
    home,
)


def to_welcome(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    return redirect(welcome, permanent=True)

def to_home(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    return redirect(home, permanent=True)

def registrate(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    print(request.POST)

async def auth(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    print(request.POST)

    username = request.POST.get("login")
    password = request.POST.get("password")

    user = await aauthenticate(
        request=request,
        username=username,
        password=password
    )

    if user is not None:
        await alogin(request=request, user=user)
