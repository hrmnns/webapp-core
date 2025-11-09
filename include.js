// include.js

async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');
  
  await Promise.all(Array.from(includeElements).map(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  }));

  setActiveNavigation();
  setBreadcrumb();
  setupMenuToggle();
}

function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#main-nav .nav-link").forEach(link => {
    const isActive = link.getAttribute("href") === current;

    // Einheitliche Basis
    link.classList.remove("bg-blue-600", "bg-gray-900", "text-white", "hover:bg-blue-700", "hover:bg-gray-900");

    if (isActive) {
      link.classList.add("bg-gray-900", "text-white", "hover:bg-gray-900");
    } else {
      link.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
    }
  });
}

function setBreadcrumb() {
  const map = {
    "index.html": "Hauptbereich",
    "sub1.html": "Anbieter vs. Betreiber",
    "sub2.html": "Risiko-Klassifizierung"
  };

  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = map[current] || current;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }
}

function setupMenuToggle() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);
