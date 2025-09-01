from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

education_router = DefaultRouter()
# (*) education would be the path to this router
education_router.register(r"education", EducationViewSet)

experience_router = DefaultRouter()
experience_router.register(r"experiences", ExperienceViewSet) # whatever you put in r"" will be your / for this api endpoint

project_router = DefaultRouter()
project_router.register(r"projects", ProjectViewSet)

skill_router = DefaultRouter()
skill_router.register(r"skills", SkillViewSet)
