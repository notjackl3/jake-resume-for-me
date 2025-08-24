from django.db import models

class Leadership(models.Model):
    name = models.CharField(max_length=100)
    date = models.CharField(max_length=100, null=True)
    location = models.CharField(max_length=100, null=True)
    organisation = models.CharField(max_length=100, null=True)
    included = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} at {self.organisation}"

class Work(models.Model):
    name = models.CharField(max_length=100)
    date = models.CharField(max_length=100, null=True)
    location = models.CharField(max_length=100, null=True)
    organisation = models.CharField(max_length=100, null=True)
    included = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} at {self.organisation}"

class Description(models.Model):
    experience = models.ForeignKey(
        Leadership,
        on_delete=models.CASCADE,
        related_name="description"
    )
    content = models.TextField()
