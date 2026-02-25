from __future__ import annotations

from datetime import date

import streamlit as st

from lib.app_data import MOCK_KLEIDUNG
from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Dienstkleidung")
st.title("Dienstkleidung")
st.caption("Deine aktuellen Dienstkleidungen und neue Anfragen")

liste = get_item(STORAGE_KEYS["DIENSTKLEIDUNG"], [])
if not liste:
    liste = MOCK_KLEIDUNG

for k in liste:
    st.write(f"- {k.get('artikel')} | Groesse {k.get('groesse')} | {k.get('status')} | {k.get('datum')}")

with st.form("kleidung_form"):
    artikel = st.selectbox("Artikel", ["T-Shirt", "Hose", "Jacke", "Schuhe"])
    groesse = st.text_input("Groesse")
    submit = st.form_submit_button("Anfrage senden")

if submit:
    artikel_label = "T-Shirt blau" if artikel == "T-Shirt" else "Hose dunkelblau" if artikel == "Hose" else artikel
    new_entry = {
        "id": str(int(date.today().strftime("%Y%m%d"))) + str(len(liste) + 1),
        "artikel": artikel_label,
        "groesse": groesse.strip() or "—",
        "status": "Anfrage gestellt",
        "datum": str(date.today()),
    }
    set_item(STORAGE_KEYS["DIENSTKLEIDUNG"], [new_entry, *liste])
    st.success("Anfrage gespeichert.")
    st.rerun()
