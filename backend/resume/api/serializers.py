from rest_framework.serializers import ModelSerializer
from ..models import Education, Experience, Project, Skill, Description

class EducationSerializer(ModelSerializer):
    class Meta:
        model = Education
        fields = ("id", "school", "major", "location", "start_date", "end_date", "gpa")
    
    def create(self, validated_data):
        education = Education.objects.create(**validated_data)

        return education
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

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
        descriptions_data = validated_data.pop("descriptions", [])
        experience = Experience.objects.create(**validated_data)

        for desc_data in descriptions_data:
            description = Description.objects.create(**desc_data)
            experience.descriptions.add(description)

        return experience

    def update(self, instance, validated_data):
        descriptions_data = validated_data.pop("descriptions", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.descriptions.clear()
        for desc in descriptions_data:
            try:
                changing_desc = Description.objects.get(content=desc["content"])
            except Description.DoesNotExist:
                changing_desc = Description(content=desc["content"])
                changing_desc.save()
            instance.descriptions.add(changing_desc)

        return instance

class ProjectSerializer(ModelSerializer):
    descriptions = DescriptionSerializer(many=True)

    class Meta:
        model = Project
        fields = ("id", "name", "tools", "source_code", "descriptions")
    
    def update(self, instance, validated_data):
        descriptions_data = validated_data.pop("descriptions", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.descriptions.clear()
        for desc in descriptions_data:
            try:
                changing_desc = Description.objects.get(content=desc["content"])
            except Description.DoesNotExist:
                changing_desc = Description(content=desc["content"])
                changing_desc.save()
            instance.descriptions.add(changing_desc)

        return instance

class SkillSerializer(ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "content")