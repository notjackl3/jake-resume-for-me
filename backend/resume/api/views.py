from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from ..models import *
from .serializers import *


class EducationViewSet(ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    @action(detail=True, methods=['delete'], url_path='delete')
    def custom_delete(self, request, pk=None):
        try:
            education = self.get_object()
            education.delete()
            return Response({"message": "Experience deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)

class ExperienceViewSet(ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    @action(detail=True, methods=['delete'], url_path='delete')
    def custom_delete(self, request, pk=None):
        try:
            experience = self.get_object()
            experience.delete()
            return Response({"message": "Experience deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)

class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=True, methods=['delete'], url_path='delete')
    def custom_delete(self, request, pk=None):
        try:
            project = self.get_object()
            project.delete()
            return Response({"message": "Experience deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)

class SkillsViewSet(ModelViewSet):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ExperienceDeleteView(APIView):
    def delete(self, request, pk):
        try:
            experience = Experience.objects.get(pk=pk)
            experience.delete()
            return Response({"message": "Experience deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)