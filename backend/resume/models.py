from django.db import models

class Description(models.Model):
    content = models.CharField(unique=True)

    def __str__(self):
        return f"{self.content}"

class Education(models.Model):
    school = models.CharField()
    major = models.CharField()
    location = models.CharField()
    start_date = models.CharField(null=True)
    end_date = models.CharField(null=True)
    gpa = models.CharField(null=True)

    def __str__(self):
        return f"{self.school} - {self.major} - {self.location}"
    
class Experience(models.Model):
    title = models.CharField()
    organisation = models.CharField()
    location = models.CharField()
    start_date = models.CharField()
    end_date = models.CharField()
    descriptions  = models.ManyToManyField(Description)
    included = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.organisation} - {self.location}"
    
class Project(models.Model):
    title = models.CharField()
    tools = models.CharField()
    source_code = models.CharField()
    descriptions = models.ManyToManyField(Description)

    def __str__(self):
        return f"{self.title} - {self.tools}"

class TechnicalSkills(models.Model):
    languages_list = models.CharField()
    frameworks_list = models.CharField()
    tools_list =  models.CharField()
    technologies_list = models.CharField()
    databases_list = models.CharField()
    certificates_list = models.CharField()

    def __str__(self):
        return f"{self.languages} - {self.frameworks} - {self.tools} - {self.technologies} - {self.databases} - {self.certificates}"
        
