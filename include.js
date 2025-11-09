document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-include]').forEach(async (element) => {
    const file = element.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  });
});
