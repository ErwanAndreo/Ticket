import os
import shutil
import socket
import subprocess
import time
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

APP_TITLE = "Ticket-Vbeide (Streamlit)"
DEFAULT_NEXT_PORT = int(os.environ.get("NEXT_PORT", "3000"))
DEFAULT_NEXT_URL = os.environ.get("NEXTJS_URL", f"http://localhost:{DEFAULT_NEXT_PORT}")


def is_port_open(host: str, port: int, timeout: float = 0.5) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        return sock.connect_ex((host, port)) == 0


def wait_for_nextjs(host: str, port: int, timeout_seconds: int = 35) -> bool:
    start = time.time()
    while time.time() - start < timeout_seconds:
        if is_port_open(host, port):
            return True
        time.sleep(1)
    return False


def ensure_nextjs_running(project_dir: Path, port: int) -> tuple[bool, str]:
    if is_port_open("127.0.0.1", port):
        return True, f"Next.js laeuft bereits auf Port {port}."

    npm_bin = shutil.which("npm")
    if not npm_bin:
        return False, "Node/NPM nicht gefunden. Next.js kann nicht automatisch gestartet werden."

    node_modules_dir = project_dir / "node_modules"
    if not node_modules_dir.exists():
        install_result = subprocess.run(
            [npm_bin, "install"],
            cwd=str(project_dir),
            capture_output=True,
            text=True,
            check=False,
        )
        if install_result.returncode != 0:
            return False, (
                "npm install ist fehlgeschlagen.\n\n"
                f"{install_result.stderr[-600:] or install_result.stdout[-600:]}"
            )

    try:
        process = subprocess.Popen(
            [npm_bin, "run", "dev", "--", "--hostname", "0.0.0.0", "--port", str(port)],
            cwd=str(project_dir),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        st.session_state["next_pid"] = process.pid
    except Exception as exc:
        return False, f"Fehler beim Start von Next.js: {exc}"

    if wait_for_nextjs("127.0.0.1", port):
        return True, f"Next.js wurde automatisch auf Port {port} gestartet."

    return False, "Next.js wurde gestartet, aber war innerhalb von 35 Sekunden nicht erreichbar."


st.set_page_config(page_title="Ticket-Vbeide Streamlit", page_icon="T", layout="wide")
st.title(APP_TITLE)
st.caption("Streamlit zeigt hier die bestehende Next.js-App aus diesem Ordner an.")

project_root = Path(__file__).resolve().parent
next_port = DEFAULT_NEXT_PORT
next_url = DEFAULT_NEXT_URL

with st.sidebar:
    st.header("App-Bruecke")
    st.write("Main file path: streamlit_app.py")
    st.write(f"Next.js URL: `{next_url}`")
    if st.button("Neu laden"):
        st.rerun()

ok, message = ensure_nextjs_running(project_root, next_port)
if ok:
    st.success(message)
    components.iframe(src=next_url, height=900, scrolling=True)
else:
    st.error(message)
    st.info(
        "Falls dein Hosting kein Node unterstuetzt, deploye die Next.js-App separat "
        "und setze die URL ueber die Umgebungsvariable NEXTJS_URL."
    )
    st.code(
        "NEXTJS_URL=https://deine-next-app.example.com\nNEXT_PORT=3000",
        language="bash",
    )

