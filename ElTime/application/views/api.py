from django.http import (
    HttpRequest,
    HttpResponse,
    JsonResponse
)
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import (
    User,
)
from ..models import (
    Board,
    Task,
)

import datetime, json


def boards(
    request: HttpRequest
) -> JsonResponse:
    context = {
        "boards": {}
    }

    boards = Board.objects.filter(
        user=request.user
    )

    for board in boards:
        context["boards"].setdefault(
            board.name,
            [
                {
                    "title": task.title,
                    "content": task.content,
                    "deadline": str(
                        task.deadline_date
                    )
                } for task in board.tasks.all()
            ]
        )

    return JsonResponse(context)


def create_board(
    request: HttpRequest
) -> HttpResponse:
    ...


def update_board(
    request: HttpRequest
) -> HttpResponse:
    ...


def delete_board(
    request: HttpRequest
) -> HttpResponse:
    ...


@csrf_exempt
def create_task(
    request: HttpRequest
) -> HttpResponse:
    """
    `request.body`:
    {
        "board": <board_name>,
        "task":
        {
            "title": <title>,
            "content": <content>,
            "deadline": <deadline>
        }
    }
    """

    print(f"{request.body.decode() = }")

    body: dict[str, str | dict[str, str]] =\
        json.loads(request.body)

    board: Board = Board.objects.get(
        user=request.user,
        name=body.get("board")
    )

    recieved_task = body.get("task")

    Task.objects.create(
        board=board,
        title=recieved_task.get("title"),
        content=recieved_task.get("content"),
        deadline_date=recieved_task.get("deadline")
    )

    return HttpResponse(
        "OK",
        status=201
    )


@csrf_exempt
def update_task(
    request: HttpRequest
) -> HttpResponse:
    """
    `request.body`:
    {
        "board": <board_name>,
        "previous":
        {
            "title": <title>,
            "content": <content>,
            "deadline": <deadline>
        },
        "new":
        {
            "title": <title>,
            "content": <content>,
            "deadline": <deadline>
        }
    }
    """

    body: dict[str, str | dict[str, str]] =\
        json.loads(request.body)

    board: Board = Board.objects.get(
        user=request.user,
        name=body.get("board")
    )

    previous_task = body.get("previous")
    new_task = body.get("new")

    try:
        task: Task = Task.objects.filter(
            board=board.pk,
            title=previous_task.get("title"),
            content=previous_task.get("content"),
            deadline_date=previous_task.get("deadline")
        ).first()

        task.title = new_task.get("title")
        task.content = new_task.get("content")
        task.deadline_date = new_task.get("deadline")

        task.save()

        return JsonResponse(
            {
                "title": task.title,
                "content": task.content,
                "deadline": str(
                    task.deadline_date
                )
            },
            202
        )
    except Exception as ex:
        print(Exception)
        return HttpResponse(ex, 500)


@csrf_exempt
def delete_task(
    request: HttpRequest
) -> HttpResponse:
    """
    `request.body`:
    {
        "board": <board_name>,
        "task":
        {
            "title": <title>,
            "content": <content>,
            "deadline": <deadline>
        }
    }
    """

    print(f"{request.body.decode() = }")

    body: dict[str, str | dict[str, str]] =\
        json.loads(request.body.decode())

    board: Board = Board.objects.get(
        user=request.user,
        name=body.get("board")
    )
    
    recieved_task = body.get("task")
    
    Task.objects.filter(
        board=board.pk,
        title=recieved_task.get("title"),
        content=recieved_task.get("content"),
        deadline_date=recieved_task.get("deadline")
    ).first().delete()

    return HttpResponse(status=204)
