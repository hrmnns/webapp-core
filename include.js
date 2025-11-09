document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-include]').forEach(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-include]').forEach(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;

    // Wenn Navigation fertig geladen → aktiven Link markieren
    if (file.includes("nav-main.html")) {
      const current = window.location.pathname.split("/").pop();
      document.querySelectorAll("#main-nav .nav-link").forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.remove("bg-blue-600");
          link.classList.add("bg-gray-900", "hover:bg-gray-900");
        }
      });
    }
  });
});

// Breadcrumb automatisch setzen
document.addEventListener("DOMContentLoaded", () => {
  const map = {
    "index.html": "Hauptbereich",
    "sub1.html": "Anbieter vs. Betreiber",
    "sub2.html": "Risiko-Klassifizierung"
  };

  const currentFile = window.location.pathname.split("/").pop();
  const label = map[currentFile] || currentFile;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="text-gray-700 font-medium">${label}</span>`;
  }
});


