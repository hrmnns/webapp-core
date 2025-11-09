// include.js

async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');

  await Promise.all(Array.from(includeElements).map(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  }));

  buildNavigation();
  setActiveNavigation();
  setBreadcrumb();
  setAppTitle();
  setPageTitle(); 
  setVisiblePageTitle();
  setupMenuToggle();
}

/* Dynamische Navigation */
function buildNavigation() {
  const navContainer = document.getElementById("main-nav");
  if (!navContainer) return;

  navContainer.innerHTML = "";

  Object.entries(window.APP_CONFIG.pages).forEach(([file, config]) => {
    if (config.showInNav === false) return;

    const link = document.createElement("a");
    link.href = file;
    link.textContent = config.title;
    link.className = "nav-link block text-center px-5 py-2.5 rounded-xl transition shadow-sm";
    navContainer.appendChild(link);
  });
}

/* Aktiver Menüpunkt */
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

/* Breadcrumb */
function setBreadcrumb() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = window.APP_CONFIG.pages[current]?.title || current;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }
}

/* Dynamischer Header-Titel */
function setAppTitle() {
  const titleElement = document.getElementById("app-title");
  if (titleElement) {
    titleElement.textContent = window.APP_CONFIG.appTitle;
  }
}

/* Browser-Tab Titel dynamisch setzen */
function setPageTitle() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const appName = window.APP_CONFIG.appTitle;
  const pageName = window.APP_CONFIG.pages[current]?.title || current;

  document.title = `${pageName} – ${appName}`;
}

function setVisiblePageTitle() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = window.APP_CONFIG.pages[current]?.title;
  const el = document.getElementById("page-title");
  if (el && label) el.textContent = label;
}

/* Burger-Menü (iPhone-kompatibel) */
function setupMenuToggle() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");
  if (!button || !menu) return;

  button.onclick = () => {
    menu.classList.toggle("hidden");
  };
}

document.addEventListener("DOMContentLoaded", loadComponents);
