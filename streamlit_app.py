import streamlit as st

st.set_page_config(page_title="Ticket-Vbeide Streamlit", page_icon="🎫", layout="wide")

st.title("Ticket-Vbeide (Streamlit)")
st.write("Die Streamlit-Basis ist eingerichtet.")

with st.sidebar:
    st.header("Info")
    st.write("Main file path: streamlit_app.py")

