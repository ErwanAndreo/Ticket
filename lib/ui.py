from __future__ import annotations

import streamlit as st

APP_TITLE = "Ticket-Vbeide"


def setup_page(title: str) -> None:
    st.set_page_config(page_title=f"{title} - {APP_TITLE}", page_icon="🎫", layout="wide")
    with st.sidebar:
        st.header("Ticket-Vbeide")
        st.caption("Reine Streamlit-Version")
        st.markdown("[Dashboard](/)")
        st.markdown("### Navigation")
        st.markdown("- Termine")
        st.markdown("- Kalender")
        st.markdown("- Helferstunden")
        st.markdown("- Antraege")
        st.markdown("- Schaden melden")
        st.markdown("- Aufgaben")
        st.markdown("- Pinnwand")
        st.markdown("- Dienstkleidung")
        st.markdown("- Profil")
        st.markdown("- Einstellungen")
        st.markdown("- Inventar")
        st.markdown("- Termin Detail")
        st.markdown("- Antrag Detail")
        st.markdown("- Tickets")
        st.markdown("- Verantwortliche")
        st.markdown("- Wachbuch")
        st.markdown("- Dokumente")
        st.markdown("- Fahrzeuge")
        st.markdown("- Personal")
        st.markdown("- Ausbildung")
        st.markdown("- Mitglieder")
        st.markdown("- Infos")
        st.markdown("- IT")
        st.markdown("- Johanni")
        st.markdown("- Auftraege")
        st.markdown("- Haussteuerung")
        st.markdown("- Suche")
        st.markdown("- Abmelden")
        st.caption("Nutze die Standard-Seitenleiste von Streamlit links oben fuer Seitenwechsel.")


def placeholder_page(title: str, description: str) -> None:
    st.title(title)
    st.info(description)
