// include.js

document.addEventListener("DOMContentLoaded", () => {
  
  // Komponenten einfügen
  document.querySelectorAll('[data-include]').forEach(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;

    // Wenn Navigation geladen wurde → aktive Seite markieren
    if (file.includes("nav-main.html")) {
      const current = window.location.pathname.split("/").pop() || "index.html";

      document.querySelectorAll("#main-nav .nav-link").forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.remove("bg-blue-600", "hover:bg-blue-700");
          link.classList.add("bg-gray-900", "hover:bg-gray-900");
        }
      });
    }
  });

});


// Breadcrumb automatisch setzen, nachdem alle Komponenten eingefügt sind
document.addEventListener("DOMContentLoaded", () => {

  // Zuordnung Datei → Klartext-Bezeichnung
  const map = {
    "index.html": "Hauptbereich",
    "sub1.html": "Sub 1",
    "sub2.html": "Sub 2"
  };

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const label = map[currentFile] || currentFile;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }

});
