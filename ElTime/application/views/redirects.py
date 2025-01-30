from django.http import (
    HttpRequest,
    HttpResponsePermanentRedirect
)
from django.shortcuts import (
    redirect,
)
from django.contrib.auth import (
    authenticate,
    login,
    logout
)
from django.db.utils import IntegrityError
from django.contrib.auth.models import User

from ..models import (
    Board,
    Task
)

from .pages import (
    welcome,
    home,
)

from .common import (
    insert_to_session,
    delete_from_session,
)


def to_welcome(
    request: HttpRequest,
    **session_items
) -> HttpResponsePermanentRedirect:
    delete_from_session(request, "errors")
    insert_to_session(request, **session_items)
    return redirect(welcome, permanent=True)


def to_home(
    request: HttpRequest,
    **session_items
) -> HttpResponsePermanentRedirect:
    delete_from_session(request, "errors")
    insert_to_session(request, **session_items)
    return redirect(home, permanent=True)


def registrate(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    """ Registration view
    
    `request.POST`:
        login: str
        email: str
        password: str
    
    """

    username = request.POST.get("login")
    email = request.POST.get("email")
    password = request.POST.get("password")

    try:
        user = User.objects.create_user(
            username,
            email,
            password,
        )

        user.save()
        login(request, user)

        Task.objects.create(
            board=Board.objects.create(
                user=user,
                name="Мои задачи"
            ),
            title="ЗОЖ",
            content="Лечь спать пораньше <3"
        )

        return to_home(
            request,
            user__login=user.username
        )
    except IntegrityError:
        return to_welcome(
            request,
            errors__registration="username-exists"
        )


def auth(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    """ Authorization view
    
    `request.POST`:
        login: str
        password: str
    
    """

    username = request.POST.get("login")
    password = request.POST.get("password")

    user = authenticate(
        request=request,
        username=username,
        password=password
    )

    if user is not None:
        login(request=request, user=user)

        return to_home(
            request,
            user__login=user.username
        )
    
    return to_welcome(
        request,
        errors__authorization="error"
    )


def logout_redirect(
    request: HttpRequest
) -> HttpResponsePermanentRedirect:
    logout(request)
    return to_welcome(request)
