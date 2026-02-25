import streamlit as st

from lib.ui import setup_page

setup_page("Suche")
st.title("Suche")
q = st.text_input("Suchbegriff")
if q:
    st.info(f"Suchergebnis fuer '{q}' wird spaeter erweitert.")
