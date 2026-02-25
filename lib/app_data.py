from __future__ import annotations

from typing import Any

AUTO_SHORTCUTS = [
    {"href": "/termine", "label": "Termine"},
    {"href": "/helferstunden", "label": "Helferstunden"},
    {"href": "/antraege", "label": "Antraege"},
]

DEFAULT_SHORTCUTS = [{"href": "/ausbildung", "label": "Ausbildung"}]

MODULES_GRID = [
    {"href": "/termine", "label": "Termine", "desc": "Buchung Fahrzeuge & Raeume, Zuteilung", "icon": "📅"},
    {"href": "/personal", "label": "Personalakten", "desc": "Infos, Ausbildungen, Fuehrerscheine", "icon": "👤"},
    {"href": "/fahrzeuge", "label": "Fahrzeuge", "desc": "TUEV, Wartung, Maengel, Zubehoer", "icon": "🚐"},
    {"href": "/tickets", "label": "Ticketsystem", "desc": "Lehrgaenge, Stoerung/Beschaedigung", "icon": "🎫"},
    {"href": "/verantwortliche", "label": "Verantwortliche", "desc": "Referate & Ansprechpartner", "icon": "📋"},
    {"href": "/helferstunden", "label": "Helferstunden", "desc": "Automatisch und manuell", "icon": "⏱"},
    {"href": "/wachbuch", "label": "Wachbuch", "desc": "Dienst- und Einsatzprotokoll", "icon": "📖"},
    {"href": "/inventar", "label": "Inventar", "desc": "Inkl. SAN-Material", "icon": "📦"},
    {"href": "/kalender", "label": "Kalender", "desc": "Fahrzeuge und Raeume", "icon": "🗓"},
    {"href": "/dokumente", "label": "Dokumente", "desc": "Fotos, Ablagen", "icon": "📁"},
    {"href": "/antraege", "label": "Antraege", "desc": "Schaden melden, Urlaub, Material", "icon": "📝"},
    {"href": "/aufgaben", "label": "Aufgaben", "desc": "Todos und Zuweisungen", "icon": "✓"},
]

MOCK_TERMINE = [
    {"id": "1", "title": "Einsatz Besprechung", "date": "2025-02-24", "time": "10:00"},
    {"id": "2", "title": "SAN Dienst", "date": "2025-02-25", "time": "08:00"},
    {"id": "3", "title": "Technik Check", "date": "2025-02-26", "time": "14:00"},
]

MOCK_ANTRAEGE = [
    {"id": "1", "titel": "Reparatur Kueche", "kategorie": "Schaden melden", "status": "In Bearbeitung", "datum": "2025-02-20", "beschreibung": "Wasserleitung undicht unter der Spuele."},
    {"id": "2", "titel": "Urlaubsantrag Maerz", "kategorie": "Urlaub", "status": "Offen", "datum": "2025-02-18", "beschreibung": "Urlaub 10.-20. Maerz."},
    {"id": "3", "titel": "Neue Verbandskaesten", "kategorie": "Material", "status": "Erledigt", "datum": "2025-02-10", "beschreibung": "Bestellung erledigt."},
]

MOCK_ZUGEWIESEN = [
    {"id": "1", "titel": "Protokoll Besprechung schreiben", "von": "Anna Schmidt", "frist": "2025-02-25", "erledigt": False},
    {"id": "2", "titel": "Materialliste pruefen", "von": "Tom Weber", "frist": "2025-02-28", "erledigt": False},
]

DEFAULT_TODOS = [
    {"id": "t1", "titel": "Erste-Hilfe-Koffer nachfuellen", "erledigt": False},
    {"id": "t2", "titel": "Fahrzeug-Check vor Dienst", "erledigt": True},
]

MOCK_STUNDEN = [
    {"id": "1", "datum": "2025-02-20", "dauer": 4, "taetigkeit": "SAN Dienst", "projekt": "Einsatz"},
    {"id": "2", "datum": "2025-02-18", "dauer": 2, "taetigkeit": "Schulung", "projekt": "Ausbildung"},
    {"id": "3", "datum": "2025-02-15", "dauer": 6, "taetigkeit": "Veranstaltung", "projekt": "Johanni"},
]

DEFAULT_PINNWAND_AUFGABEN = [
    {"id": "a1", "titel": "Kabeltrommel zurueckbringen", "beschreibung": "Zur Technik-Station", "uebernommenVon": None, "datum": "2025-02-21"},
    {"id": "a2", "titel": "Protokoll der letzten Sitzung tippen", "beschreibung": "Vorlage liegt im Buero", "uebernommenVon": None, "datum": "2025-02-19"},
    {"id": "a3", "titel": "Erste-Hilfe-Koffer pruefen", "beschreibung": "SAN-Raum", "uebernommenVon": None, "datum": "2025-02-20"},
]

MOCK_NEWS = [
    {"id": "n1", "titel": "Neue SAN-Schulung im Maerz", "datum": "2025-02-20", "text": "Anmeldung ab sofort moeglich."},
    {"id": "n2", "titel": "Lagerraeume ab naechster Woche geoeffnet", "datum": "2025-02-18", "text": "Zugang wie besprochen."},
]

MOCK_KLEIDUNG = [
    {"id": "1", "artikel": "T-Shirt blau", "groesse": "M", "status": "Ausgegeben", "datum": "2024-06-01"},
    {"id": "2", "artikel": "Hose dunkelblau", "groesse": "32", "status": "Ausgegeben", "datum": "2024-06-01"},
    {"id": "3", "artikel": "Jacke", "groesse": "M", "status": "Anfrage gestellt", "datum": "2025-02-15"},
]

MOCK_ARTIKEL = [
    {"id": "1", "name": "Verbandskasten", "kategorie": "SAN", "soll": 5, "ist": 4, "ort": "Lager A", "zustand": "gut"},
    {"id": "2", "name": "Defi", "kategorie": "SAN", "soll": 2, "ist": 2, "ort": "RTW", "zustand": "gut"},
    {"id": "3", "name": "Kabeltrommel", "kategorie": "Technik", "soll": 3, "ist": 2, "ort": "Technik", "zustand": "beschaedigt"},
]

MOCK_TERMIN_DETAIL: dict[str, dict[str, Any]] = {
    "1": {
        "title": "Einsatz Besprechung",
        "date": "2025-02-24",
        "time": "10:00",
        "ort": "Buero",
        "besetzung": [{"name": "Max Mustermann", "rolle": "Leitung"}, {"name": "Anna Schmidt", "rolle": "Protokoll"}],
        "fahrzeuge": ["KTW 1", "ELW 2"],
    },
    "2": {
        "title": "SAN Dienst",
        "date": "2025-02-25",
        "time": "08:00",
        "ort": "SAN-Station",
        "besetzung": [{"name": "Max Mustermann", "rolle": "SAN"}, {"name": "Anna Schmidt", "rolle": "Fahrer"}],
        "fahrzeuge": ["RTW 1", "KTW 1"],
    },
    "3": {
        "title": "Technik Check",
        "date": "2025-02-26",
        "time": "14:00",
        "ort": "Technik",
        "besetzung": [{"name": "Tom Weber", "rolle": "Technik"}],
        "fahrzeuge": [],
    },
    "4": {
        "title": "Helfer-Schulung",
        "date": "2025-03-01",
        "time": "09:00",
        "ort": "Schulungsraum",
        "besetzung": [],
        "fahrzeuge": [],
    },
}
