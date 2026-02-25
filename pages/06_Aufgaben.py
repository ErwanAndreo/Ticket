from __future__ import annotations

from datetime import date

import streamlit as st

from lib.app_data import DEFAULT_TODOS, MOCK_ZUGEWIESEN
from lib.storage import STORAGE_KEYS, get_item, set_item
from lib.ui import setup_page

setup_page("Aufgaben")
st.title("Aufgaben")
st.caption("Eigene Todos und zugewiesene Aufgaben")

st.subheader("Dir zugewiesen")
for a in MOCK_ZUGEWIESEN:
    st.write(f"- {a['titel']} | von {a['von']} | Frist {a['frist']}")

todos = get_item(STORAGE_KEYS["AUFGABEN_TODOS"], [])
if not todos:
    todos = DEFAULT_TODOS

st.subheader("Deine Todos")
for i, todo in enumerate(todos):
    checked = st.checkbox(todo["titel"], value=bool(todo.get("erledigt")), key=f"todo_{todo['id']}_{i}")
    if checked != bool(todo.get("erledigt")):
        todos[i]["erledigt"] = checked
        set_item(STORAGE_KEYS["AUFGABEN_TODOS"], todos)
        st.rerun()

with st.form("todo_add"):
    neu_titel = st.text_input("Neues Todo")
    submit = st.form_submit_button("Hinzufuegen")
if submit and neu_titel.strip():
    next_todos = [*todos, {"id": str(int(date.today().strftime("%Y%m%d"))) + str(len(todos) + 1), "titel": neu_titel.strip(), "erledigt": False}]
    set_item(STORAGE_KEYS["AUFGABEN_TODOS"], next_todos)
    st.success("Todo hinzugefuegt.")
    st.rerun()
