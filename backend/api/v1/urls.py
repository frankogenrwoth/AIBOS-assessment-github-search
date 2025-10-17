from api.v1.views import RepositorySearchView, RepositoryViewSet
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"repositories", RepositoryViewSet, basename="repository")

urlpatterns = [
    path("search/", RepositorySearchView.as_view(), name="search"),
]

urlpatterns += router.urls
