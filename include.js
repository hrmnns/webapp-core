// include.js  — robuste Reihenfolge, Guard-Checks, keine Abhängigkeiten auf Hoisting

/* ===== Helper-Funktionen ===== */

function buildNavigation() {
  const cfg = window.APP_CONFIG;
  const nav = document.getElementById("main-nav");
  if (!cfg || !cfg.pages || !nav) return;

  nav.innerHTML = "";
  Object.entries(cfg.pages).forEach(([file, page]) => {
    if (page.showInNav === false) return;
    const a = document.createElement("a");
    a.href = file;
    a.textContent = page.title || file;
    a.className = "nav-link block text-center px-5 py-2.5 rounded-xl transition shadow-sm";
    nav.appendChild(a);
  });
}

function applyMobileMenuVisibility() {
  const cfg = window.APP_CONFIG;
  const mobileHeader = document.getElementById("mobile-nav-header");
  const nav = document.getElementById("main-nav");

  if (!cfg || !mobileHeader || !nav) return;

  if (cfg.showMobileMenu === false) {
    mobileHeader.classList.add("hidden");
    nav.classList.remove("hidden");    // Navigation immer sichtbar
    nav.classList.add("md:flex");      // Desktop-Stil behalten
  }
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
  const cfg = window.APP_CONFIG;
  const bc = document.getElementById("breadcrumb");
  if (!bc) return;
  if (cfg && cfg.showBreadcrumb === false) {
    bc.remove();
    return;
  }
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = (cfg && cfg.pages && cfg.pages[current] && cfg.pages[current].title) || current;
  bc.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
}

function setAppTitle() {
  const el = document.getElementById("app-title");
  const cfg = window.APP_CONFIG;
  if (el && cfg && cfg.appTitle) el.textContent = cfg.appTitle;
}

function setVisiblePageTitle() {
  const el = document.getElementById("page-title");
  const cfg = window.APP_CONFIG;
  if (!el || !cfg || !cfg.pages) return;
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = cfg.pages[current] && cfg.pages[current].title;
  if (label) el.textContent = label;
}

function setPageTitle() {
  const cfg = window.APP_CONFIG;
  if (!cfg) return;
  const current = window.location.pathname.split("/").pop() || "index.html";
  const pageName = (cfg.pages && cfg.pages[current] && cfg.pages[current].title) || current;
  const appName = cfg.appTitle || document.title || "App";
  document.title = `${pageName} – ${appName}`;
}

function setupMenuToggle() {
  const btn = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");
  if (!btn || !menu) return;
  btn.onclick = () => menu.classList.toggle("hidden");
}

/* ===== Bootstrap: Komponenten laden und erst dann UI aufbauen ===== */

async function loadComponents() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(Array.from(nodes).map(async (n) => {
    const file = n.getAttribute("data-include");
    const res = await fetch(file);
    n.innerHTML = await res.text();
  }));

  // Ab hier existieren Header/Nav/Footer im DOM
  buildNavigation();
  applyMobileMenuVisibility();
  setActiveNavigation();
  setBreadcrumb();
  setAppTitle();
  setVisiblePageTitle();
  setPageTitle();
  setupMenuToggle();
}

document.addEventListener("DOMContentLoaded", loadComponents);
