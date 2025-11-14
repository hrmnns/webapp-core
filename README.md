# WebApp Core Framework

**Ein leichtgewichtiges Framework zur Entwicklung kleiner Web-Apps (Entscheidungstools, Fragebäume, Analyseseiten etc.) ausschließlich mit HTML und JavaScript.** Keine Build-Tools, kein Backend, keine Abhängigkeiten. Die Apps können direkt als statische Seiten gehostet werden (z. B. GitHub Pages, S3, Unternehmens-Intranet).

## Release Notes  
### v1.0.0 – 2025‑11‑14  
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

## Einbindung  
Stabile Version „v1“ des Frameworks:
```html
<script src="config.js"></script>
<script src="https://hrmnns.github.io/webapp-core/versions/v1/lib/include.js" defer></script>
```

## Struktur einer Web-App  
Empfohlenes Projektlayout:
```
meine-webapp/
  index.html
  sub1.html
  sub2.html
  config.js
```

## Beispiel  
Beispiel `index.html`:
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Lädt…</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="config.js"></script>
  <script src="https://hrmnns.github.io/webapp-core/versions/v1/lib/include.js" defer></script>
</head>
<body>
  <div data-include="https://hrmnns.github.io/webapp-core/versions/v1/lib/components/header.html"></div>
  <div data-include="https://hrmnns.github.io/webapp-core/versions/v1/lib/components/nav-main.html"></div>

  <main class="max-w-4xl mx-auto p-4">
    <h2 id="page-title"></h2>
    <div id="toc"></div>
  </main>

  <div data-include="https://hrmnns.github.io/webapp-core/versions/v1/lib/components/footer.html"></div>
</body>
</html>
```

## Weiterführende Dokumentation  
Ausführliche Nutzungshinweise, Konfigurationsoptionen und Beispiele befinden sich im **Wiki** des Repositories.
