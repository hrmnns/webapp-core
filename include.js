// include.js

async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');
  
  await Promise.all(Array.from(includeElements).map(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  }));

  setAppTitle();
  setActiveNavigation();
  setBreadcrumb();
  setupMenuToggle();
}

function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#main-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    const page = window.APP_CONFIG.pages[href];
    if (page) link.textContent = page.title; // <-- Beschriftung aus config.js

    const isActive = href === current;
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

  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

function setAppTitle() {
  const titleElement = document.getElementById("app-title");
  if (titleElement) {
    titleElement.textContent = window.APP_CONFIG.appTitle;
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);
