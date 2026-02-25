import streamlit as st
from lib.app_data import AUTO_SHORTCUTS, DEFAULT_SHORTCUTS, MOCK_TERMINE, MODULES_GRID
from lib.auth import get_current_user
from lib.storage import STORAGE_KEYS, get_item
from lib.ui import setup_page

setup_page("Dashboard")
user = get_current_user()

st.title("Hallo " + user.get("displayName", "User"))
st.caption("Willkommen im Ticket V-Beide. Waehle einen Bereich oder nutze die Suche.")

query = st.text_input("Suche", placeholder="Suchen...")
if query:
    st.info("Suche nach: " + query)

custom_shortcuts = get_item(STORAGE_KEYS["SHORTCUTS"], [])
if not custom_shortcuts:
    custom_shortcuts = DEFAULT_SHORTCUTS

st.subheader("Shortcuts")
shortcut_labels = [s["label"] for s in AUTO_SHORTCUTS] + [s["label"] for s in custom_shortcuts]
st.write(" | ".join(shortcut_labels))

st.subheader("Bereiche")
cols = st.columns(3)
for idx, item in enumerate(MODULES_GRID):
    with cols[idx % 3]:
        st.markdown(f"**{item['icon']} {item['label']}**")
        st.caption(item["desc"])

st.subheader("Naechste Termine")
termine = get_item(STORAGE_KEYS["TERMINE"], [])
if not termine:
    termine = MOCK_TERMINE

for t in termine[:5]:
    title = t.get("titel", t.get("title", "Termin"))
    date = t.get("datum", t.get("date", ""))
    time = t.get("uhrzeit", t.get("time", ""))
    st.write(f"- {title} ({date} {time})")

