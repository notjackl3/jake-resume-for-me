from rest_framework.routers import DefaultRouter
from resume.api.urls import education_router, experience_router, project_router, skill_router
from django.urls import path, include

# now we can extend the origin router with our own routers
router = DefaultRouter()

# education
router.registry.extend(education_router.registry)

# experiences
router.registry.extend(experience_router.registry)

# projects
router.registry.extend(project_router.registry)

# technical skills
router.registry.extend(skill_router.registry)

urlpatterns = [
    path("", include(router.urls)) # this is the main path, but our path to other sections is called (*)
]
