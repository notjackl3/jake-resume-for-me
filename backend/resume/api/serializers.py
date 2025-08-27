from rest_framework.serializers import ModelSerializer
from ..models import Education, Experience, Project, Skills, Description

class EducationSerializer(ModelSerializer):
    class Meta:
        model = Education
        fields = ("id", "school", "major", "location", "start_date", "end_date", "gpa")

# create our model into json format to be sent over the web
class DescriptionSerializer(ModelSerializer):
    class Meta:
        model = Description
        fields = ("id", "content")

class ExperienceSerializer(ModelSerializer):
    descriptions = DescriptionSerializer(many=True)

    class Meta:
        model = Experience
        fields = ("id", "title", "organisation", "location", "start_date", "end_date", "descriptions")
    
    def create(self, validated_data):
        descriptions_data = validated_data.pop("descriptions")
        experience = Experience.objects.create(**validated_data)

        for desc_data in descriptions_data:
            description = Description.objects.create(**desc_data)
            experience.descriptions.add(description)

        return experience

class ProjectSerializer(ModelSerializer):
    descriptions = DescriptionSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = ("id", "title", "tools", "source_code", "descriptions")

class SkillsSerializer(ModelSerializer):
    class Meta:
        model = Skills
        fields = ("languages_list", "frameworks_list", "tools_list", "technologies_list", "databases_list", "certificates_list")