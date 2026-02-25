from __future__ import annotations

import streamlit as st

from lib.app_data import MOCK_ANTRAEGE
from lib.storage import STORAGE_KEYS, get_item
from lib.ui import setup_page

setup_page("Antraege")
st.title("Antraege")

kategorien = ["Alle", "Schaden melden", "Urlaub", "Material", "Sonstiges"]
search = st.text_input("Antraege durchsuchen")
kategorie = st.selectbox("Kategorie", kategorien)

stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
all_antraege = [*stored, *MOCK_ANTRAEGE]

filtered = []
for a in all_antraege:
    if kategorie != "Alle" and a.get("kategorie") != kategorie:
        continue
    if search and search.lower() not in a.get("titel", "").lower():
        continue
    filtered.append(a)

if not filtered:
    st.info("Keine Antraege gefunden.")
else:
    for a in filtered:
        st.write(
            f"- **{a.get('titel', 'Antrag')}** | {a.get('kategorie', '')} | "
            f"{a.get('status', '')} | {a.get('datum', '')} | ID: `{a.get('id', '')}`"
        )

st.page_link("pages/05_Schaden_melden.py", label="Schaden melden")
st.page_link("pages/13_Antrag_Detail.py", label="Antrag-Details anzeigen")
