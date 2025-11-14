# WebApp Core Framework

**Ein leichtgewichtiges Framework zur Entwicklung kleiner Web-Apps (Entscheidungstools, Fragebäume, Analyseseiten etc.) ausschließlich mit HTML und JavaScript.** Keine Build-Tools, kein Backend, keine Abhängigkeiten. Die Apps können direkt als statische Seiten gehostet werden (z. B. GitHub Pages, S3, Unternehmens-Intranet).

## Release Notes  
### v2.0.0 – 2025-11-14
Mit v2 wird webapp-core zur Grundlage für dynamische, datengetriebene Web-Apps. Formulare und Linklisten lassen sich nun vollständig per JSON definieren – ohne zusätzliche Komponenten oder manuellen Code.
- Neue Komponenten
  - Formulare (FormsEngine)
    - `versions/v2/lib/forms.js`
    - Generische Formular-/Fragebogen-Engine
    - JSON-basiertes Rendering (yes/no, select, text, multiline, Endknoten)
    - Navigation mit Weiter/Zurück/Restart
    - Ergebnisansicht & integrierter PDF-Export
    - Rollen- & Attributlogik für komplexe Assessment-Workflows
    - Auto-Init über `data-forms-src`
  - Linklisten (LinkListEngine)
    - `versions/v2/lib/links.js`
    - Dynamische Linklisten aus JSON
    - Kategorien, Tags, Badges, Icons
    - Filter (Kategorie/Tags), Suche, Sortierung
    - Responsives Card-Design im Cherware-Stil
    - Auto-Init über `data-links-src`
  - Design & Layout
    - Optisch überarbeitete Card-Komponenten
    - Verbesserte Abstände, Typografie und Interaktion
    - Optionaler Subtitle im Page Header
    - Konsistentes, responsives Styling für alle Engines
    - Zusammenführung in ein einheitliches UI-Pattern
- Framework-Architektur
  - Einführung der Versionierung unter `/versions/v2` (parallel zu v1)
  - Erweiterte Auto-Initialisierung in `include.js`
  - JSON-basierte Inhalte vollständig ohne zusätzliches HTML/JS definierbar
  - Saubere Trennung zwischen Struktur (HTML), Logik (JS) & Content (JSON)
- Beispieldateien
  - EU AI Act Rollenfragebogen (`simple-forms.json`)  
  - EU AI Act Linkliste (`simple-links.json`)  
  - Minimalbeispiele für Forms & Links
- Kompatibilität
  - v1 bleibt vollständig nutzbar
  - v2 kann schrittweise eingeführt werden
  - Keine Breaking Changes für bestehende Apps  

### v1.5.0 – 2025‑11‑14  
- Initiale Veröffentlichung des Frameworks  
- Komponenten:
  - `lib/components/header.html` – Einheitlicher Header mit App‑Titel  
  - `lib/components/nav-main.html` – Navigation (Desktop + Mobile/Burger)  
  - `lib/components/footer.html` – Footer mit Branding/Link  
- Funktionalitäten:
  - `lib/include.js` – Logik für Navigation, Seitentitel, Breadcrumb, „Zurück“-Button  
  - Neue Web‑Apps definieren nur Inhalte & Struktur: `index.html`, `subX.html`, `config.js`  
- CDN‑Einbindung möglich (stable version v1)

## Kurzüberblick  
- **Grundidee**: Wiederverwendbare Bausteine für Web‑Apps, die rein clientseitig laufen (HTML/JS)  
- **Features**:
  - Minimalistische Struktur, keine Abhängigkeiten  
  - Direkte Auslieferung als statische Seite möglich  
  - Konfigurierbar durch `config.js` / HTML‑Module  
- **Zielgruppe**: Entwickler*innen kleiner bis mittlerer Web‑Apps  

## Weiterführende Dokumentation  
Ausführliche Nutzungshinweise, Konfigurationsoptionen und Beispiele befinden sich im [**Wiki**](../../wiki) des Repositories.
