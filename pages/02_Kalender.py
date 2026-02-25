from __future__ import annotations

import streamlit as st

from lib.storage import STORAGE_KEYS, get_item
from lib.ui import setup_page

setup_page("Kalender")
st.title("Terminkalender")
st.caption("Fahrzeuge und Raeume im Kalender")

termine = get_item(STORAGE_KEYS["TERMINE"], [])
gruppiert: dict[str, list[dict]] = {}
for t in termine:
    datum = t.get("datum", "")
    if not datum:
        continue
    gruppiert.setdefault(datum, []).append(t)

if not gruppiert:
    st.info("Noch keine Termine angelegt.")
else:
    for datum in sorted(gruppiert.keys()):
        st.subheader(datum)
        for t in gruppiert[datum]:
            st.write(
                f"- {t.get('titel', 'Termin')} | {t.get('uhrzeit', '')} | "
                f"{t.get('ressourcenTyp', '')}: {t.get('ressource', '—')} | Absicherung: {t.get('absicherung', '—')}"
            )
