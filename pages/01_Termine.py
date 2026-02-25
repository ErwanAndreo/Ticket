from __future__ import annotations

from datetime import date

import streamlit as st

from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Termine")
st.title("Termine")
st.caption("Buchung Fahrzeuge & Raeume, Zuteilung Absicherung")

absicherung_options = ["BF", "SR", "SAN B", "—"]
termine = get_item(STORAGE_KEYS["TERMINE"], [])

with st.expander("Neuer Termin", expanded=False):
    col1, col2 = st.columns(2)
    with col1:
        titel = st.text_input("Titel")
        datum = st.date_input("Datum", value=date.today())
        ressourcen_typ = st.selectbox("Art", ["fahrzeug", "raum"])
    with col2:
        uhrzeit = st.text_input("Uhrzeit", placeholder="08:00")
        ressource = st.text_input("Ressource", placeholder="z.B. MTW 1")
        absicherung = st.selectbox("Absicherung", absicherung_options)
    if st.button("Termin anlegen"):
        if titel:
            next_termine = list(termine)
            next_termine.append(
                {
                    "id": str(int(date.today().strftime("%Y%m%d"))) + str(len(termine) + 1),
                    "titel": titel,
                    "datum": str(datum),
                    "uhrzeit": uhrzeit,
                    "ressourcenTyp": ressourcen_typ,
                    "ressource": ressource,
                    "absicherung": absicherung,
                }
            )
            set_item(STORAGE_KEYS["TERMINE"], next_termine)
            st.success("Termin gespeichert.")
            st.rerun()
        else:
            st.warning("Titel ist erforderlich.")

if not termine:
    st.info("Noch keine Termine.")
else:
    sorted_termine = sorted(termine, key=lambda t: (t.get("datum", ""), t.get("uhrzeit", "")))
    for t in sorted_termine:
        st.write(
            f"- **{t.get('titel', 'Termin')}** | {t.get('datum', '')} {t.get('uhrzeit', '')} | "
            f"{t.get('ressourcenTyp', '')}: {t.get('ressource', '—')} | Absicherung: {t.get('absicherung', '—')}"
        )
