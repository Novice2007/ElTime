from django.http import (
    HttpRequest,
    HttpResponse
)
from django.shortcuts import render

from .models import (
    User,
    Task
)

import datetime

def index(
    request: HttpRequest
) -> HttpResponse:    
    # for user in User.objects.all():
    #     print(
    #         {
    #             "user_id": user.user_id,
    #             "name": user.name,
    #             "surname": user.surname,
    #             "email": user.email,
    #             "password": user.password,
    #         }
    #     )
    
    context: dict[
        str, 
        str | list[
            str,
            str | bool | datetime._Time
        ]
    ] = {
        "name": "",
        "surname": "",
        "tasks": []
    }
    
    user = User.objects.get(user_id=1)
    
    context["name"] = user.name
    context["surname"] = user.surname
    
    user_tasks = Task.objects.filter(
        user_id=user.user_id
    )
    
    for task in user_tasks:
        context["tasks"].append(
            {
                "content": task.content,
                "time_elapsed": task.created,
                "status": "finished" if task.finished \
                    else "active"
            }
        )
    
    return render(
        request=request,
        template_name="main.html",
        context=context
    )
