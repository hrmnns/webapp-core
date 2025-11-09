// include.js

async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');
  
  await Promise.all(Array.from(includeElements).map(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  }));

  buildNavigation();      // 1) Navigation erzeugen
  setActiveNavigation();  // 2) Aktiven Menüpunkt markieren
  setBreadcrumb();        // 3) Breadcrumb setzen
  setAppTitle();          // 4) Header-Titel setzen
  setupMenuToggle();      // 5) Burger-Menu erst jetzt aktivieren
}

function buildNavigation() {
  const navContainer = document.getElementById("main-nav");
  if (!navContainer) return;

  navContainer.innerHTML = ""; // leeren

  Object.entries(window.APP_CONFIG.pages).forEach(([file, config]) => {
    if (!config.showInNav) return;

    const link = document.createElement("a");
    link.href = file;
    link.textContent = config.title;
    link.className = "nav-link block text-center px-4 py-2 rounded-lg transition";
    navContainer.appendChild(link);
  });
}

function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#main-nav .nav-link").forEach(link => {
    const isActive = link.getAttribute("href") === current;

    link.classList.remove("bg-blue-600", "bg-gray-900", "text-white", "hover:bg-blue-700", "hover:bg-gray-900");

    if (isActive) {
      link.classList.add("bg-gray-900", "text-white", "hover:bg-gray-900");
    } else {
      link.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
    }
  });
}

function setBreadcrumb() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  const label = window.APP_CONFIG.pages[current]?.title || current;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }
}

function setupMenuToggle() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");

  if (!button || !menu) return;

  // iOS Safari benötigt onclick statt addEventListener in manchen Fällen
  button.onclick = () => {
    menu.classList.toggle("hidden");
  };
}

function setAppTitle() {
  const titleElement = document.getElementById("app-title");
  if (titleElement) {
    titleElement.textContent = window.APP_CONFIG.appTitle;
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);
