from django.db import models

class Description(models.Model):
    content = models.CharField(unique=True)

    def __str__(self):
        return f"{self.content}"

class Education(models.Model):
    school = models.CharField()
    major = models.CharField()
    location = models.CharField()
    start_date = models.CharField(null=True, blank=True)
    end_date = models.CharField(null=True, blank=True)
    gpa = models.CharField(null=True, blank=True)

    def __str__(self):
        return f"{self.school} - {self.major} - {self.location}"
    
class Experience(models.Model):
    title = models.CharField()
    organisation = models.CharField()
    location = models.CharField(null=True, blank=True)
    start_date = models.CharField(null=True, blank=True)
    end_date = models.CharField(null=True, blank=True)
    descriptions  = models.ManyToManyField(Description, null=True, blank=True)
    included = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"{self.title} - {self.organisation} - {self.location}"
    
class Project(models.Model):
    name = models.CharField()
    tools = models.CharField(null=True, blank=True)
    source_code = models.CharField(null=True, blank=True)
    descriptions = models.ManyToManyField(Description, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.tools}"

class Skills(models.Model):
    languages_list = models.CharField(null=True, blank=True)
    frameworks_list = models.CharField(null=True, blank=True)
    tools_list =  models.CharField(null=True, blank=True)
    technologies_list = models.CharField(null=True, blank=True)
    databases_list = models.CharField(null=True, blank=True)
    certificates_list = models.CharField(null=True, blank=True)

    def __str__(self):
        return f"{self.languages_list} - {self.frameworks_list} - {self.tools_list} - {self.technologies_list} - {self.databases_list} - {self.certificates_list}"
        
