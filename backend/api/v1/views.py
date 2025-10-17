from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

from backend.api.v1.serializers import RepositorySerializer
from backend.api.models import Repository


class RepositorySearchView(APIView):
    serializer_class = RepositorySerializer

    def get(self, request):
        # Extract parameters based on GitHub-style search API
        q = request.query_params.get("q")
        if not q:
            return Response({"error": 'Query parameter "q" is required.'}, status=400)

        sort = request.query_params.get(
            "sort"
        )  # stars, forks, help-wanted-issues, updated
        order = request.query_params.get("order", "desc")  # desc, asc
        per_page_param = request.query_params.get("per_page", 30)
        try:
            per_page = int(per_page_param)
        except (TypeError, ValueError):
            return Response({"error": "per_page must be an integer."}, status=400)
        if per_page < 1 or per_page > 100:
            return Response(
                {"error": "per_page must be between 1 and 100."}, status=400
            )

        page_param = request.query_params.get("page", 1)
        try:
            page = int(page_param)
        except (TypeError, ValueError):
            return Response({"error": "page must be an integer."}, status=400)
        if page < 1:
            return Response({"error": "page must be greater than 0."}, status=400)

        # Basic query:
        if sort and sort not in ["stars", "forks", "help-wanted-issues", "updated"]:
            return Response({"error": "Invalid sort parameter."}, status=400)

        order = request.query_params.get("order", "desc")  # desc, asc
        if order and order not in ["asc", "desc"]:
            return Response({"error": "Invalid order parameter."}, status=400)
        page = int(request.query_params.get("page", 1))
        if page is not None and page < 1:
            return Response({"error": "page must be greater than 0."}, status=400)

        base_url = "https://api.github.com/search/repositories"

        params = {
            k: v
            for k, v in {
                "q": q,
                "sort": sort,
                "order": order,
                "per_page": per_page,
                "page": page,
            }.items()
            if v is not None
        }

        response = requests.get(base_url, params=params)
        if response.status_code != 200:
            return Response(
                {"error": "Failed to fetch repositories."}, status=response.status_code
            )

        data = response.json()
        repositories = data["items"]
        for repository in repositories:
            _, created = Repository.objects.get_or_create(
                name=repository["name"], data=repository
            )
            if not created:
                _.data = repository
                _.save()

        serializer = self.serializer_class(
            Repository.objects.filter(
                name__in=[repository["name"] for repository in repositories]
            ),
            many=True,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)
