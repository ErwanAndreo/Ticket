from __future__ import annotations

import streamlit as st

from lib.auth import get_current_user, save_user
from lib.ui import setup_page

setup_page("Profil")
st.title("Profil")
st.caption("Daten ein-/ausblenden und bearbeiten")

user = get_current_user()
visible = user.get("visible", {"name": True, "email": True, "telefon": True})

st.subheader("Sichtbarkeit fuer alle")
name_visible = st.checkbox("Name anzeigen", value=bool(visible.get("name", True)))
email_visible = st.checkbox("E-Mail anzeigen", value=bool(visible.get("email", True)))
telefon_visible = st.checkbox("Telefon anzeigen", value=bool(visible.get("telefon", True)))

st.subheader("Daten bearbeiten")
st.write("Name (aus AD):", user.get("displayName"))
st.write("E-Mail (aus AD):", user.get("email"))
telefon = st.text_input("Telefon", value=user.get("telefon") or "")
notfall = st.text_input("Notfallkontakt", value=user.get("notfall") or "")

if st.button("Speichern"):
    save_user(
        {
            "telefon": telefon or None,
            "notfall": notfall or None,
            "visible": {"name": name_visible, "email": email_visible, "telefon": telefon_visible},
        }
    )
    st.success("Gespeichert.")
