# WebApp Core Framework

Ein leichtgewichtiges Framework zur Entwicklung kleiner Web-Apps (Entscheidungstools, Fragebäume,
Analyseseiten etc.) ausschließlich mit HTML und JavaScript.  
Keine Build-Tools, kein Backend, keine Abhängigkeiten.  
Die Apps können direkt als statische Seiten gehostet werden (z. B. GitHub Pages, S3, Unternehmens-Intranet).

---

## Grundidee

Das Framework stellt wiederverwendbare Bausteine bereit:

| Datei | Aufgabe |
|---|---|
| `lib/components/header.html` | Einheitlicher Header mit App-Titel |
| `lib/components/nav-main.html` | Navigation (Desktop + Mobile / Burger-Menü) |
| `lib/components/footer.html` | Footer mit Branding / Link |
| `lib/include.js` | Logik für Navigation, Seitentitel, Breadcrumb, „Zurück“-Button usw. |

Neue Web-Apps definieren nur Inhalte und Struktur:

| Datei (pro App) | Aufgabe |
|---|---|
| `index.html` | Startseite / Inhaltsübersicht |
| `subX.html` | Unterseiten / Module |
| `config.js` | App-Konfiguration (Titel, Navigation usw.) |

---

## CDN-Einbindung

Stabile Version `v1` des Frameworks:

```
https://hrmnns.github.io/webapp-core/versions/v1/lib/
```

Einbinden in jeder HTML-Seite:

```html
<script src="config.js"></script>
<script src="https://hrmnns.github.io/webapp-core/versions/v1/lib/include.js" defer></script>
```

---

## Struktur einer Web-App

Empfohlenes Projektlayout:

```
meine-webapp/
  index.html
  sub1.html
  sub2.html
  config.js
```

---

## Beispiel `config.js`

```javascript
window.APP_CONFIG = {
  appTitle: "Meine Web-App",
  enableMenu: true,
  enableBurgerMenu: true,
  showBreadcrumb: true,

  pages: {
    "index.html": { title: "Startseite", showInNav: true },
    "sub1.html":  { title: "Modul A", showInNav: true },
    "sub2.html":  { title: "Modul B", showInNav: true }
  }
};
```

---

## Beispiel `index.html`

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
    <div id="toc"></div> <!-- Inhaltsverzeichnis wird automatisch erzeugt -->
  </main>

  <div data-include="https://hrmnns.github.io/webapp-core/versions/v1/lib/components/footer.html"></div>

</body>
</html>
```

---

## Beispiel `sub1.html`

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

    <!-- Eigene Inhalte -->
    <p>Hier steht das Modul A.</p>
  </main>

  <div data-include="https://hrmnns.github.io/webapp-core/versions/v1/lib/components/footer.html"></div>

</body>
</html>
```

---

## Lizenz
MIT
