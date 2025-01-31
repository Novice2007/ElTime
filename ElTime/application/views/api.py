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

import json


@csrf_exempt
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


@csrf_exempt
def create_board(
    request: HttpRequest
) -> HttpResponse:
    """
    `request.body`:
    {
        "board": <board_name>,
    }
    """

    board_name: str = json.loads(request.body)\
        .get("board")

    if Board.objects.filter(
        user=request.user,
        name=board_name
    ).count() > 0:
        return HttpResponse(
            "Busy board name",
            status=409
        )
    
    Board.objects.create(
        user=request.user,
        name=board_name
    )

    return HttpResponse(status=204)


@csrf_exempt
def update_board(
    request: HttpRequest
) -> HttpResponse:
    ...


@csrf_exempt
def delete_board(
    request: HttpRequest
) -> HttpResponse:
    """
    `request.body`:
    {
        "board": <board_name>,
    }
    """

    board_name: str = json.loads(request.body)\
        .get("board")

    existing_board = Board.objects.get(
        user=request.user,
        name=board_name
    )

    if existing_board:
        existing_board.delete()
        return HttpResponse(status=204)
    
    return HttpResponse(
        f"Not found the board with \"{\
            board_name\
        }\" name",
        status=404
    )


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
        status=202
    )


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
