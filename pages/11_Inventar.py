from __future__ import annotations

import streamlit as st

from lib.app_data import MOCK_ARTIKEL
from lib.auth import has_permission
from lib.ui import setup_page

setup_page("Inventar")
st.title("Inventar")

if not has_permission("inventar"):
    st.error("Sie haben keine Berechtigung fuer den Zugriff auf das Inventar.")
    st.stop()

kategorie = st.selectbox("Kategorie", ["SAN", "Technik", "Verpflegung"])
tab = st.radio("Ansicht", ["Ueberblick", "Fehlen", "Zustand einscannen"], horizontal=True)

filtered = [a for a in MOCK_ARTIKEL if a["kategorie"] == kategorie]
fehlend = [a for a in filtered if a["ist"] < a["soll"]]

if tab == "Ueberblick":
    st.table(filtered)
elif tab == "Fehlen":
    if not fehlend:
        st.success("Keine Fehlbestaende in der Kategorie.")
    for a in fehlend:
        st.warning(f"{a['name']} fehlt: {a['soll'] - a['ist']}")
else:
    barcode = st.text_input("Barcode/QR")
    zustand = st.selectbox("Zustand", ["gut", "beschaedigt", "defekt"])
    if st.button("Speichern"):
        st.info(f"Scan gespeichert: {barcode or 'ohne Code'} -> {zustand} (Backend folgt)")
