document.addEventListener("DOMContentLoaded", loadComponents);

async function loadComponents() {
  const includeEls = document.querySelectorAll('[data-include]');

  await Promise.all(Array.from(includeEls).map(async el => {
    const file = el.getAttribute("data-include");
    const res = await fetch(file);
    el.innerHTML = await res.text();
  }));

  buildNavigation();
  applyDesktopMenuVisibility();
  applyMobileMenuVisibility();
  applyBackButtonVisibility();
  setActiveNavigation();
  setBreadcrumb();
  setAppTitle();
  setVisiblePageTitle();
  setTabTitle();
  setupMenuToggle();
  buildTableOfContents(); // optional TOC
}

/* ---------------------------
   Navigation dynamisch bauen
---------------------------- */
function buildNavigation() {
  const cfg = window.APP_CONFIG;
  const desktop = document.getElementById("desktop-nav");
  const mobile = document.getElementById("mobile-nav");

  if (!cfg || !cfg.pages || !desktop || !mobile) return;

  desktop.innerHTML = "";
  mobile.innerHTML = "";

  Object.entries(cfg.pages).forEach(([file, page]) => {
    if (page.showInNav === false) return;

    // Desktop menu entry
    const d = document.createElement("a");
    d.href = file;
    d.textContent = page.title;
    d.className = "block px-5 py-2.5 rounded-xl shadow-sm transition";
    desktop.appendChild(d);

    // Mobile menu entry
    const m = d.cloneNode(true);
    mobile.appendChild(m);
  });

  // Falls doch irgendwo ein Icon reinrutscht → hart entfernen
  mobile.querySelectorAll("img").forEach(img => img.remove());
}




/* ---------------------------
   Desktop-Menü-Steuerung
---------------------------- */
function applyDesktopMenuVisibility() {
  const show = window.APP_CONFIG.enableMenu !== false;
  const desktop = document.getElementById("desktop-nav");
  if (!desktop) return;

  if (show) {
    desktop.classList.remove("hidden");
    desktop.classList.add("flex");   // aktiv sichtbar
  } else {
    desktop.classList.add("hidden");
    desktop.classList.remove("flex"); // vollständig weg
  }
}


/* ---------------------------
   Mobile-Menü-Steuerung
---------------------------- */
function applyMobileMenuVisibility() {
  const show = window.APP_CONFIG.enableBurgerMenu !== false;
  const mobileHeader = document.getElementById("mobile-nav-header");
  const mobileMenu = document.getElementById("mobile-nav");
  const burger = document.getElementById("menu-toggle");

  if (!mobileHeader || !mobileMenu || !burger) return;

  // Burger aus → mobile Menü dauerhaft sichtbar
  if (!show) {
    mobileHeader.classList.add("hidden");
    burger.classList.add("hidden");
    mobileMenu.classList.remove("hidden");
  } else {
    mobileHeader.classList.remove("hidden");
    burger.classList.remove("hidden");
  }
}

function applyBackButtonVisibility() {
  const showMenu = window.APP_CONFIG.enableMenu !== false;
  const backBtn = document.getElementById("back-button");
  if (!backBtn) return;

  if (!showMenu) {
    // Menü ist aus → Zurück-Button einblenden
    backBtn.classList.remove("hidden");
  } else {
    // Menü ist an → Zurück-Button ausblenden
    backBtn.classList.add("hidden");
  }
}

/* ---------------------------
   Aktiven Link hervorheben
---------------------------- */
function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#desktop-nav a, #mobile-nav a").forEach(link => {
    const active = link.getAttribute("href") === current;
    link.classList.remove("bg-blue-600", "bg-gray-900", "text-white", "hover:bg-blue-700", "hover:bg-gray-900");

    if (active) {
      link.classList.add("bg-gray-900", "text-white", "hover:bg-gray-900");
    } else {
      link.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
    }
  });
}

/* ---------------------------
   Breadcrumb
---------------------------- */
function setBreadcrumb() {
  if (window.APP_CONFIG.showBreadcrumb === false) {
    const bc = document.getElementById("breadcrumb");
    if (bc) bc.remove();
    return;
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  const label = window.APP_CONFIG.pages[current]?.title || current;
  const el = document.getElementById("breadcrumb");

  if (el) el.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
}

/* ---------------------------
   Titel
---------------------------- */
function setAppTitle() {
  const el = document.getElementById("app-title");
  if (el) el.textContent = window.APP_CONFIG.appTitle;
}

function setVisiblePageTitle() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const pageConfig = window.APP_CONFIG.pages[current];

  const elTitle = document.getElementById("page-title");
  const elSubtitle = document.getElementById("page-subtitle");

  // 1. Titel setzen (Pflicht)
  if (elTitle && pageConfig?.title) {
    elTitle.textContent = pageConfig.title;
  }

  // 2. Untertitel setzen (optional)
  if (elSubtitle) {
    if (pageConfig?.subtitle) {
      elSubtitle.textContent = pageConfig.subtitle;
      elSubtitle.classList.remove("hidden");
    } else {
      elSubtitle.classList.add("hidden");
    }
  }
}


function setTabTitle() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const app = window.APP_CONFIG.appTitle;
  const page = window.APP_CONFIG.pages[current]?.title || current;
  document.title = `${page} – ${app}`;
}

/* ---------------------------
   Burger-Menü Interaktion
---------------------------- */
function setupMenuToggle() {
  const btn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-nav");
  if (!btn || !mobileMenu) return;

  btn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}


/* ---------------------------
   Inhaltsübersicht auf Index
---------------------------- */
function buildTableOfContents() {
  const toc = document.getElementById("toc");
  const cfg = window.APP_CONFIG;
  if (!toc || !cfg || !cfg.pages) return;

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
      "block rounded-xl p-4 shadow-sm transition border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:shadow-md";
    card.innerHTML = `
      <div class="text-gray-800 font-medium">${page.title}</div>
      <div class="text-sm text-gray-500 mt-1">Weiter zum Bereich</div>
    `;
    grid.appendChild(card);
  });
}
