from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

PREFIX = "ticket-vbeide-"

STORAGE_KEYS = {
    "USER": PREFIX + "user",
    "HELFERSTUNDEN": PREFIX + "helferstunden",
    "SHORTCUTS": PREFIX + "shortcuts",
    "AUFGABEN_TODOS": PREFIX + "aufgaben-todos",
    "PINNWAND_AUFGABEN": PREFIX + "pinnwand-aufgaben",
    "DIENSTKLEIDUNG": PREFIX + "dienstkleidung",
    "ANTRAEGE": PREFIX + "antraege",
    "TERMINE": PREFIX + "termine",
    "TICKETS": PREFIX + "tickets",
    "VERANTWORTLICHE": PREFIX + "verantwortliche",
    "WACHBUCH": PREFIX + "wachbuch",
    "FAHRZEUGE": PREFIX + "fahrzeuge",
    "PROFIL": PREFIX + "profil",
    "DOKUMENTE": PREFIX + "dokumente",
}

_APP_DIR = Path(__file__).resolve().parent.parent
_DATA_DIR = _APP_DIR / ".streamlit_data"
_STORAGE_FILE = _DATA_DIR / "storage.json"


def _ensure_storage_file() -> None:
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not _STORAGE_FILE.exists():
        _STORAGE_FILE.write_text("{}", encoding="utf-8")


def _read_all() -> dict[str, Any]:
    _ensure_storage_file()
    try:
        raw = _STORAGE_FILE.read_text(encoding="utf-8")
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {}


def _write_all(data: dict[str, Any]) -> None:
    _ensure_storage_file()
    _STORAGE_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def get_item(key: str, default: Any) -> Any:
    data = _read_all()
    return data.get(key, default)


def set_item(key: str, value: Any) -> None:
    data = _read_all()
    data[key] = value
    _write_all(data)


def next_id() -> str:
    # Aligns with the Date.now()-style IDs used in Next.js pages.
    return str(int(time.time() * 1000))
