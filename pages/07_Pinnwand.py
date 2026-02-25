from __future__ import annotations

import streamlit as st

from lib.app_data import DEFAULT_PINNWAND_AUFGABEN, MOCK_NEWS
from lib.auth import get_current_user
from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Pinnwand")
st.title("Pinnwand")

st.subheader("News")
for n in MOCK_NEWS:
    st.write(f"- **{n['titel']}** ({n['datum']}) - {n['text']}")

user = get_current_user()
aufgaben = get_item(STORAGE_KEYS["PINNWAND_AUFGABEN"], [])
if not aufgaben:
    aufgaben = DEFAULT_PINNWAND_AUFGABEN

st.subheader("Aufgaben")
for idx, a in enumerate(aufgaben):
    owner = a.get("uebernommenVon")
    st.write(f"**{a.get('titel')}** - {a.get('beschreibung')}")
    st.caption(f"Status: {owner if owner else 'Noch niemand'}")
    col1, col2 = st.columns(2)
    with col1:
        if not owner and st.button("Uebernehmen", key=f"take_{idx}"):
            aufgaben[idx]["uebernommenVon"] = user.get("displayName")
            set_item(STORAGE_KEYS["PINNWAND_AUFGABEN"], aufgaben)
            st.rerun()
    with col2:
        if owner == user.get("displayName") and st.button("Abgeben", key=f"drop_{idx}"):
            aufgaben[idx]["uebernommenVon"] = None
            set_item(STORAGE_KEYS["PINNWAND_AUFGABEN"], aufgaben)
            st.rerun()
