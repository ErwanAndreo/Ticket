from __future__ import annotations

import os
from collections import defaultdict
from datetime import date
from typing import Any

import streamlit as st

from lib.app_data import (
    AUTO_SHORTCUTS,
    DEFAULT_PINNWAND_AUFGABEN,
    DEFAULT_SHORTCUTS,
    DEFAULT_TODOS,
    MOCK_ANTRAEGE,
    MOCK_ARTIKEL,
    MOCK_KLEIDUNG,
    MOCK_NEWS,
    MOCK_STUNDEN,
    MOCK_TERMINE,
    MOCK_TERMIN_DETAIL,
    MOCK_ZUGEWIESEN,
    MODULES_GRID,
)
from lib.auth import get_current_user, has_permission, save_user
from lib.storage import STORAGE_KEYS, get_item, next_id, set_item

st.set_page_config(page_title="Ticket-Vbeide", page_icon="🎫", layout="wide")

NAV_ICONS = {
    "Dashboard": "⌂",
    "Termine": "📅",
    "Termin Detail": "📌",
    "Personalakten": "👤",
    "Fahrzeuge": "🚐",
    "Ticketsystem": "🎫",
    "Verantwortliche": "📋",
    "Helferstunden": "⏱",
    "Wachbuch": "📖",
    "Antraege": "📝",
    "Antrag Detail": "📄",
    "Schaden melden": "🚨",
    "Dienstkleidung": "👕",
    "Aufgaben": "✓",
    "Pinnwand": "📌",
    "Mitglieder": "👥",
    "Kalender": "🗓",
    "Ausbildung": "🎓",
    "Haussteuerung": "🏠",
    "Inventar": "📦",
    "Dokumente": "📁",
    "Johanni": "🌟",
    "IT": "💻",
    "Auftraege": "🧾",
    "Einstellungen": "⚙️",
    "Profil": "🙍",
    "Abmelden": "↩",
}

ROUTE_LABELS = {
    "Dashboard": "Dashboard",
    "Termine": "Termine",
    "Personalakten": "Personalakten",
    "Fahrzeuge": "Fahrzeuge",
    "Ticketsystem": "Ticketsystem",
    "Helferstunden": "Helferstunden",
    "Wachbuch": "Wachbuch",
    "Antraege": "Anträge",
    "Dienstkleidung": "Dienstkleidung",
    "Aufgaben": "Aufgaben",
    "Pinnwand": "Pinnwand",
    "Mitglieder": "Mitglieder",
    "Kalender": "Kalender",
    "Ausbildung": "Ausbildung",
    "Haussteuerung": "Haussteuerung",
    "Inventar": "Inventar",
    "Dokumente": "Dokumente",
    "Johanni": "Johanni",
    "Auftraege": "Aufträge",
    "Verantwortliche": "Verantwortliche",
    "IT": "IT",
}


def inject_vmoritz_theme() -> None:
    st.markdown(
        """
<style>
    :root {
        --vm-bg: #0b1220;
        --vm-fg: #e2e8f0;
        --vm-primary: #0ea5e9;
        --vm-muted: #94a3b8;
        --vm-border: #334155;
        --vm-card: #111b2e;
        --vm-sidebar: #020617;
        --vm-sidebar-fg: #cbd5e1;
    }
    .stApp {
        background: var(--vm-bg);
        color: var(--vm-fg);
    }
    .block-container {
        background: transparent;
    }
    [data-testid="stSidebar"] {
        background: var(--vm-sidebar);
        border-right: 1px solid #1e293b;
    }
    [data-testid="stSidebar"] * {
        color: var(--vm-sidebar-fg) !important;
    }
    [data-testid="stSidebar"] [data-testid="stButton"] > button {
        border-radius: 10px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--vm-sidebar-fg) !important;
        font-weight: 600;
        text-align: left;
        justify-content: flex-start;
        padding: 0.5rem 0.75rem;
    }
    [data-testid="stSidebar"] [data-testid="stButton"] > button:hover {
        background: rgba(255, 255, 255, 0.09);
    }
    [data-testid="stSidebar"] [data-testid="stButton"] > button[kind="primary"] {
        background: var(--vm-primary);
        color: #ffffff !important;
    }
    [data-testid="stButton"] > button {
        border-radius: 10px;
        border: 1px solid var(--vm-border);
    }
    div[data-testid="stVerticalBlock"] div[data-testid="stVerticalBlockBorderWrapper"] {
        border: 1px solid var(--vm-border);
        border-radius: 12px;
        background: var(--vm-card);
    }
    [data-testid="stForm"], [data-testid="stExpander"], [data-testid="stPopover"] > div {
        background: var(--vm-card);
        border: 1px solid var(--vm-border);
        border-radius: 12px;
    }
    [data-baseweb="input"] > div,
    [data-baseweb="select"] > div,
    textarea,
    input {
        background: #0f172a !important;
        color: var(--vm-fg) !important;
        border-color: var(--vm-border) !important;
    }
    [data-testid="stDataFrame"], table {
        background: var(--vm-card) !important;
        color: var(--vm-fg) !important;
    }
    [data-testid="stMarkdownContainer"] p,
    [data-testid="stMarkdownContainer"] li,
    [data-testid="stCaptionContainer"] {
        color: var(--vm-fg);
    }
    .vm-section-title {
        margin-top: 0.2rem;
        margin-bottom: 0.7rem;
        color: var(--vm-fg);
        font-weight: 700;
    }
</style>
        """,
        unsafe_allow_html=True,
    )

ROUTES = [
    "Dashboard",
    "Johanni",
    "Termine",
    "Personalakten",
    "Fahrzeuge",
    "Ticketsystem",
    "Helferstunden",
    "Wachbuch",
    "Antraege",
    "Dienstkleidung",
    "Aufgaben",
    "Pinnwand",
    "Mitglieder",
    "Kalender",
    "Ausbildung",
    "Haussteuerung",
    "Inventar",
    "Dokumente",
    "Auftraege",
    "Verantwortliche",
    "IT",
]

HREF_TO_ROUTE = {
    "/": "Dashboard",
    "/termine": "Termine",
    "/personal": "Personalakten",
    "/fahrzeuge": "Fahrzeuge",
    "/tickets": "Ticketsystem",
    "/verantwortliche": "Verantwortliche",
    "/helferstunden": "Helferstunden",
    "/wachbuch": "Wachbuch",
    "/antraege": "Antraege",
    "/antraege/schaden-melden": "Schaden melden",
    "/dienstkleidung": "Dienstkleidung",
    "/aufgaben": "Aufgaben",
    "/pinnwand": "Pinnwand",
    "/mitglieder": "Mitglieder",
    "/kalender": "Kalender",
    "/ausbildung": "Ausbildung",
    "/haussteuerung": "Haussteuerung",
    "/inventar": "Inventar",
    "/dokumente": "Dokumente",
    "/johanni": "Johanni",
    "/infos": "Verantwortliche",
    "/it": "IT",
    "/auftraege": "Auftraege",
    "/einstellungen": "Einstellungen",
    "/profil": "Profil",
    "/abmelden": "Abmelden",
}

MITGLIEDER = [
    {"id": "1", "name": "Max Mustermann", "email": "max@example.org", "bereich": "SAN"},
    {"id": "2", "name": "Anna Schmidt", "email": "anna@example.org", "bereich": "Technik"},
    {"id": "3", "name": "Tom Weber", "email": "tom@example.org", "bereich": "SAN"},
    {"id": "4", "name": "Lisa Mueller", "email": "lisa@example.org", "bereich": "Verpflegung"},
]
ABSCHLUESSE = [
    {"id": "1", "name": "Erste-Hilfe-Grundkurs", "datum": "2024-06-01"},
    {"id": "2", "name": "SAN-Grundausbildung", "datum": "2024-09-15"},
]
VERFUEGBARE_KURSE = [
    {"id": "3", "name": "SAN-Aufbau", "kategorie": "SAN"},
    {"id": "4", "name": "Fahrer RTW", "kategorie": "Fahrzeug"},
    {"id": "5", "name": "Technik Einfuehrung", "kategorie": "Technik"},
]
AUSBILDUNG_BAUM = [
    {"label": "SAN", "children": ["SAN-Grundausbildung", "SAN-Aufbau"]},
    {"label": "Fahrzeug", "children": ["Fahrer KTW", "Fahrer RTW"]},
    {"label": "Technik", "children": ["Technik Einfuehrung"]},
]
INFOS_ANSPRECHPARTNER = [
    {"kategorie": "Erste Hilfe", "name": "Anna Schmidt", "email": "anna@example.org", "telefon": "+49 123 456"},
    {"kategorie": "Technik", "name": "Tom Weber", "email": "tom@example.org", "telefon": "+49 123 457"},
    {"kategorie": "Verpflegung", "name": "Lisa Mueller", "email": "lisa@example.org", "telefon": "+49 123 458"},
]
JOHANNI_ANSPRECHPARTNER = [
    {"bereich": "Leitung", "name": "Max Mustermann", "email": "max@example.org"},
    {"bereich": "SAN", "name": "Anna Schmidt", "email": "anna@example.org"},
    {"bereich": "Technik", "name": "Tom Weber", "email": "tom@example.org"},
]
TICKET_TYPEN = [
    ("lehrgang", "Anfrage Lehrgang / Ausbildung (z.B. EH, SAN A)"),
    ("stoerung", "Stoermeldung / Beschaedigung (auch anonym meldbar)"),
]


def goto(route: str, **params: Any) -> None:
    st.session_state["route"] = route
    st.session_state["route_params"] = params
    st.rerun()


def route_param(name: str, default: Any = None) -> Any:
    return st.session_state.get("route_params", {}).get(name, default)


def ensure_list(key: str, default: list[dict[str, Any]]) -> list[dict[str, Any]]:
    stored = get_item(key, [])
    if isinstance(stored, list) and len(stored) > 0:
        return stored
    return list(default)


def render_shortcut(label: str, href: str, key: str) -> None:
    route = HREF_TO_ROUTE.get(href)
    if href.startswith("http"):
        st.link_button(label, href, use_container_width=True)
        return
    if route:
        if st.button(label, key=key, use_container_width=True):
            goto(route)
    else:
        st.caption(label + " -> " + href)


def render_dashboard() -> None:
    user = get_current_user()
    st.title("Hallo " + user.get("displayName", "User"))
    st.caption("Willkommen im Ticket V-Beide. Wähle einen Bereich.")

    custom_shortcuts = get_item(STORAGE_KEYS["SHORTCUTS"], [])
    if not custom_shortcuts:
        custom_shortcuts = DEFAULT_SHORTCUTS

    st.markdown('<div class="vm-section-title">Shortcuts</div>', unsafe_allow_html=True)
    short_cols = st.columns(3)
    all_shortcuts = AUTO_SHORTCUTS + custom_shortcuts
    for idx, sc in enumerate(all_shortcuts):
        with short_cols[idx % 3]:
            with st.container(border=True):
                render_shortcut(sc.get("label", "Shortcut"), sc.get("href", "/"), f"shortcut_{idx}")
    if st.button("+ Eigene legen", key="open_settings_shortcuts"):
        goto("Einstellungen")

    st.markdown('<div class="vm-section-title">Bereiche</div>', unsafe_allow_html=True)
    cols = st.columns(3)
    for idx, module in enumerate(MODULES_GRID):
        with cols[idx % 3]:
            with st.container(border=True):
                st.markdown(f"### {module['icon']} {module['label']}")
                st.caption(module["desc"])
                render_shortcut("Oeffnen", module["href"], f"module_{idx}")

    st.markdown('<div class="vm-section-title">Nächste Termine</div>', unsafe_allow_html=True)
    termine = get_item(STORAGE_KEYS["TERMINE"], [])
    if not termine:
        termine = MOCK_TERMINE
    for idx, t in enumerate(termine[:5]):
        title = t.get("titel", t.get("title", "Termin"))
        date_value = t.get("datum", t.get("date", ""))
        time_value = t.get("uhrzeit", t.get("time", ""))
        termin_id = t.get("id", "")
        with st.container(border=True):
            c1, c2 = st.columns([5, 1])
            with c1:
                st.write(f"**{title}** - {date_value} {time_value}")
            with c2:
                if st.button("Details", key=f"dash_t_detail_{idx}"):
                    goto("Termin Detail", id=termin_id)


def build_search_rows(query: str) -> list[dict[str, str]]:
    q = query.lower()
    rows: list[dict[str, str]] = []

    termine = get_item(STORAGE_KEYS["TERMINE"], [])
    for t in termine[:50]:
        text = f"{t.get('titel', '')} {t.get('ressource', '')} {t.get('datum', '')}".lower()
        if q in text:
            rows.append(
                {
                    "label": t.get("titel", "Termin"),
                    "meta": t.get("datum", ""),
                    "route": "Termin Detail",
                    "id": str(t.get("id", "")),
                }
            )

    antraege = [*get_item(STORAGE_KEYS["ANTRAEGE"], []), *MOCK_ANTRAEGE]
    for a in antraege[:100]:
        text = f"{a.get('titel', '')} {a.get('kategorie', '')} {a.get('status', '')}".lower()
        if q in text:
            rows.append(
                {
                    "label": a.get("titel", "Antrag"),
                    "meta": a.get("kategorie", ""),
                    "route": "Antrag Detail",
                    "id": str(a.get("id", "")),
                }
            )

    for m in MITGLIEDER:
        text = f"{m['name']} {m['email']} {m['bereich']}".lower()
        if q in text:
            rows.append({"label": m["name"], "meta": m["bereich"], "route": "Mitglieder", "id": ""})

    verant = get_item(STORAGE_KEYS["VERANTWORTLICHE"], [])
    for v in verant[:100]:
        text = f"{v.get('thema', '')} {v.get('name', '')} {v.get('email', '')}".lower()
        if q in text:
            rows.append({"label": v.get("name", "Verantwortlich"), "meta": v.get("thema", ""), "route": "Verantwortliche", "id": ""})

    for i in INFOS_ANSPRECHPARTNER:
        text = f"{i['kategorie']} {i['name']} {i['email']}".lower()
        if q in text:
            rows.append({"label": i["name"], "meta": i["kategorie"], "route": "Verantwortliche", "id": ""})

    return rows[:12]


def render_global_search() -> None:
    if "global_search_input" not in st.session_state:
        st.session_state["global_search_input"] = st.session_state.get("global_search_query", "")

    _, center, right = st.columns([1, 8, 1])
    with center:
        with st.form("global_search_form"):
            c_input, c_button = st.columns([6, 1])
            with c_input:
                q = st.text_input(
                    "Suche in der App",
                    key="global_search_input",
                placeholder="Termine, Anträge, Mitglieder, Infos ...",
                    label_visibility="collapsed",
                )
            with c_button:
                submitted = st.form_submit_button("Suchen", use_container_width=True)
            if submitted:
                st.session_state["global_search_query"] = q.strip()
                st.rerun()
    with right:
        render_profile_menu()

    query = st.session_state.get("global_search_query", "").strip()
    if not query:
        return

    results = build_search_rows(query)
    with st.container(border=True):
        st.markdown(f"**Suchergebnisse für:** `{query}`")
        if not results:
            st.caption("Keine Treffer.")
            return
        for idx, r in enumerate(results):
            c1, c2 = st.columns([6, 1])
            with c1:
                st.write(f"{r['label']}  •  {r['meta']}")
            with c2:
                if st.button("Oeffnen", key=f"search_open_{idx}_{r['route']}"):
                    if r["id"]:
                        goto(r["route"], id=r["id"])
                    else:
                        goto(r["route"])


def _user_initials(name: str) -> str:
    parts = [p for p in name.strip().split(" ") if p]
    if not parts:
        return "U"
    if len(parts) == 1:
        return parts[0][:1].upper()
    return (parts[0][:1] + parts[-1][:1]).upper()


def render_profile_menu() -> None:
    user = get_current_user()
    initials = _user_initials(user.get("displayName", "User"))

    st.markdown(
        """
<style>
    [data-testid="stPopover"] > div > button {
        border-radius: 9999px !important;
        width: 44px;
        height: 44px;
        padding: 0 !important;
        font-weight: 700 !important;
        border: 1px solid #cbd5e1 !important;
        background: #ffffff !important;
        color: #0f172a !important;
    }
</style>
        """,
        unsafe_allow_html=True,
    )

    with st.popover(initials):
        st.write("**" + user.get("displayName", "User") + "**")
        st.caption(user.get("email", ""))
        if st.button("Profil", key="menu_profil", use_container_width=True):
            goto("Profil")
        if st.button("Einstellungen", key="menu_settings", use_container_width=True):
            goto("Einstellungen")
        if st.button("Abmelden", key="menu_logout", use_container_width=True):
            goto("Abmelden")


def render_termine() -> None:
    st.title("Termine")
    st.caption("Buchung Fahrzeuge & Raeume, Zuteilung Absicherung")
    termine = get_item(STORAGE_KEYS["TERMINE"], [])
    absicherung_options = ["BF", "SR", "SAN B", "—"]
    with st.form("termine_neu"):
        titel = st.text_input("Titel")
        col1, col2 = st.columns(2)
        with col1:
            datum = st.date_input("Datum", value=date.today(), key="termin_datum")
            ressourcen_typ = st.selectbox("Art", ["fahrzeug", "raum"])
        with col2:
            uhrzeit = st.text_input("Uhrzeit")
            ressource = st.text_input("Ressource")
        absicherung = st.selectbox("Absicherung", absicherung_options)
        save = st.form_submit_button("Termin anlegen")
        if save and titel.strip() and str(datum):
            neu = {
                "id": next_id(),
                "titel": titel.strip(),
                "datum": str(datum),
                "uhrzeit": uhrzeit.strip(),
                "ressourcenTyp": ressourcen_typ,
                "ressource": ressource.strip(),
                "absicherung": absicherung,
            }
            set_item(STORAGE_KEYS["TERMINE"], [*termine, neu])
            st.success("Termin angelegt.")
            st.rerun()

    sorted_termine = sorted(termine, key=lambda t: (t.get("datum", ""), t.get("uhrzeit", "")))
    if not sorted_termine:
        st.info("Noch keine Termine.")
    for idx, t in enumerate(sorted_termine):
        c1, c2 = st.columns([5, 1])
        with c1:
            st.write(
                f"**{t.get('titel', 'Termin')}** - {t.get('datum', '')} {t.get('uhrzeit', '')} - "
                f"{t.get('ressourcenTyp', '')}: {t.get('ressource', '—')} - Absicherung: {t.get('absicherung', '—')}"
            )
        with c2:
            if st.button("Details", key=f"term_detail_{idx}"):
                goto("Termin Detail", id=t.get("id", ""))


def render_termin_detail() -> None:
    st.title("Termin-Detail")
    selected_id = str(route_param("id", "") or "")
    termine = get_item(STORAGE_KEYS["TERMINE"], [])
    stored_match = next((t for t in termine if t.get("id") == selected_id), None)

    detail = None
    if stored_match:
        detail = {
            "title": stored_match.get("titel", "Termin"),
            "date": stored_match.get("datum", ""),
            "time": stored_match.get("uhrzeit", ""),
            "ort": stored_match.get("ressource", "—"),
            "besetzung": [],
            "fahrzeuge": [stored_match.get("ressource")] if stored_match.get("ressourcenTyp") == "fahrzeug" else [],
        }
    elif selected_id and selected_id in MOCK_TERMIN_DETAIL:
        detail = MOCK_TERMIN_DETAIL[selected_id]

    if not detail:
        options = list(MOCK_TERMIN_DETAIL.keys()) + [str(t.get("id")) for t in termine]
        options = [o for o in options if o]
        if options:
            pick = st.selectbox("Termin-ID auswaehlen", options=options, index=0)
            if st.button("Anzeigen", key="pick_termin_detail"):
                goto("Termin Detail", id=pick)
        st.warning("Termin nicht gefunden.")
        return

    st.subheader(detail.get("title", "Termin"))
    st.write(f"{detail.get('date', '')} {detail.get('time', '')} - {detail.get('ort', '')}")
    st.markdown("**Besetzung**")
    besetzung = detail.get("besetzung", [])
    if not besetzung:
        st.caption("Keine Besetzung eingetragen.")
    else:
        for b in besetzung:
            st.write(f"- {b.get('name')} ({b.get('rolle')})")
    st.markdown("**Fahrzeuge**")
    fahrzeuge = detail.get("fahrzeuge", [])
    if not fahrzeuge:
        st.caption("Keine Fahrzeuge zugewiesen.")
    else:
        for f in fahrzeuge:
            st.write("- " + str(f))
    if st.button("Zurueck zu Termine"):
        goto("Termine")


def render_kalender() -> None:
    st.title("Terminkalender")
    termine = get_item(STORAGE_KEYS["TERMINE"], [])
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for t in termine:
        d = t.get("datum", "")
        if d:
            grouped[d].append(t)
    if not grouped:
        st.info("Noch keine Termine angelegt. Termine aus dem Bereich Termine erscheinen hier.")
        return
    for d in sorted(grouped.keys()):
        st.subheader(d)
        for t in grouped[d]:
            st.write(
                f"- {t.get('titel', 'Termin')} | {t.get('uhrzeit', '')} | "
                f"{t.get('ressourcenTyp', '')}: {t.get('ressource', '—')} | Absicherung: {t.get('absicherung', '—')}"
            )


def render_antraege() -> None:
    st.title("Anträge")
    search = st.text_input("Anträge durchsuchen")
    kategorie = st.selectbox("Kategorie", ["Alle", "Schaden melden", "Urlaub", "Material", "Sonstiges"])
    stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
    all_antraege = [*stored, *MOCK_ANTRAEGE]
    filtered = []
    for a in all_antraege:
        if kategorie != "Alle" and a.get("kategorie") != kategorie:
            continue
        if search and search.lower() not in str(a.get("titel", "")).lower():
            continue
        filtered.append(a)

    if st.button("Schaden melden", key="to_schaden"):
        goto("Schaden melden")
    if not filtered:
        st.info("Keine Anträge gefunden.")
        return
    for idx, a in enumerate(filtered):
        c1, c2 = st.columns([6, 1])
        with c1:
            st.write(
                f"**{a.get('titel', 'Antrag')}** - {a.get('kategorie', '')} - "
                f"{a.get('status', '')} - {a.get('datum', '')}"
            )
        with c2:
            if st.button("Details", key=f"antrag_detail_{idx}"):
                goto("Antrag Detail", id=a.get("id", ""))


def render_antrag_detail() -> None:
    st.title("Antrag-Detail")
    selected_id = str(route_param("id", "") or "")
    if selected_id in {a["id"] for a in MOCK_ANTRAEGE}:
        found = next(a for a in MOCK_ANTRAEGE if a["id"] == selected_id)
    else:
        stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
        found = next((a for a in stored if str(a.get("id", "")) == selected_id), None)

    if not found:
        all_antraege = [*get_item(STORAGE_KEYS["ANTRAEGE"], []), *MOCK_ANTRAEGE]
        if all_antraege:
            options = [f"{a.get('id')} - {a.get('titel')}" for a in all_antraege]
            selected = st.selectbox("Antrag auswaehlen", options)
            if st.button("Anzeigen", key="pick_antrag_detail"):
                goto("Antrag Detail", id=selected.split(" - ", 1)[0])
        st.warning("Antrag nicht gefunden.")
        return

    st.subheader(found.get("titel", "Antrag"))
    st.write(f"{found.get('kategorie', '')} - {found.get('status', '')} - {found.get('datum', '')}")
    st.write(found.get("beschreibung", "—"))
    if st.button("Zurück zu Anträgen"):
        goto("Antraege")


def render_schaden_melden() -> None:
    st.title("Schaden melden")
    with st.form("schaden_form"):
        kurzbeschreibung = st.text_input("Kurzbeschreibung")
        ort = st.text_input("Ort / betroffener Bereich")
        beschreibung = st.text_area("Beschreibung")
        sent = st.form_submit_button("Schaden melden")
    if sent:
        stored = get_item(STORAGE_KEYS["ANTRAEGE"], [])
        neu = {
            "id": next_id(),
            "typ": "Schaden",
            "titel": kurzbeschreibung.strip(),
            "kategorie": "Schaden melden",
            "status": "Eingereicht",
            "datum": str(date.today()),
            "ort": ort.strip() or None,
            "beschreibung": beschreibung.strip() or None,
        }
        set_item(STORAGE_KEYS["ANTRAEGE"], [neu, *stored])
        st.success("Meldung wurde abgeschickt.")
        if st.button("Zu den Anträgen"):
            goto("Antraege")


def render_aufgaben() -> None:
    st.title("Aufgaben")
    st.subheader("Dir zugewiesen")
    for a in MOCK_ZUGEWIESEN:
        st.write(f"- {a['titel']} | von {a['von']} | Frist {a['frist']}")

    todos = ensure_list(STORAGE_KEYS["AUFGABEN_TODOS"], DEFAULT_TODOS)
    st.subheader("Deine Todos")
    changed = False
    for idx, todo in enumerate(todos):
        done = st.checkbox(todo.get("titel", ""), value=bool(todo.get("erledigt")), key=f"todo_{idx}_{todo.get('id')}")
        if done != bool(todo.get("erledigt")):
            todos[idx]["erledigt"] = done
            changed = True
    if changed:
        set_item(STORAGE_KEYS["AUFGABEN_TODOS"], todos)
        st.rerun()

    with st.form("todo_add"):
        title = st.text_input("Neues Todo")
        add = st.form_submit_button("Hinzufügen")
    if add and title.strip():
        set_item(STORAGE_KEYS["AUFGABEN_TODOS"], [*todos, {"id": next_id(), "titel": title.strip(), "erledigt": False}])
        st.success("Todo hinzugefuegt.")
        st.rerun()


def render_pinnwand() -> None:
    st.title("Pinnwand")
    user = get_current_user()
    st.subheader("News")
    for n in MOCK_NEWS:
        st.write(f"- **{n['titel']}** ({n['datum']}) - {n['text']}")
    aufgaben = ensure_list(STORAGE_KEYS["PINNWAND_AUFGABEN"], DEFAULT_PINNWAND_AUFGABEN)
    st.subheader("Aufgaben (schnappen & erledigen)")
    for idx, a in enumerate(aufgaben):
        st.write(f"**{a.get('titel')}** - {a.get('beschreibung')}")
        owner = a.get("uebernommenVon")
        st.caption((owner + " hat die Aufgabe uebernommen") if owner else "Noch niemand")
        c1, c2 = st.columns(2)
        with c1:
            if (not owner) and st.button("Uebernehmen", key=f"take_{idx}_{a.get('id')}"):
                aufgaben[idx]["uebernommenVon"] = user.get("displayName")
                set_item(STORAGE_KEYS["PINNWAND_AUFGABEN"], aufgaben)
                st.rerun()
        with c2:
            if owner == user.get("displayName") and st.button("Abgeben", key=f"drop_{idx}_{a.get('id')}"):
                aufgaben[idx]["uebernommenVon"] = None
                set_item(STORAGE_KEYS["PINNWAND_AUFGABEN"], aufgaben)
                st.rerun()
        st.divider()


def render_helferstunden() -> None:
    st.title("Helferstunden")
    st.caption("Automatisch bei Veranstaltungen, manuell bei eigenen Terminen")
    stunden = ensure_list(STORAGE_KEYS["HELFERSTUNDEN"], MOCK_STUNDEN)
    filter_projekt = st.selectbox("Projekt", ["Alle", "Einsatz", "Ausbildung", "Johanni"])
    shown = stunden if filter_projekt == "Alle" else [s for s in stunden if s.get("projekt") == filter_projekt]
    for s in shown:
        st.write(f"- {s.get('taetigkeit')} | {s.get('datum')} | {s.get('dauer')} h | {s.get('projekt')}")
    with st.form("helferstunden_form"):
        d = st.date_input("Datum", value=date.today(), key="hs_datum")
        dauer = st.number_input("Dauer (h)", min_value=0.5, step=0.5, value=2.0)
        taetigkeit = st.text_input("Taetigkeit")
        projekt = st.selectbox("Projekt", ["Einsatz", "Ausbildung", "Johanni"], key="hs_projekt")
        save = st.form_submit_button("Speichern")
    if save:
        neu = {"id": next_id(), "datum": str(d), "dauer": float(dauer), "taetigkeit": taetigkeit.strip() or "—", "projekt": projekt}
        set_item(STORAGE_KEYS["HELFERSTUNDEN"], [neu, *stunden])
        st.success("Gespeichert.")
        st.rerun()


def render_dienstkleidung() -> None:
    st.title("Dienstkleidung")
    liste = ensure_list(STORAGE_KEYS["DIENSTKLEIDUNG"], MOCK_KLEIDUNG)
    for k in liste:
        st.write(f"- {k.get('artikel')} | Größe {k.get('groesse')} | {k.get('status')} | {k.get('datum')}")
    with st.form("kleidung_form"):
        artikel = st.selectbox("Artikel", ["T-Shirt", "Hose", "Jacke", "Schuhe"])
        groesse = st.text_input("Größe")
        submit = st.form_submit_button("Anfrage senden")
    if submit:
        artikel_label = "T-Shirt blau" if artikel == "T-Shirt" else "Hose dunkelblau" if artikel == "Hose" else artikel
        neu = {"id": next_id(), "artikel": artikel_label, "groesse": groesse.strip() or "—", "status": "Anfrage gestellt", "datum": str(date.today())}
        set_item(STORAGE_KEYS["DIENSTKLEIDUNG"], [neu, *liste])
        st.success("Anfrage gespeichert.")
        st.rerun()


def render_profil() -> None:
    st.title("Profil")
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
    if st.button("Speichern", key="save_profil"):
        save_user(
            {
                "telefon": telefon or None,
                "notfall": notfall or None,
                "visible": {"name": name_visible, "email": email_visible, "telefon": telefon_visible},
            }
        )
        st.success("Gespeichert.")


def render_einstellungen() -> None:
    st.title("Einstellungen")
    shortcuts = get_item(STORAGE_KEYS["SHORTCUTS"], [])
    if not shortcuts:
        shortcuts = list(DEFAULT_SHORTCUTS)
    st.subheader("Shortcuts")
    for idx, s in enumerate(shortcuts):
        c1, c2, c3 = st.columns([3, 3, 1])
        c1.write(s.get("label", ""))
        c2.caption(s.get("href", ""))
        if c3.button("Entfernen", key=f"rm_short_{idx}"):
            next_shortcuts = [x for i, x in enumerate(shortcuts) if i != idx]
            set_item(STORAGE_KEYS["SHORTCUTS"], next_shortcuts)
            st.rerun()
    with st.form("add_shortcut"):
        href = st.text_input("Link (z. B. /termine oder https://...)")
        label = st.text_input("Anzeigename")
        add = st.form_submit_button("Hinzufügen")
    if add and href.strip():
        norm_href = href.strip()
        if (not norm_href.startswith("/")) and (not norm_href.startswith("http")):
            norm_href = "/" + norm_href
        set_item(STORAGE_KEYS["SHORTCUTS"], [*shortcuts, {"href": norm_href, "label": (label.strip() or norm_href)}])
        st.success("Shortcut hinzugefuegt.")
        st.rerun()


def render_inventar() -> None:
    st.title("Inventar")
    if not has_permission("inventar"):
        st.error("Sie haben keine Berechtigung fuer den Zugriff auf das Inventar.")
        return
    kategorie = st.selectbox("Kategorie", ["SAN", "Technik", "Verpflegung"])
    tab = st.radio("Ansicht", ["Ueberblick", "Fehlen", "Zustand einscannen"], horizontal=True)
    filtered = [a for a in MOCK_ARTIKEL if a["kategorie"] == kategorie]
    fehlend = [a for a in filtered if a["ist"] < a["soll"]]
    if tab == "Ueberblick":
        st.table(filtered)
    elif tab == "Fehlen":
        if not fehlend:
            st.success("Keine Fehlbestaende in der Kategorie.")
        for a in fehlend:
            st.warning(f"{a['name']} fehlt: {a['soll'] - a['ist']}")
            c1, c2 = st.columns(2)
            if c1.button("Bedarf notieren", key=f"need_{a['id']}"):
                st.info("Noch keine Anbindung - kommt mit Backend.")
            if c2.button("Bestellung", key=f"order_{a['id']}"):
                st.info("Bestellung - kommt mit Backend.")
    else:
        barcode = st.text_input("Barcode oder QR eingeben / scannen")
        zustand = st.selectbox("Zustand", ["gut", "beschaedigt", "defekt"])
        if st.button("Zustand speichern"):
            st.info("Zustand '" + zustand + "' fuer " + (barcode or "ohne Code") + " - kommt mit Backend.")


def render_tickets() -> None:
    st.title("Ticketsystem")
    st.caption("Anfragen fuer Lehrgaenge oder Stoerung/Beschaedigung melden")
    tickets = get_item(STORAGE_KEYS["TICKETS"], [])
    with st.form("ticket_form"):
        typ = st.selectbox("Art", options=[t[0] for t in TICKET_TYPEN], format_func=lambda v: dict(TICKET_TYPEN)[v])
        anonym = st.checkbox("Anonym melden") if typ == "stoerung" else False
        beschreibung = st.text_area("Beschreibung")
        add = st.form_submit_button("Ticket erstellen")
    if add and beschreibung.strip():
        neu = {"id": next_id(), "typ": typ, "anonym": anonym, "beschreibung": beschreibung.strip(), "createdAt": date.today().isoformat()}
        set_item(STORAGE_KEYS["TICKETS"], [neu, *tickets])
        st.success("Ticket erstellt.")
        st.rerun()
    st.subheader("Offene Tickets")
    if not tickets:
        st.info("Noch keine Tickets.")
    for t in tickets:
        title = "Lehrgang / Ausbildung" if t.get("typ") == "lehrgang" else "Stoermeldung / Beschaedigung"
        st.write(f"**{title}** - {t.get('createdAt', '')}")
        st.write(t.get("beschreibung", ""))
        if t.get("anonym"):
            st.caption("Anonym")
        st.divider()


def render_verantwortliche() -> None:
    st.title("Verantwortliche")
    st.caption("Ansprechpartner nach Bereich plus frei gepflegte Verantwortlichen-Liste.")

    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for item in INFOS_ANSPRECHPARTNER:
        grouped[item["kategorie"]].append(item)
    for k, values in grouped.items():
        with st.container(border=True):
            st.subheader(k)
            for a in values:
                st.write(f"- {a['name']} | {a['email']} | {a['telefon']}")

    st.markdown("---")
    st.subheader("Eigene Verantwortliche")
    liste = get_item(STORAGE_KEYS["VERANTWORTLICHE"], [])
    with st.form("verantwortliche_form"):
        thema = st.text_input("Referat / Thema")
        name = st.text_input("Name")
        email = st.text_input("E-Mail")
        tel = st.text_input("Tel")
        add = st.form_submit_button("Hinzufügen")
    if add and thema.strip() and name.strip():
        neu = {"id": next_id(), "thema": thema.strip(), "name": name.strip(), "email": email.strip(), "tel": tel.strip()}
        set_item(STORAGE_KEYS["VERANTWORTLICHE"], [*liste, neu])
        st.success("Hinzugfuegt.")
        st.rerun()
    if not liste:
        st.info("Noch keine Verantwortlichen hinterlegt.")
    else:
        st.table(liste)


def render_wachbuch() -> None:
    st.title("Wachbuch")
    eintraege = get_item(STORAGE_KEYS["WACHBUCH"], [])
    with st.form("wachbuch_form"):
        d = st.date_input("Datum", value=date.today(), key="wb_date")
        text = st.text_area("Kurzbeschreibung des Dienstes / Einsatzes")
        add = st.form_submit_button("+ Eintrag")
    if add and text.strip():
        neu = {"id": next_id(), "datum": str(d), "text": text.strip()}
        set_item(STORAGE_KEYS["WACHBUCH"], [neu, *eintraege])
        st.success("Eintrag gespeichert.")
        st.rerun()
    if not eintraege:
        st.info("Noch keine Wachbuch-Eintraege.")
    else:
        for e in eintraege:
            st.write(f"**{e.get('datum', '')}**")
            st.write(e.get("text", ""))
            st.divider()


def render_fahrzeuge() -> None:
    st.title("Fahrzeuguebersichten")
    tabs = ["Uebersicht", "TUEV", "Wartung", "Maengel", "Zubehoer"]
    tab = st.radio("Ansicht", tabs, horizontal=True)
    fahrzeuge = get_item(STORAGE_KEYS["FAHRZEUGE"], [])
    with st.form("fahrzeuge_form"):
        name = st.text_input("Bezeichnung (z.B. MTW 1)")
        tuv_bis = st.date_input("TUEV bis", value=date.today(), key="car_tuv")
        wartung = st.date_input("Naechste Wartung", value=date.today(), key="car_wartung")
        maengel = st.text_area("Maengel")
        zubehoer = st.text_area("Zubehoer (Laptop, HRTs ...)")
        add = st.form_submit_button("Fahrzeug hinzufuegen")
    if add and name.strip():
        neu = {
            "id": next_id(),
            "name": name.strip(),
            "tuvBis": str(tuv_bis),
            "naechsteWartung": str(wartung),
            "maengel": maengel.strip(),
            "zubehoer": zubehoer.strip(),
        }
        set_item(STORAGE_KEYS["FAHRZEUGE"], [*fahrzeuge, neu])
        st.success("Fahrzeug hinzugefuegt.")
        st.rerun()
    if not fahrzeuge:
        st.info("Noch keine Fahrzeuge hinterlegt.")
        return
    rows = []
    for f in fahrzeuge:
        row = {"Fahrzeug": f.get("name", "")}
        if tab == "TUEV":
            row["TUEV bis"] = f.get("tuvBis", "—")
        elif tab == "Wartung":
            row["Naechste Wartung"] = f.get("naechsteWartung", "—")
        elif tab == "Maengel":
            row["Maengel"] = f.get("maengel", "—")
        elif tab == "Zubehoer":
            row["Zubehoer"] = f.get("zubehoer", "—")
        rows.append(row)
    st.table(rows)


def render_personal() -> None:
    st.title("Personalakten")
    tab = st.radio("Bereich", ["Allgemein", "Ausbildungen", "Führerscheine"], horizontal=True)
    profil = get_item(
        STORAGE_KEYS["PROFIL"],
        {"name": "", "wohnort": "", "notfallkontakt": "", "ausbildungen": "", "fuehrerscheine": ""},
    )
    if tab == "Allgemein":
        name = st.text_input("Name", value=profil.get("name", ""))
        wohnort = st.text_input("Wohnort", value=profil.get("wohnort", ""))
        notfall = st.text_input("Notfallkontakt", value=profil.get("notfallkontakt", ""))
        if st.button("Allgemein speichern"):
            profil.update({"name": name, "wohnort": wohnort, "notfallkontakt": notfall})
            set_item(STORAGE_KEYS["PROFIL"], profil)
            st.success("Gespeichert.")
    elif tab == "Ausbildungen":
        aus = st.text_input("Ausbildungen (Komma getrennt)", value=profil.get("ausbildungen", ""))
        if st.button("Ausbildungen speichern"):
            profil["ausbildungen"] = aus
            set_item(STORAGE_KEYS["PROFIL"], profil)
            st.success("Gespeichert.")
        for a in [x.strip() for x in aus.split(",") if x.strip()]:
            st.write("- " + a)
    else:
        fs = st.text_input("Führerscheine (Komma getrennt)", value=profil.get("fuehrerscheine", ""))
        if st.button("Führerscheine speichern"):
            profil["fuehrerscheine"] = fs
            set_item(STORAGE_KEYS["PROFIL"], profil)
            st.success("Gespeichert.")
        for f in [x.strip() for x in fs.split(",") if x.strip()]:
            st.write("- " + f)


def render_dokumente() -> None:
    st.title("Dokumentenablage")
    st.caption("Eintraege fuer Dateien und Kategorien")
    dokumente = get_item(STORAGE_KEYS["DOKUMENTE"], [])
    kategorie = st.text_input("Kategorie / Ordner")
    upload = st.file_uploader("Datei auswaehlen")
    if upload is not None and st.button("Dokumenteintrag speichern"):
        neu = {"id": next_id(), "name": upload.name, "kategorie": kategorie.strip()}
        set_item(STORAGE_KEYS["DOKUMENTE"], [*dokumente, neu])
        st.success("Dokumenteintrag gespeichert.")
        st.rerun()
    if not dokumente:
        st.info("Noch keine Dokumente erfasst.")
    else:
        st.table(dokumente)


def render_ausbildung() -> None:
    st.title("Ausbildung")
    view = st.radio("Ansicht", ["Uebersicht", "Baumansicht"], horizontal=True)
    if view == "Uebersicht":
        st.subheader("Deine Abschluesse")
        for a in ABSCHLUESSE:
            st.success(f"{a['name']} ({a['datum']})")
        st.subheader("Verfuegbare Kurse")
        for k in VERFUEGBARE_KURSE:
            c1, c2 = st.columns([5, 1])
            c1.write(f"{k['name']} - {k['kategorie']}")
            if c2.button("Anmelden", key=f"kurs_{k['id']}"):
                st.info("Anmeldung wird mit Backend verbunden.")
    else:
        for node in AUSBILDUNG_BAUM:
            st.markdown("**" + node["label"] + "**")
            for child in node["children"]:
                st.write("- " + child)


def render_mitglieder() -> None:
    st.title("Mitglieder")
    suche = st.text_input("Suchen (Name, E-Mail, Bereich)")
    filtered = [
        m
        for m in MITGLIEDER
        if (not suche)
        or suche.lower() in m["name"].lower()
        or suche.lower() in m["email"].lower()
        or suche.lower() in m["bereich"].lower()
    ]
    for m in filtered:
        st.write(f"**{m['name']}** - {m['email']} - {m['bereich']}")


def render_it() -> None:
    st.title("IT")
    st.write("Name: IT Support")
    st.write("E-Mail: it@example.org")
    st.write("Telefon: +49 123 459")
    if st.button("Ticket-System oeffnen"):
        goto("Ticketsystem")


def render_johanni() -> None:
    st.title("Johanni")
    st.subheader("Ansprechpartner")
    for a in JOHANNI_ANSPRECHPARTNER:
        st.write(f"- {a['name']} | {a['bereich']} | {a['email']}")
    st.subheader("Plan / Veranstaltung")
    st.info("Zeitplan, Lageplan, Diensteinteilung und Dokumente koennen hier eingebunden werden.")


def render_haussteuerung() -> None:
    st.title("Haussteuerung")
    loxone_url = os.environ.get("LOXONE_URL", "https://loxone.example.com")
    st.caption("Loxone-Verknuepfung. Shortcuts auf diese Seite koennen in den Einstellungen angelegt werden.")
    st.link_button("Loxone oeffnen", loxone_url)


def render_auftraege() -> None:
    st.title("Laufende Auftraege")
    st.write("Hier erscheinen laufende Aufträge (Anträge in Bearbeitung, zugewiesene Termine, etc.).")
    st.write("- Keine laufenden Aufträge.")


def render_abmelden() -> None:
    st.title("Abmelden")
    st.caption("Platzhalter: Hier wird spaeter die Abmeldung (z. B. AD-Logout) ausgefuehrt.")
    if st.button("Zurueck zum Dashboard"):
        goto("Dashboard")


def render_sidebar() -> None:
    if "route" not in st.session_state:
        st.session_state["route"] = "Dashboard"
    if "route_params" not in st.session_state:
        st.session_state["route_params"] = {}

    current = st.session_state["route"]
    if current not in ROUTE_RENDERERS:
        current = "Dashboard"
        st.session_state["route"] = current

    with st.sidebar:
        st.header("Ticket-Vbeide")
        user = get_current_user()
        st.caption(user.get("displayName", "User"))
        st.markdown("### Navigation")
        for route in ROUTES:
            is_current = route == current
            icon = NAV_ICONS.get(route, "•")
            label = f"{icon}  {ROUTE_LABELS.get(route, route)}"
            if st.button(
                label,
                key=f"nav_{route.replace(' ', '_')}",
                use_container_width=True,
                type="primary" if is_current else "secondary",
            ):
                if not is_current:
                    st.session_state["route"] = route
                    st.session_state["route_params"] = {}
                    st.rerun()


ROUTE_RENDERERS = {
    "Dashboard": render_dashboard,
    "Termine": render_termine,
    "Termin Detail": render_termin_detail,
    "Personalakten": render_personal,
    "Fahrzeuge": render_fahrzeuge,
    "Ticketsystem": render_tickets,
    "Verantwortliche": render_verantwortliche,
    "Helferstunden": render_helferstunden,
    "Wachbuch": render_wachbuch,
    "Antraege": render_antraege,
    "Antrag Detail": render_antrag_detail,
    "Schaden melden": render_schaden_melden,
    "Dienstkleidung": render_dienstkleidung,
    "Aufgaben": render_aufgaben,
    "Pinnwand": render_pinnwand,
    "Mitglieder": render_mitglieder,
    "Kalender": render_kalender,
    "Ausbildung": render_ausbildung,
    "Haussteuerung": render_haussteuerung,
    "Inventar": render_inventar,
    "Dokumente": render_dokumente,
    "Johanni": render_johanni,
    "IT": render_it,
    "Auftraege": render_auftraege,
    "Einstellungen": render_einstellungen,
    "Profil": render_profil,
    "Abmelden": render_abmelden,
}

inject_vmoritz_theme()
render_sidebar()
render_global_search()
ROUTE_RENDERERS[st.session_state["route"]]()

