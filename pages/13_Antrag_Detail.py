from __future__ import annotations

import streamlit as st

from lib.app_data import MOCK_ANTRAEGE
from lib.storage import STORAGE_KEYS, get_item
from lib.ui import setup_page

setup_page("Antrag Detail")
st.title("Antrag Detail")

stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
all_antraege = [*stored, *MOCK_ANTRAEGE]

if not all_antraege:
    st.info("Keine Antraege vorhanden.")
    st.stop()

options = {f"{a.get('id')} - {a.get('titel')}": a for a in all_antraege}
selected = st.selectbox("Antrag auswaehlen", list(options.keys()))
a = options[selected]

st.subheader(a.get("titel", "Antrag"))
st.write(f"{a.get('kategorie', '')} | {a.get('status', '')} | {a.get('datum', '')}")
st.write(a.get("beschreibung", "—"))
