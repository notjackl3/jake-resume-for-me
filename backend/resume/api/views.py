from rest_framework.viewsets import ModelViewSet
from ..models import *
from .serializers import *

class EducationViewSet(ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class ExperienceViewSet(ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class TechnicalSkillsViewSet(ModelViewSet):
    queryset = TechnicalSkills.objects.all()
    serializer_class = TechnicalSkillsSerializer