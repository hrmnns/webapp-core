// include.js

async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');
  
  const loadPromises = Array.from(includeElements).map(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  });

  // Warten, bis alles geladen ist
  await Promise.all(loadPromises);

  setActiveNavigation();
  setBreadcrumb();
}

function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#main-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.remove("bg-blue-600", "hover:bg-blue-700");
      link.classList.add("bg-gray-900", "hover:bg-gray-900");
    }
  });
}

function setBreadcrumb() {
  const map = {
    "index.html": "Hauptbereich",
    "sub1.html": "Anbieter vs. Betreiber",
    "sub2.html": "Risiko-Klassifizierung"
  };

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const label = map[currentFile] || currentFile;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);
