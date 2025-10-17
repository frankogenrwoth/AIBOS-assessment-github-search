from django.db import models


class Repository(models.Model):
    name = models.CharField(max_length=255, blank=True)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __getattr__(self, attr):
        if attr in self.data:
            return self.data[attr]
        raise AttributeError(
            f"'{self.__class__.__name__}' object has no attribute '{attr}'"
        )

    def __str__(self):
        return self.name or ""

    def save(self, *args, **kwargs):
        """
        Override save to ensure 'name' is always set from 'full_name' before saving.
        """
        self.name = getattr(self, 'full_name', self.name)
        return super().save(*args, **kwargs)
