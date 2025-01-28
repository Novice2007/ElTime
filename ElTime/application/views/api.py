from django.http import (
    HttpRequest,
    HttpResponse,
    JsonResponse
)

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

    boards = Board.objects.filter(user=request.user)

    for board in boards:
        context["boards"].setdefault(
            board.name,
            [
                {
                    "title": task.title,
                    "content": task.content,
                    "deadline": str(task.deadline_date)
                } for task in board.tasks.all()
            ]
        )

    return JsonResponse(context)
