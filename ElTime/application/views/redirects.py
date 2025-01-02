from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponseRedirect,
    HttpResponsePermanentRedirect
)
from django.shortcuts import (
    redirect,
)

from .pages import (
    welcome,
    home,
)


def to_welcome() -> HttpResponsePermanentRedirect:
    return redirect(welcome, permanent=True)

def to_home() -> HttpResponsePermanentRedirect:
    return redirect(home, permanent=True)


