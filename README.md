 # AIBOS — GitHub repository search (assessment)

 A small full-stack app that lets you search GitHub repositories (via the GitHub Search API), caches the results in a local SQLite database, and displays them in a React + Vite frontend.

 This repository is an assessment/sample project demonstrating a lightweight Django REST backend that shapes and persists GitHub repository objects and a TypeScript React frontend that provides searching, filtering, sorting and client-side pagination.

 ## Features
 - Search GitHub repositories using the GitHub Search API (endpoint mirrors GitHub-style query parameters).
 - Cache search results in a local SQLite database so previously fetched repositories can be listed offline.
 - REST API with versioned routes (v1) and a ViewSet for listing and retrieving cached repositories.
 - Serializer that shapes stored repository JSON to match GitHub's repository response structure (dates normalized to ISO/Z, owner/license mapping, many common repository fields available to the frontend).
 - React + TypeScript frontend (Vite) with:
	 - Search box calling backend search endpoint
	 - Filters by language
	 - Several sort options (best match, stars, watchers, size, issues, forks)
	 - Client-side pagination and per-page control
	 - Simple repository item view with avatar, description, language color, stars, and updated date

 ## Project structure (important files)
 - backend/
	 - `backend/settings.py` — Django settings (CORS, DB, installed apps)
	 - `requirements.txt` — pinned Python package requirements
	 - `api/models.py` — `Repository` model (stores raw GitHub JSON in JSONField)
	 - `api/v1/serializers.py` — `RepositorySerializer` shapes output to GitHub-like repo object
	 - `api/v1/views.py` — `RepositorySearchView` (search & upsert) and `RepositoryViewSet` (list/retrieve)
	 - `api/v1/urls.py` — `search/` route and router for `repositories` viewset
 - frontend/
	 - `package.json` — frontend dependencies & scripts
	 - `src/App.tsx` — main app logic (fetches `/api/v1/repositories` and `/api/v1/search`)
	 - `src/components/RepositoriesList.tsx`, `src/components/RepositoryItem.tsx` — UI components
	 - `src/types/index.ts` — TypeScript interfaces matching serializer output
	 - `src/data/index.ts` — TypeScript data example github language color codes.

 ## API (routes)
 Base API path: `/api/v1/`

 - GET `/api/v1/search?q=<query>[&sort=&order=&per_page=&page=]`
	 - Mirrors GitHub search query parameters (q required).
	 - Validates params (q required; sort limited to GitHub-like options; order `asc|desc`; per_page between 1 and 100; page >= 1).
	 - Calls `https://api.github.com/search/repositories` with the provided parameters.
	 - Upserts each returned repository into local `Repository` table (saving the full GitHub repository JSON into the model's `data` JSONField and ensuring `name` is set to `full_name`).
	 - Returns an array of repositories (shaped by `RepositorySerializer`) with many fields compatible with the GitHub repository object.

 - GET `/api/v1/repositories`
	 - Returns all cached repositories from the DB (serialized to GitHub-like shape).

 - GET `/api/v1/repositories/<pk>`
	 - Returns a single cached repository by primary key.

 Notes:
 - The backend currently performs unauthenticated requests to the GitHub API (no token); consider adding token support to avoid rate limits.
 - The `RepositoryViewSet` has create/update/destroy methods stubbed out (no-op).

 ## Implementation details
 - Model: `Repository` stores `name` (unique) and `data` (arbitrary JSON from GitHub). The model maps attribute access to keys inside `data` for convenience.
 - Serializer: `RepositorySerializer` returns a flattened, GitHub-compatible representation, including `owner`, `license`, `stargazers_count`, `watchers_count`, `language`, `topics`, `default_branch`, `score`, `created_at`, `updated_at`, `pushed_at`, and many URL fields.
 - Search logic: `RepositorySearchView` performs parameter validation, calls GitHub, upserts results into DB, and returns serialized objects. On non-200 responses from GitHub it forwards an error status.

 ## Setup — Backend
 Requirements
 - Python 3.11+ (the project uses Django 5.x in requirements; use a compatible Python version)
 - pip

 Steps (from repository root):

 ```powershell
 cd backend
 python -m venv .venv
 .\.venv\Scripts\Activate.ps1
 pip install -r requirements.txt
 python manage.py migrate
 python manage.py runserver 8000
 ```

 Notes:
 - If you prefer CMD instead of PowerShell, activate the venv with `.\.venv\Scripts\activate.bat`.
 - The project uses SQLite by default (file `backend/db.sqlite3`). No additional DB setup is required for local development.


 ## Setup — Frontend
 Requirements
 - Node.js 18+ (recommended), npm (or yarn/pnpm)

 Steps (from repository root):

 ```powershell
 cd frontend
 npm install
 npm run dev
 ```

 - The Vite dev server typically runs on `http://localhost:5173` which is allowed by the backend CORS settings.

 ## Running both together (development)
 1. after installation of all the requirements you can run the setup batch file to start all the servers

 Open `http://localhost:5173` in your browser for development.

 ## Usage
 - The app loads cached repositories on startup by calling `/api/v1/repositories`.
 - Use the search box to query GitHub repositories; the app will call `/api/v1/search?q=<term>` and display results.
 - Use filters to restrict by language, sort by different criteria, and change the per-page value for client-side pagination.

 Example request (search):
 ```http
 GET http://localhost:8000/api/v1/search?q=django+rest+framework&per_page=20
 ```

 Example response (trimmed):
 ```json
 [
	 {
		 "id": 123456,
		 "node_id": "MDEwOlJlcG9zaXRvcnkxMjM0NTY=",
		 "name": "rest-framework",
		 "full_name": "encode/rest-framework",
		 "private": false,
		 "owner": {"login":"encode","avatar_url":"https://..."},
		 "stargazers_count": 1234,
		 "watchers_count": 1234,
		 "language": "Python",
		 "updated_at": "2025-10-17T12:34:56Z",
		 "score": 1.0
	 }
 ]
 ```

 ## Development notes & next steps
 - Add optional GitHub authentication to avoid rate limiting (support a PAT via environment variable).
 - Implement server-side pagination on `/api/v1/search` so the backend can forward GitHub's `total_count` and pagination metadata.
 - Implement create/update/destroy on `RepositoryViewSet` if you want to allow editing cached entries.
 - Harden error handling for upstream failures and add logging.

 ## Contributing
 Pull requests are welcome. For bigger changes, open an issue to discuss the change first.

 ## License
 Add a LICENSE file if you intend to open-source this project. Currently no license is specified in the repo.

 ---
 made with ❤️ by frank ogenrwoth