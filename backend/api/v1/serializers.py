from api.models import Repository
from rest_framework import serializers


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = "__all__"

    @staticmethod
    def _isoformat_or_none(dt):
        if not dt:
            return None
        try:
            s = dt.isoformat()
            if s.endswith("+00:00"):
                return s.replace("+00:00", "Z")
            if dt.tzinfo is None and not s.endswith("Z"):
                return s + "Z"
            return s
        except Exception:
            return str(dt)
            return str(dt)

    def to_representation(self, instance):
        # Shape the output like GitHub's repository API
        license_info = getattr(instance, "license", None)
        if isinstance(license_info, dict):
            license_dict = {
                "key": license_info.get("key"),
                "name": license_info.get("name"),
                "spdx_id": license_info.get("spdx_id"),
                "url": license_info.get("url"),
                "node_id": license_info.get("node_id"),
            }
        else:
            license_dict = {
                "key": getattr(
                    license_info, "key", getattr(instance, "license_key", None)
                ),
                "name": getattr(
                    license_info, "name", getattr(instance, "license_name", None)
                ),
                "spdx_id": getattr(
                    license_info, "spdx_id", getattr(instance, "license_spdx_id", None)
                ),
                "url": getattr(
                    license_info, "url", getattr(instance, "license_url", None)
                ),
                "node_id": getattr(
                    license_info, "node_id", getattr(instance, "license_node_id", None)
                ),
            }

        owner_obj = getattr(instance, "owner", None)
        owner = {
            "login": owner_obj.get("login"),
            "id": owner_obj.get("id"),
            "node_id": owner_obj.get("node_id"),
            "avatar_url": owner_obj.get("avatar_url"),
            "gravatar_id": owner_obj.get("gravatar_id"),
            "url": owner_obj.get("url"),
            "html_url": owner_obj.get("html_url"),
            "followers_url": owner_obj.get("followers_url"),
            "following_url": owner_obj.get("following_url"),
            "gists_url": owner_obj.get("gists_url"),
            "starred_url": owner_obj.get("starred_url"),
            "subscriptions_url": owner_obj.get("subscriptions_url"),
            "organizations_url": owner_obj.get("organizations_url"),
            "repos_url": owner_obj.get("repos_url"),
            "events_url": owner_obj.get("events_url"),
            "received_events_url": owner_obj.get("received_events_url"),
            "type": owner_obj.get("type"),
            "user_view_type": owner_obj.get("user_view_type"),
            "site_admin": bool(owner_obj.get("site_admin", False)),
        }

        name = instance.data.get("name", instance.name)
        owner_login = owner["login"]
        full_name = getattr(
            instance,
            "full_name",
            f"{owner_login}/{name}" if owner_login and name else None,
        )

        html_url = getattr(instance, "html_url", None) or getattr(instance, "url", None)
        api_url = getattr(instance, "api_url", None) or getattr(instance, "url", None)

        return {
            "id": getattr(instance, "id", None),
            "node_id": getattr(instance, "node_id", None),
            "name": name,
            "full_name": full_name,
            "private": bool(getattr(instance, "private", False)),
            "owner": owner,
            "html_url": html_url,
            "description": getattr(instance, "description", None),
            "fork": bool(getattr(instance, "fork", False)),
            "url": api_url,
            "forks_url": getattr(instance, "forks_url", None),
            "keys_url": getattr(instance, "keys_url", None),
            "collaborators_url": getattr(instance, "collaborators_url", None),
            "teams_url": getattr(instance, "teams_url", None),
            "hooks_url": getattr(instance, "hooks_url", None),
            "issue_events_url": getattr(instance, "issue_events_url", None),
            "events_url": getattr(instance, "events_url", None),
            "assignees_url": getattr(instance, "assignees_url", None),
            "branches_url": getattr(instance, "branches_url", None),
            "tags_url": getattr(instance, "tags_url", None),
            "blobs_url": getattr(instance, "blobs_url", None),
            "git_tags_url": getattr(instance, "git_tags_url", None),
            "git_refs_url": getattr(instance, "git_refs_url", None),
            "trees_url": getattr(instance, "trees_url", None),
            "statuses_url": getattr(instance, "statuses_url", None),
            "languages_url": getattr(instance, "languages_url", None),
            "stargazers_url": getattr(instance, "stargazers_url", None),
            "contributors_url": getattr(instance, "contributors_url", None),
            "subscribers_url": getattr(instance, "subscribers_url", None),
            "subscription_url": getattr(instance, "subscription_url", None),
            "commits_url": getattr(instance, "commits_url", None),
            "git_commits_url": getattr(instance, "git_commits_url", None),
            "comments_url": getattr(instance, "comments_url", None),
            "issue_comment_url": getattr(instance, "issue_comment_url", None),
            "contents_url": getattr(instance, "contents_url", None),
            "compare_url": getattr(instance, "compare_url", None),
            "merges_url": getattr(instance, "merges_url", None),
            "archive_url": getattr(instance, "archive_url", None),
            "downloads_url": getattr(instance, "downloads_url", None),
            "issues_url": getattr(instance, "issues_url", None),
            "pulls_url": getattr(instance, "pulls_url", None),
            "milestones_url": getattr(instance, "milestones_url", None),
            "notifications_url": getattr(instance, "notifications_url", None),
            "labels_url": getattr(instance, "labels_url", None),
            "releases_url": getattr(instance, "releases_url", None),
            "created_at": self._isoformat_or_none(
                getattr(instance, "created_at", None)
            ),
            "updated_at": self._isoformat_or_none(
                getattr(instance, "updated_at", None)
            ),
            "pushed_at": self._isoformat_or_none(getattr(instance, "pushed_at", None)),
            "pushed_at": self._isoformat_or_none(getattr(instance, "pushed_at", None)),
            "git_url": getattr(instance, "git_url", None),
            "ssh_url": getattr(instance, "ssh_url", None),
            "clone_url": getattr(instance, "clone_url", None),
            "svn_url": getattr(instance, "svn_url", None),
            "homepage": getattr(instance, "homepage", None),
            "size": getattr(instance, "size", 0),
            "stargazers_count": getattr(instance, "stargazers_count", 0),
            "watchers_count": getattr(
                instance, "watchers_count", getattr(instance, "stargazers_count", 0)
            ),
            "language": getattr(instance, "language", None),
            "has_issues": bool(getattr(instance, "has_issues", True)),
            "has_projects": bool(getattr(instance, "has_projects", True)),
            "has_downloads": bool(getattr(instance, "has_downloads", True)),
            "has_wiki": bool(getattr(instance, "has_wiki", False)),
            "has_pages": bool(getattr(instance, "has_pages", False)),
            "has_discussions": bool(getattr(instance, "has_discussions", False)),
            "forks_count": getattr(
                instance, "forks_count", getattr(instance, "forks", 0)
            ),
            "mirror_url": getattr(instance, "mirror_url", None),
            "archived": bool(getattr(instance, "archived", False)),
            "disabled": bool(getattr(instance, "disabled", False)),
            "open_issues_count": getattr(
                instance, "open_issues_count", getattr(instance, "open_issues", 0)
            ),
            "license": license_dict if any(license_dict.values()) else None,
            "allow_forking": bool(getattr(instance, "allow_forking", True)),
            "is_template": bool(getattr(instance, "is_template", False)),
            "web_commit_signoff_required": bool(
                getattr(instance, "web_commit_signoff_required", False)
            ),
            "topics": list(getattr(instance, "topics", [])),
            "visibility": getattr(instance, "visibility", "public"),
            "forks": getattr(instance, "forks", getattr(instance, "forks_count", 0)),
            "open_issues": getattr(
                instance, "open_issues", getattr(instance, "open_issues_count", 0)
            ),
            "watchers": getattr(
                instance,
                "watchers",
                getattr(
                    instance, "watchers_count", getattr(instance, "stargazers_count", 0)
                ),
            ),
            "default_branch": getattr(instance, "default_branch", "main"),
            "score": getattr(instance, "score", 1.0),
        }
