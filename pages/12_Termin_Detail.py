from __future__ import annotations

import streamlit as st

from lib.app_data import MOCK_TERMIN_DETAIL
from lib.storage import STORAGE_KEYS, get_item
from lib.ui import setup_page

setup_page("Termin Detail")
st.title("Termin Detail")

options = sorted(MOCK_TERMIN_DETAIL.keys())
selected_id = st.selectbox("Termin-ID", options=options, index=0)

termin = dict(MOCK_TERMIN_DETAIL.get(selected_id, {}))
local_termine = get_item(STORAGE_KEYS["TERMINE"], [])
for t in local_termine:
    if t.get("id") == selected_id:
        termin = {
            "title": t.get("titel", "Termin"),
            "date": t.get("datum", ""),
            "time": t.get("uhrzeit", ""),
            "ort": t.get("ressource", "—"),
            "besetzung": [],
            "fahrzeuge": [t.get("ressource")] if t.get("ressourcenTyp") == "fahrzeug" and t.get("ressource") else [],
        }
        break

if not termin:
    st.error("Termin nicht gefunden.")
    st.stop()

st.subheader(termin.get("title", "Termin"))
st.write(f"{termin.get('date', '')} {termin.get('time', '')} | {termin.get('ort', '')}")
st.markdown("**Besetzung**")
for b in termin.get("besetzung", []):
    st.write(f"- {b.get('name')} ({b.get('rolle')})")
if not termin.get("besetzung"):
    st.caption("Keine Besetzung eingetragen.")

st.markdown("**Fahrzeuge**")
for f in termin.get("fahrzeuge", []):
    st.write(f"- {f}")
if not termin.get("fahrzeuge"):
    st.caption("Keine Fahrzeuge zugewiesen.")
