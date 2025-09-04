from django.urls import path
from .views import CreateResumeViewSet

urlpatterns = [
    path("create-resume/", CreateResumeViewSet.as_view({"post": "create_resume"}), name='create-resume')
]