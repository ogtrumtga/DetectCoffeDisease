"""
Test script for API endpoints (excluding /api/diagnosis, and any feedback/treatment APIs).

Run:
  python backend/test_api_other.py
"""

import os
import sys
import time
import json
import requests

# Ensure "backend" package is importable when running: python backend/test_api_other.py
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.repositories import firebase_auth_repository as auth_repo

BASE_URL = "http://localhost:8000"


def _safe_json(resp: requests.Response):
    try:
        return resp.json()
    except Exception:
        return None


def _summarize_response(resp: requests.Response) -> str:
    js = _safe_json(resp)
    if js is None:
        text = resp.text.strip()
        return text[:140] if text else ""
    # Prefer common keys
    for k in ("detail", "message", "success"):
        if k in js:
            return f"{k}={js.get(k)}"
    # Fallback: short dump
    return json.dumps(js)[:140]


def _call(method: str, path: str, headers=None, params=None, json_body=None, timeout_s: int = 10):
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=json_body,
            timeout=timeout_s,
        )
        return resp.status_code, _summarize_response(resp)
    except Exception as e:
        return 0, f"ERROR: {e}"


def main():
    # 1) Prepare auth for endpoints requiring Authorization header.
    ts = int(time.time())
    email = f"test_{ts}@example.com"
    password = "password123"
    display_name = "Test User"

    print("Preparing token via /auth/register ...")
    reg_status, reg_sum = _call(
        "POST",
        "/auth/register",
        json_body={"email": email, "password": password, "displayName": display_name},
    )
    if reg_status != 200:
        print("Register failed; auth-protected calls may all be 401.")
        uid = None
        token = None
    else:
        # Re-fetch json to get uid reliably
        # (the summary may not include uid)
        reg_resp = requests.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password, "displayName": display_name})
        reg_json = _safe_json(reg_resp) or {}
        uid = (reg_json.get("user") or {}).get("uid")
        token = auth_repo.firebase_generate_custom_token(uid) if uid else None

    auth_headers = {"Authorization": f"Bearer {token}"} if token else None

    # 2) Public calls first (no Authorization).
    # Weather
    public_tests = [
        ("GET", "/", None, {}),
        ("GET", "/health", None, {}),
        ("GET", "/api/weather/coords", None, {"lat": 10.0, "lon": 106.0}),
        ("GET", "/api/weather/city", None, {"name": "Hanoi"}),
        ("GET", "/api/weather/spray-time", None, {"lat": 10.0, "lon": 106.0}),
        ("GET", "/api/weather/spray-rules", None, {}),
        ("GET", "/api/community/posts", None, {"page": 1, "limit": 5}),
        ("GET", "/api/community/posts/search", None, {"q": "coffee", "limit": 5}),
    ]

    results = []

    for method, path, headers, q in public_tests:
        status, summary = _call(method, path, headers=headers, params=q if q else None)
        results.append(("PUBLIC", method, path, q if q else None, status, summary))

    # Extract a post_id for further community checks.
    post_id = None
    posts_resp = requests.get(f"{BASE_URL}/api/community/posts", params={"page": 1, "limit": 5})
    posts_json = _safe_json(posts_resp) or {}
    data = posts_json.get("data") or []
    if data and isinstance(data, list):
        post_id = data[0].get("id")

    if post_id:
        # These are public (auth optional for post detail / comments list).
        status, summary = _call("GET", f"/api/community/posts/{post_id}", headers=None)
        results.append(("PUBLIC", "GET", f"/api/community/posts/{post_id}", None, status, summary))

        status, summary = _call(
            "GET",
            f"/api/community/posts/{post_id}/comments",
            headers=None,
            params={"page": 1, "limit": 5},
        )
        results.append(("PUBLIC", "GET", f"/api/community/posts/{post_id}/comments", {"page": 1, "limit": 5}, status, summary))

    # 3) Auth-protected calls (or calls that require Authorization).
    protected_tests = [
        ("AUTH", "POST", "/api/history", {"imageId": "img_test_other_001", "predictions": {"disease": "rust", "confidence": 0.95}}, None),
        ("AUTH", "GET", "/api/history", None, {"page": 1}),
        ("AUTH", "DELETE", "/api/history", None, {}),
        ("AUTH", "GET", "/api/notifications", None, {"page": 1, "limit": 5}),
        ("AUTH", "POST", "/api/notifications/mark-all-read", None, {}),
        ("AUTH", "POST", "/api/notifications/notif_test_read/read", None, {}),
        ("AUTH", "POST", "/api/community/posts", {"title": "Test Post Other", "content": "Test content", "tags": ["test"], "images": []}, None),
        ("AUTH", "POST", "/api/community/posts/not_a_real_post/like", None, {}),
        ("AUTH", "POST", "/api/community/posts/not_a_real_post/comments", {"content": "test comment"}, {}),
        ("AUTH", "DELETE", "/api/community/posts/not_a_real_post", None, {}),
    ]

    # Use auth headers if available; if not, we still call to show missing/invalid behavior.
    for group, method, path, json_body, params in protected_tests:
        status, summary = _call(
            method,
            path,
            headers=auth_headers,
            params=params if params else None,
            json_body=json_body if json_body else None,
        )
        results.append((group, method, path, params if params else None, status, summary))

    # 4) User endpoints (these require user_id as query param; no Authorization header in current backend code).
    #    We only run these if we have uid from register.
    if uid:
        user_tests = [
            ("USER", "GET", "/user/profile", None, {"user_id": uid}),
            ("USER", "PUT", "/user/profile", {"displayName": "Updated Test", "bio": "bio"}, {"user_id": uid}),
            ("USER", "PUT", "/user/avatar", {"avatarUrl": "https://example.com/avatar.png"}, {"user_id": uid}),
        ]
        for group, method, path, body, params in user_tests:
            status, summary = _call(method, path, headers=None, params=params, json_body=body)
            results.append((group, method, path, params, status, summary))

    # 5) Print table
    # Columns: Group | Method | Endpoint | Query/Body | Status | Summary
    print("\n=== API Test Results (excluding /api/diagnosis, treatment, feedback) ===")
    # Build a readable table
    header = ["Group", "Method", "Endpoint", "Params/Body", "Status", "Summary"]
    rows = []
    for group, method, path, q, status, summary in results:
        rows.append([group, method, path, (q if q is not None else ""), str(status), summary])

    # Determine column widths
    widths = [len(h) for h in header]
    for r in rows:
        for i, v in enumerate(r):
            widths[i] = max(widths[i], len(str(v)))

    def fmt_row(values):
        return " | ".join(str(values[i]).ljust(widths[i]) for i in range(len(values)))

    sep = "-+-".join("-" * w for w in widths)
    print(fmt_row(header))
    print(sep)
    for r in rows:
        print(fmt_row(r))


if __name__ == "__main__":
    main()

