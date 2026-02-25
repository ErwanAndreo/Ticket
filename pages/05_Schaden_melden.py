from __future__ import annotations

from datetime import date

import streamlit as st

from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Schaden melden")
st.title("Schaden melden")

with st.form("schaden_form"):
    kurzbeschreibung = st.text_input("Kurzbeschreibung")
    ort = st.text_input("Ort / betroffener Bereich")
    beschreibung = st.text_area("Beschreibung")
    sent = st.form_submit_button("Schaden melden")

if sent:
    stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
    new_entry = {
        "id": str(int(date.today().strftime("%Y%m%d"))) + str(len(stored) + 1),
        "typ": "Schaden",
        "titel": kurzbeschreibung.strip(),
        "kategorie": "Schaden melden",
        "status": "Eingereicht",
        "datum": str(date.today()),
        "ort": ort.strip() or None,
        "beschreibung": beschreibung.strip() or None,
    }
    set_item(STORAGE_KEYS["ANTRAEGE"], [new_entry, *stored])
    st.success("Meldung wurde abgeschickt.")
    st.page_link("pages/04_Antraege.py", label="Zu den Antraegen")
