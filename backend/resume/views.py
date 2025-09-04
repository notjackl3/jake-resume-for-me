from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, viewsets
from .utils import *

class CreateResumeViewSet(viewsets.ViewSet):
    def create_resume(self, request):
        print("creating resume")
        compile_data_to_latex(request.data, "jake-resume-for-me")
        return Response({"message": "Created resume successfully."}, status=status.HTTP_204_NO_CONTENT)