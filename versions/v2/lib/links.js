// ============================================================================
//  Cherware LinkListEngine v2
//  - Kategorien
//  - Icons pro Link
//  - Badges
//  - Tags
//  - Suche
//  - Filter
//  - Sortierung
// ============================================================================

(function () {
  "use strict";

  const CHERWARE_THEME = {
    card: "bg-white border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8",
    title: "text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight",
    subtitle: "text-gray-500 text-lg mt-1",
    listContainer: "space-y-4",
    listItem: "p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col gap-3",
    linkTitle: "text-lg font-semibold text-blue-700 hover:text-blue-900",
    linkDesc: "text-gray-600 text-sm",
    badge: "px-2 py-1 rounded-full text-xs font-medium",
    badgeBlue: "bg-blue-50 text-blue-700",
    badgeGold: "bg-yellow-50 text-yellow-700",
    badgeGray: "bg-gray-100 text-gray-600",
    tag: "px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 font-medium border border-gray-200",
    icon: "w-6 h-6 text-[#1769ff]",
    filterBox: "flex flex-wrap items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded-2xl mb-4",
    searchInput: "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  };

  const ICONS = {
    external:`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4V3H3v6h2V5zm0 14h4v2H3v-6h2v4zm14 0v-4h2v6h-6v-2h4z"/></svg>`,
    document:`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zM14 3.5V9h5.5z"/></svg>`,
    article:`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14v2H5zm0 4h14v2H5zm0 4h8v2H5zm0 4h8v2H5z"/></svg>`,
    gavel:`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 20h20v2H2zM7.5 7.91L13.59 2l1.41 1.41L8.91 9.32zM5.08 10.33l6.09-6.09L12.58 7 6.5 13.09zM14 11l7 7-1.41 1.41-7-7z"/></svg>`,
    building:`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18v-2H3zm2-4h14V3H5zM9 7h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>`
  };

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  }

  class LinkListEngine {
    constructor(root, json) {
      this.root = root;
      this.data = json;
      this.selectedCategory = "ALL";
      this.selectedTags = new Set();
      this.searchQuery = "";
      this.sortMode = "az";
      this.render();
    }

    getCategories() {
      const categories = new Set();
      (this.data.categories || []).forEach(c => categories.add(c.name));
      this.data.links.forEach(l => {
        if (l.category) categories.add(l.category);
      });
      return Array.from(categories);
    }

    getAllTags() {
      const tags = new Set();
      (this.data.links || []).forEach(l => (l.tags || []).forEach(t => tags.add(t)));
      return Array.from(tags);
    }

    render() {
      this.root.innerHTML = "";
      const wrapper = el("div", CHERWARE_THEME.card + " space-y-6");
      if (this.data.title) wrapper.appendChild(el("h2", CHERWARE_THEME.title, this.data.title));
      if (this.data.subtitle) wrapper.appendChild(el("p", CHERWARE_THEME.subtitle, this.data.subtitle));

      const filterBar = this.createFilterBar();
      wrapper.appendChild(filterBar);

      this.listContainer = el("div", CHERWARE_THEME.listContainer);
      wrapper.appendChild(this.listContainer);
      this.root.appendChild(wrapper);

      this.renderList();
    }

    createFilterBar() {
      const box = el("div", CHERWARE_THEME.filterBox);

      const searchInput = el("input", CHERWARE_THEME.searchInput);
      searchInput.type = "text";
      searchInput.placeholder = "Suche...";
      searchInput.addEventListener("input", () => {
        this.searchQuery = searchInput.value.toLowerCase();
        this.renderList();
      });

      box.appendChild(searchInput);
      return box;
    }

    renderList() {
      this.listContainer.innerHTML = "";
      let links = [...this.data.links];

      if (this.searchQuery) {
        links = links.filter(l =>
          (l.label + " " + l.description).toLowerCase().includes(this.searchQuery)
        );
      }

      links.forEach(link => {
        const item = el("a", CHERWARE_THEME.listItem);
        item.href = link.url;
        item.target = "_blank";

        const title = el("div", CHERWARE_THEME.linkTitle, link.label);
        const desc = el("div", CHERWARE_THEME.linkDesc, link.description || "");

        item.appendChild(title);
        item.appendChild(desc);

        this.listContainer.appendChild(item);
      });
    }
  }

  function autoInit() {
    document.querySelectorAll("[data-links-src]").forEach(root => {
      fetch(root.getAttribute("data-links-src"))
        .then(r => r.json())
        .then(json => new LinkListEngine(root, json))
        .catch(err => {
          root.innerHTML = "Fehler beim Laden: " + err.message;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  window.WebAppCoreLinks = {
    init(root, json) {
      return new LinkListEngine(root, json);
    }
  };
})();
