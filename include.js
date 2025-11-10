document.addEventListener("DOMContentLoaded", loadComponents);

async function loadComponents() {
  const includeEls = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includeEls).map(async el => {
    const file = el.getAttribute("data-include");
    const res = await fetch(file);
    el.innerHTML = await res.text();
  }));

  buildNavigation();
  applyBurgerConfig();
  setActiveNavigation();
  setBreadcrumb();
  setAppTitle();
  setVisiblePageTitle();
  setTabTitle();
  setupMenuToggle();
  buildTableOfContents();
}

/* Navigation dynamisch aus config */
function buildNavigation() {
  const nav = document.getElementById("main-nav");
  if (!nav || !window.APP_CONFIG?.pages) return;

  nav.innerHTML = ""; // sauber starten

  Object.entries(window.APP_CONFIG.pages).forEach(([file, cfg]) => {
    if (cfg.showInNav === false) return;
    const a = document.createElement("a");
    a.href = file;
    a.textContent = cfg.title;
    card.className =
      "block rounded-xl p-4 shadow-sm transition border border-gray-100 bg-gray-100 hover:bg-gray-200 hover:shadow-md";

    nav.appendChild(a);
  });

  // Sicherheitsnetz: Falls hier dennoch Bilder landen, entfernen.
  nav.querySelectorAll("img").forEach(img => img.remove());
}

/* Aktiver Link Style */
function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#main-nav .nav-link").forEach(link => {
    const active = link.getAttribute("href") === current;
    link.classList.remove("bg-blue-600", "bg-gray-900", "text-white", "hover:bg-blue-700", "hover:bg-gray-900");
    if (active) link.classList.add("bg-gray-900", "text-white", "hover:bg-gray-900");
    else link.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
  });
}

/* Breadcrumb */
function setBreadcrumb() {
  if (window.APP_CONFIG?.showBreadcrumb === false) {
    const bc = document.getElementById("breadcrumb");
    if (bc) bc.remove();
    return;
  }
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = window.APP_CONFIG?.pages?.[current]?.title || current;
  const el = document.getElementById("breadcrumb");
  if (el) el.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
}

/* Sichtbare Titel */
function setAppTitle() {
  const el = document.getElementById("app-title");
  if (el) el.textContent = window.APP_CONFIG?.appTitle || document.title || "Web-App";
}

function setVisiblePageTitle() {
  const el = document.getElementById("page-title");
  if (!el) return;
  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = window.APP_CONFIG?.pages?.[current]?.title || current;
  el.textContent = label;
}

/* Tab-Titel */
function setTabTitle() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const app = window.APP_CONFIG?.appTitle || "Web-App";
  const page = window.APP_CONFIG?.pages?.[current]?.title || current;
  document.title = `${page} – ${app}`;
}

/* Burger-Config anwenden */
function applyBurgerConfig() {
  const enabled = window.APP_CONFIG?.enableBurgerMenu !== false; // default: an
  const btn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!btn || !nav) return;

  if (!enabled) {
    // Burger-Button verstecken, Menü immer sichtbar machen
    btn.classList.add("hidden");
    nav.classList.remove("hidden");
  } else {
    // Standard: mobil hidden, Desktop sichtbar (md:flex in HTML vorhanden)
    btn.classList.remove("hidden");
    // auf kleinen Screens initial einklappen
    if (window.matchMedia("(max-width: 767px)").matches) nav.classList.add("hidden");
  }
}

/* Burger-Interaktion */
function setupMenuToggle() {
  const btn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    nav.classList.toggle("hidden");
  });
}

function buildTableOfContents() {
  const cfg = window.APP_CONFIG;
  const toc = document.getElementById("toc");
  if (!cfg || !cfg.pages || !toc) return;

  toc.innerHTML = `
    <h2 class="text-lg font-semibold text-gray-800 mb-3">Bereiche</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
  `;

  const grid = toc.querySelector("div.grid");

  Object.entries(cfg.pages).forEach(([file, page]) => {
    if (file === "index.html" || page.showInNav === false) return;

    const card = document.createElement("a");
    card.href = file;
    card.className =
      "block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition hover:border-gray-300";
    card.innerHTML = `
      <div class="text-gray-800 font-medium">${page.title}</div>
      <div class="text-sm text-gray-500 mt-1">Weiter zum Bereich</div>
    `;
    grid.appendChild(card);
  });
}

