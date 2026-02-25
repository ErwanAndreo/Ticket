from __future__ import annotations

from typing import Any

from lib.storage import STORAGE_KEYS, get_item, set_item

MOCK_USER: dict[str, Any] = {
    "id": "1",
    "displayName": "Max Mustermann",
    "email": "max@example.org",
    "avatarUrl": None,
    "roles": ["helfer"],
    "visible": {"name": True, "email": True, "telefon": True},
}


def get_current_user() -> dict[str, Any]:
    stored = get_item(STORAGE_KEYS["USER"], {})
    if not isinstance(stored, dict):
        stored = {}
    merged = {**MOCK_USER, **stored}
    merged["displayName"] = stored.get("displayName", MOCK_USER["displayName"])
    merged["email"] = stored.get("email", MOCK_USER["email"])
    merged["id"] = stored.get("id", MOCK_USER["id"])
    merged["roles"] = stored.get("roles", MOCK_USER["roles"])
    merged["visible"] = stored.get("visible", MOCK_USER["visible"])
    return merged


def save_user(updates: dict[str, Any]) -> None:
    current = get_current_user()
    merged = {**current, **updates}
    if "visible" not in merged or merged["visible"] is None:
        merged["visible"] = {"name": True, "email": True, "telefon": True}
    set_item(STORAGE_KEYS["USER"], merged)


def has_permission(permission: str) -> bool:
    user = get_current_user()
    roles = user.get("roles", [])
    if permission == "inventar":
        return "inventar" in roles or "admin" in roles
    return True
