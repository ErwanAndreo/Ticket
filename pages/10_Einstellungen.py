from __future__ import annotations

import streamlit as st

from lib.app_data import DEFAULT_SHORTCUTS
from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Einstellungen")
st.title("Einstellungen")

shortcuts = get_item(STORAGE_KEYS["SHORTCUTS"], [])
if not shortcuts:
    shortcuts = DEFAULT_SHORTCUTS

st.subheader("Shortcuts")
for idx, s in enumerate(shortcuts):
    col1, col2, col3 = st.columns([3, 3, 1])
    with col1:
        st.write(s.get("label", ""))
    with col2:
        st.caption(s.get("href", ""))
    with col3:
        if st.button("X", key=f"remove_{idx}"):
            next_shortcuts = [x for i, x in enumerate(shortcuts) if i != idx]
            set_item(STORAGE_KEYS["SHORTCUTS"], next_shortcuts)
            st.rerun()

with st.form("shortcut_form"):
    new_href = st.text_input("Link (z. B. /termine oder https://...)")
    new_label = st.text_input("Anzeigename")
    submitted = st.form_submit_button("Shortcut hinzufuegen")

if submitted and new_href.strip():
    href = new_href.strip()
    if not href.startswith("/") and not href.startswith("http"):
        href = "/" + href
    label = new_label.strip() or href
    set_item(STORAGE_KEYS["SHORTCUTS"], [*shortcuts, {"href": href, "label": label}])
    st.success("Shortcut hinzugefuegt.")
    st.rerun()
