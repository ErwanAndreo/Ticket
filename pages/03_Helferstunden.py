from __future__ import annotations

from datetime import date

import streamlit as st

from lib.app_data import MOCK_STUNDEN
from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Helferstunden")
st.title("Helferstunden")
st.caption("Automatisch bei Veranstaltungen, manuell bei eigenen Terminen")

stunden = get_item(STORAGE_KEYS["HELFERSTUNDEN"], [])
if not stunden:
    stunden = MOCK_STUNDEN

filter_projekt = st.selectbox("Projekt", ["Alle", "Einsatz", "Ausbildung", "Johanni"])
if filter_projekt != "Alle":
    stunden = [s for s in stunden if s.get("projekt") == filter_projekt]

for s in stunden:
    st.write(f"- {s.get('taetigkeit')} | {s.get('datum')} | {s.get('dauer')} h | {s.get('projekt')}")

with st.form("helferstunden_add"):
    st.subheader("Helferstunde erfassen")
    datum = st.date_input("Datum", value=date.today())
    dauer = st.number_input("Dauer (h)", min_value=0.5, step=0.5, value=2.0)
    taetigkeit = st.text_input("Taetigkeit")
    projekt = st.selectbox("Projekt", ["Einsatz", "Ausbildung", "Johanni"], key="projekt_add")
    submitted = st.form_submit_button("Speichern")
    if submitted:
        all_entries = get_item(STORAGE_KEYS["HELFERSTUNDEN"], []) or MOCK_STUNDEN
        all_entries = [
            {
                "id": str(int(date.today().strftime("%Y%m%d"))) + str(len(all_entries) + 1),
                "datum": str(datum),
                "dauer": float(dauer),
                "taetigkeit": taetigkeit or "—",
                "projekt": projekt,
            },
            *all_entries,
        ]
        set_item(STORAGE_KEYS["HELFERSTUNDEN"], all_entries)
        st.success("Gespeichert.")
        st.rerun()
