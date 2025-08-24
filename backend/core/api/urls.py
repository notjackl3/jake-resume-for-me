from rest_framework.routers import DefaultRouter
from resume.api.urls import education_router, experience_router, project_router, technical_skills_router
from django.urls import path, include

# now we can extend the origin router with our own routers
router = DefaultRouter()

#education
router.registry.extend(education_router.registry)

urlpatterns = [
    path("", include(router.urls)) # this is the main path, but our path other sections is called (*)
]
