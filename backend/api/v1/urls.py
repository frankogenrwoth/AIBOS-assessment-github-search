from api.v1.views import RepositorySearchView
from django.urls import path


urlpatterns = [
    path("search/", RepositorySearchView.as_view(), name="search"),
]
