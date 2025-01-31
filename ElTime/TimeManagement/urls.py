"""
URL configuration for TimeManagement project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from application.views import pages, redirects, api

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
def cors_test(request):
    response = JsonResponse({'message': 'CORS test'})
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


urlpatterns = [
    path('cors-test/', cors_test, name='cors_test'),

    path('admin/', admin.site.urls),
    path('welcome/', pages.welcome, name="welcome"),
    path('home/', pages.home, name="home"),
    path("logout/", redirects.logout_redirect, name="logout"),
    path("actions/registration/", redirects.registrate, name="registrate"),
    path("actions/authorization/", redirects.auth, name="auth"),
    
    path("api/v1/boards/", api.boards, name="boards"),
    path("api/v1/boards/create/", api.create_board),
    path("api/v1/boards/update/", api.update_board),
    path("api/v1/boards/delete/", api.delete_board),

    path("api/v1/tasks/create/", api.create_task),
    path("api/v1/tasks/update/", api.update_task),
    path("api/v1/tasks/delete/", api.delete_task),

    path("", redirects.to_welcome, name="empty"),
]
