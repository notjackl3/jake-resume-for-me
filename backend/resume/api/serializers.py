from rest_framework.serializers import ModelSerializer
from ..models import Education, Experience, Project, TechnicalSkills, Description

# create our model into json format to be sent over the web
class DescriptionSerializer(ModelSerializer):
    class Meta:
        model = Description
        fields = ("id", "content")

class EducationSerializer(ModelSerializer):
    class Meta:
        model = Education
        fields = ("id", "school", "major", "location", "start_date", "end_date", "gpa")

class ExperienceSerializer(ModelSerializer):
    descriptions = DescriptionSerializer(read_only=True, many=True)

    class Meta:
        model = Experience
        fields = ("id", "title", "organisation", "location", "start_date", "end_date", "descriptions")

class ProjectSerializer(ModelSerializer):
    descriptions = DescriptionSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = ("id", "title", "tools", "source_code", "descriptions")

class TechnicalSkillsSerializer(ModelSerializer):
    class Meta:
        model = TechnicalSkills
        fields = ("languages_list", "frameworks_list", "tools_list", "technologies_list", "databases_list", "certificates_list")