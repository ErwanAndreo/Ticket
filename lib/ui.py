from __future__ import annotations

import streamlit as st

APP_TITLE = "Ticket-Vbeide"


def setup_page(title: str) -> None:
    st.set_page_config(page_title=f"{title} - {APP_TITLE}", page_icon="🎫", layout="wide")
    with st.sidebar:
        st.header("Ticket-Vbeide")
        st.caption("Reine Streamlit-Version")
        # On some Streamlit Cloud setups, linking the main script via st.page_link
        # raises a KeyError. A plain root link is stable across environments.
        st.markdown("[Dashboard](/)")
        st.page_link("pages/01_Termine.py", label="Termine")
        st.page_link("pages/02_Kalender.py", label="Kalender")
        st.page_link("pages/03_Helferstunden.py", label="Helferstunden")
        st.page_link("pages/04_Antraege.py", label="Antraege")
        st.page_link("pages/05_Schaden_melden.py", label="Schaden melden")
        st.page_link("pages/06_Aufgaben.py", label="Aufgaben")
        st.page_link("pages/07_Pinnwand.py", label="Pinnwand")
        st.page_link("pages/08_Dienstkleidung.py", label="Dienstkleidung")
        st.page_link("pages/09_Profil.py", label="Profil")
        st.page_link("pages/10_Einstellungen.py", label="Einstellungen")
        st.page_link("pages/11_Inventar.py", label="Inventar")
        st.page_link("pages/12_Termin_Detail.py", label="Termin Detail")
        st.page_link("pages/13_Antrag_Detail.py", label="Antrag Detail")
        st.page_link("pages/14_Tickets.py", label="Tickets")
        st.page_link("pages/15_Verantwortliche.py", label="Verantwortliche")
        st.page_link("pages/16_Wachbuch.py", label="Wachbuch")
        st.page_link("pages/17_Dokumente.py", label="Dokumente")
        st.page_link("pages/18_Fahrzeuge.py", label="Fahrzeuge")
        st.page_link("pages/19_Personal.py", label="Personal")
        st.page_link("pages/20_Ausbildung.py", label="Ausbildung")
        st.page_link("pages/21_Mitglieder.py", label="Mitglieder")
        st.page_link("pages/22_Infos.py", label="Infos")
        st.page_link("pages/23_IT.py", label="IT")
        st.page_link("pages/24_Johanni.py", label="Johanni")
        st.page_link("pages/25_Auftraege.py", label="Auftraege")
        st.page_link("pages/26_Haussteuerung.py", label="Haussteuerung")
        st.page_link("pages/27_Suche.py", label="Suche")
        st.page_link("pages/28_Abmelden.py", label="Abmelden")


def placeholder_page(title: str, description: str) -> None:
    st.title(title)
    st.info(description)
