from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

education_router = DefaultRouter()
# (*) education would be the path to this router
education_router.register(r"education", EducationViewSet)

experience_router = DefaultRouter()
experience_router.register(r"experiences", ExperienceViewSet)

project_router = DefaultRouter()
project_router.register(r"projects", ProjectViewSet)

technical_skills_router = DefaultRouter()
technical_skills_router.register(r"technical_skills", TechnicalSkillsViewSet)
