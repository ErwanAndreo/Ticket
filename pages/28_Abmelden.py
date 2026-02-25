import streamlit as st

from lib.storage import STORAGE_KEYS, set_item
from lib.ui import setup_page

setup_page("Abmelden")
st.title("Abmelden")
st.caption("Session lokal zuruecksetzen.")

if st.button("Profil auf Mock zuruecksetzen"):
    set_item(STORAGE_KEYS["USER"], {})
    st.success("Profil wurde zurueckgesetzt.")
