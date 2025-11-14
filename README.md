# WebApp Core Framework

**Ein leichtgewichtiges Framework zur Entwicklung kleiner Web-Apps (Entscheidungstools, Fragebäume, Analyseseiten etc.) ausschließlich mit HTML und JavaScript.** Keine Build-Tools, kein Backend, keine Abhängigkeiten. Die Apps können direkt als statische Seiten gehostet werden (z. B. GitHub Pages, S3, Unternehmens-Intranet).

## Release Notes  
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
