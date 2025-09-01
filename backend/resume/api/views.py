from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from ..models import *
from .serializers import *


class EducationViewSet(ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    # details=True allows us to have <pk:id> in the url, and it only selects one element. And this action is only available to the methods delete 
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
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=False)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            print("Serializer validation failed. Errors:")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=False)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            print("Serializer validation failed. Errors:")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillViewSet(ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    @action(detail=True, methods=['delete'], url_path='delete')
    def custom_delete(self, request, pk=None):
        try:
            skill = self.get_object()
            skill.delete()
            return Response({"message": "Experience deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)

