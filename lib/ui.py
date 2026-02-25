from __future__ import annotations

import streamlit as st

APP_TITLE = "Ticket-Vbeide"


def setup_page(title: str) -> None:
    st.set_page_config(page_title=f"{title} - {APP_TITLE}", page_icon="🎫", layout="wide")
    with st.sidebar:
        st.header("Ticket-Vbeide")
        st.caption("UI helper module")


def placeholder_page(title: str, description: str) -> None:
    st.title(title)
    st.info(description)
