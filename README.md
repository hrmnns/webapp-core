# Web-App Framework (HTML / JavaScript / Tailwind)

Dieses Framework bietet eine einfache Grundlage zur Entwicklung kleiner, modular aufgebauter Web-Apps
(z. B. Entscheidungsbäume, Analyse-Tools, Nachschlagehilfen).
Es ist bewusst leichtgewichtig gehalten und benötigt **keine Build-Tools**, kein Node, kein Backend und
keine Frameworks wie React oder Vue.

## Idee
Viele kleine Web-Tools bestehen aus denselben Bausteinen:
- ein gemeinsamer Header mit Titel und Branding
- eine Navigation zwischen Unterseiten
- ein Footer / Hinweisbereich
- wiederkehrende Layout- und UI-Elemente

Normalerweise werden diese Elemente in jeder HTML-Datei dupliziert.
Dieses Framework trennt stattdessen **Struktur** (Seiten) und **Komponenten** (Header, Navigation, Footer).
So bleibt die App übersichtlich und gut erweiterbar.

## Funktionsumfang
- Zentrale **Konfigurationsdatei (`config.js`)** für:
  - Seitentitel
  - Navigationsstruktur
  - Anzeigeoptionen
- Komponenten werden dynamisch geladen (`include.js`)
- Navigation erstellt sich automatisch aus der Konfiguration
- Aktiver Bereich wird automatisch hervorgehoben
- Unterstützt **Responsive Design** (Desktop + Mobile, inkl. Burger-Menü)
- Einheitliches Layout über Tailwind CSS

## Struktur

```
/webapp
│ index.html
│ sub1.html
│ sub2.html
│ config.js
│ include.js
│
└── components/
    header.html
    nav-main.html
    breadcrumb.html
    footer.html
```

## Nutzung

1. Projekt lokal speichern
2. Web-App **nicht per Doppelklick**, sondern über einen lokalen Webserver starten  
   (z. B. in VS Code → „Open with Live Server“ oder Terminal):
   ```
   python -m http.server 8000
   ```
   Aufruf im Browser:
   ```
   http://localhost:8000/
   ```
3. In `config.js` Seitennamen und Navigation bearbeiten:
   ```javascript
   pages: {
     "index.html": { title: "Startseite", showInNav: true },
     "sub1.html": { title: "Tool 1", showInNav: true }
   }
   ```
4. Neue Unterseite? → HTML-Datei anlegen + in `config.js` eintragen.  
   Keine Änderungen an Navigation oder Header nötig.

## Erweiterbarkeit
- Styles können direkt in `header.html` oder über Tailwind-Klassen angepasst werden.
- Interaktive Logik wird in eigenen `script`-Abschnitten oder in `include.js` ergänzt.
- Ideal für kleine Entscheidungsbäume, Rollenprüfungen, Fragebögen, Rechner, Micro-Lernmodule.

## Lizenz
Dieses Framework darf frei genutzt, angepasst und erweitert werden.
