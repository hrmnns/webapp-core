// ============================================================================
//  Cherware FormsEngine (v2)
//  - Schönes UI (Cherware Style)
//  - Stepper, Fade-In
//  - Yes/No, Select, Text
//  - Ergebnisansicht mit Rollen/Attributen
//  - Integrierter PDF-Export via jsPDF
//  - Auto-Init + manueller Init
// ============================================================================

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // CHERWARE THEME
  // --------------------------------------------------------------------------
  const CHERWARE_THEME = {
    primary:
      "bg-[#1769ff] text-white hover:bg-blue-500 shadow focus:outline-none focus:ring-2 focus:ring-blue-300",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300",
    accent:
      "bg-emerald-600 text-white hover:bg-emerald-500 shadow focus:outline-none focus:ring-2 focus:ring-emerald-300",

    card:
      "bg-white border border-gray-200 shadow-xl rounded-2xl",

    desc:
      "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3",

    input:
      "rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm " +
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",

    chipBlue: "px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium",
    chipGreen: "px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium",
    chipGray: "px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
  };


  // --------------------------------------------------------------------------
  // FORMS ENGINE
  // --------------------------------------------------------------------------
  class FormsEngine {
    constructor(rootElement, questions) {
      this.root = rootElement;
      this.questions = Array.isArray(questions) ? questions : [];
      this.questionsById = new Map();
      this.questions.forEach(q => this.questionsById.set(q.id, q));

      this.currentQuestionId = null;
      this.history = [];
      this.answers = new Map();

      this.container = document.createElement("div");
      this.container.className = "forms space-y-4";
      this.root.innerHTML = "";
      this.root.appendChild(this.container);

      this.init();
    }

    // ---------------------------------------------------------
    // INIT
    // ---------------------------------------------------------
    init() {
      if (!this.questions.length) {
        this.container.innerHTML =
          "<p class='text-gray-600'>Formular ist leer oder konnte nicht geladen werden.</p>";
        return;
      }

      this.currentQuestionId = this.questions[0].id;
      this.renderCurrentQuestion();
    }

    getQuestion(id) {
      return this.questionsById.get(id);
    }

    // ---------------------------------------------------------
    // Navigation
    // ---------------------------------------------------------
    navigateToNext(next) {
      if (typeof next === "number") {
        this.history.push(this.currentQuestionId);
        this.currentQuestionId = next;
        this.renderCurrentQuestion();
      } else if (typeof next === "string" && next.startsWith("END")) {
        this.renderResult(next);
      } else {
        console.warn("Unbekannter next-Wert:", next);
      }
    }

    navigateBack() {
      if (!this.history.length) return;
      this.currentQuestionId = this.history.pop();
      this.renderCurrentQuestion();
    }

    restart() {
      this.history = [];
      this.answers.clear();
      this.currentQuestionId = this.questions[0].id;
      this.renderCurrentQuestion();
    }

    // ---------------------------------------------------------
    // Rendering der aktuellen Frage
    // ---------------------------------------------------------
    renderCurrentQuestion() {
      const q = this.getQuestion(this.currentQuestionId);
      if (!q) {
        this.container.innerHTML =
          "<p class='text-red-600'>Fehler: Frage nicht gefunden.</p>";
        return;
      }

      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className =
        CHERWARE_THEME.card +
        " p-6 sm:p-8 space-y-5 transition-opacity duration-300 opacity-0";

      // Stepper ------------------------------------------------
      const stepIndicator = document.createElement("div");
      stepIndicator.className =
        "flex items-center justify-between text-xs sm:text-sm text-gray-500";

      const stepText = document.createElement("div");
      stepText.textContent = `Frage ${this.history.length + 1} von ${this.questions.length}`;
      stepText.className = "font-medium";

      const progressOuter = document.createElement("div");
      progressOuter.className =
        "w-32 sm:w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden";

      const progressInner = document.createElement("div");
      const progress =
        ((this.history.length + 1) / Math.max(this.questions.length, 1)) * 100;
      progressInner.style.width = `${progress}%`;
      progressInner.className = "h-full bg-[#1769ff] transition-all duration-300";

      progressOuter.appendChild(progressInner);
      stepIndicator.appendChild(stepText);
      stepIndicator.appendChild(progressOuter);
      card.appendChild(stepIndicator);

      // Titel
      const title = document.createElement("h3");
      title.className = "text-2xl font-bold text-gray-800";
      title.textContent = q.question;
      card.appendChild(title);

      // Beschreibung
      if (q.description) {
        const desc = document.createElement("p");
        desc.className = CHERWARE_THEME.desc;
        desc.textContent = q.description;
        card.appendChild(desc);
      }

      // Body ---------------------------------------------------
      const body = document.createElement("div");
      body.className = "space-y-4";
      card.appendChild(body);

      if (q.type === "yesno") this.renderYesNo(q, body);
      else if (q.type === "select") this.renderSelect(q, body);
      else if (q.type === "text") this.renderText(q, body);
      else body.innerHTML = "<p class='text-red-600'>Unbekannter Fragetyp.</p>";

      // Navigation unten
      const nav = this.buildNavBar();
      card.appendChild(nav);

      this.container.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      });
    }

    // ---------------------------------------------------------
    // Navigation-Bar unten
    // ---------------------------------------------------------
    buildNavBar() {
      const nav = document.createElement("div");
      nav.className =
        "flex flex-wrap gap-2 pt-4 mt-2 border-t border-gray-100";

      const backBtn = document.createElement("button");
      backBtn.textContent = "Zurück";
      backBtn.className =
        "px-4 py-2 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.secondary;
      backBtn.disabled = !this.history.length;
      backBtn.addEventListener("click", () => this.navigateBack());
      nav.appendChild(backBtn);

      const spacer = document.createElement("div");
      spacer.className = "flex-1";
      nav.appendChild(spacer);

      const restartBtn = document.createElement("button");
      restartBtn.textContent = "Neustart";
      restartBtn.className =
        "px-4 py-2 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.secondary;
      restartBtn.addEventListener("click", () => this.restart());
      nav.appendChild(restartBtn);

      return nav;
    }

    // ---------------------------------------------------------
    // YES / NO
    // ---------------------------------------------------------
    renderYesNo(q, container) {
      const row = document.createElement("div");
      row.className = "flex flex-wrap gap-3";

      const yesBtn = document.createElement("button");
      yesBtn.textContent = "Ja";
      yesBtn.className =
        "px-5 py-2.5 rounded-lg font-medium " +
        CHERWARE_THEME.primary;
      yesBtn.addEventListener("click", () => {
        const meta = this.getYesNoMeta(q, true);
        this.storeAnswer(q, { value: true, label: "Ja", meta });
        this.navigateToNext(q.yes?.next);
      });

      const noBtn = document.createElement("button");
      noBtn.textContent = "Nein";
      noBtn.className =
        "px-5 py-2.5 rounded-lg font-medium " +
        CHERWARE_THEME.secondary;
      noBtn.addEventListener("click", () => {
        const meta = this.getYesNoMeta(q, false);
        this.storeAnswer(q, { value: false, label: "Nein", meta });
        this.navigateToNext(q.no?.next);
      });

      row.appendChild(yesBtn);
      row.appendChild(noBtn);
      container.appendChild(row);
    }

    getYesNoMeta(q, isYes) {
      const roles = [];
      const attrs = [];
      if (isYes) {
        (q.roleAddIfYes || []).forEach(r => roles.push(r));
        (q.attributesAddIfYes || []).forEach(a => attrs.push(a));
      } else {
        (q.roleAddIfNo || []).forEach(r => roles.push(r));
        (q.attributesAddIfNo || []).forEach(a => attrs.push(a));
      }
      return { roles, attributes: attrs };
    }

    // ---------------------------------------------------------
    // SELECT
    // ---------------------------------------------------------
    renderSelect(q, container) {
      const label = document.createElement("label");
      label.className = "block text-sm font-medium text-gray-700";
      label.textContent = "Bitte wählen:";
      container.appendChild(label);

      const select = document.createElement("select");
      select.className = "mt-1 block w-full " + CHERWARE_THEME.input;
      container.appendChild(select);

      select.innerHTML = `<option value="">Bitte wählen…</option>`;
      q.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        select.appendChild(o);
      });

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Weiter";
      nextBtn.className =
        "mt-3 px-5 py-2.5 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.primary;
      nextBtn.disabled = true;
      container.appendChild(nextBtn);

      select.addEventListener("change", () => {
        nextBtn.disabled = !select.value;
      });

      nextBtn.addEventListener("click", () => {
        const val = select.value;
        const opt = q.options.find(o => o.value === val);
        this.storeAnswer(q, {
          value: val,
          label: opt.label,
          meta: {
            roles: opt.roleAddIfSelected || [],
            attributes: opt.attributesAddIfSelected || []
          }
        });
        this.navigateToNext(opt.next);
      });
    }

    // ---------------------------------------------------------
    // TEXT
    // ---------------------------------------------------------
    renderText(q, container) {
      const label = document.createElement("label");
      label.className = "block text-sm font-medium text-gray-700";
      label.textContent = "Ihre Antwort:";
      container.appendChild(label);

      const input = q.multiline
        ? document.createElement("textarea")
        : document.createElement("input");

      if (!q.multiline) input.type = "text";
      input.className = CHERWARE_THEME.input + " mt-1 w-full";
      if (q.placeholder) input.placeholder = q.placeholder;
      container.appendChild(input);

      const helper = document.createElement("p");
      helper.className = "text-xs text-gray-500 mt-1";
      helper.textContent = q.required
        ? "Dieses Feld ist verpflichtend."
        : "Dieses Feld ist optional.";
      container.appendChild(helper);

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Weiter";
      nextBtn.className =
        "mt-3 px-5 py-2.5 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.primary;
      container.appendChild(nextBtn);

      nextBtn.addEventListener("click", () => {
        const value = (input.value || "").trim();
        if (q.required && !value) {
          input.classList.add("border-red-500", "focus:ring-red-500");
          input.focus();
          return;
        }

        this.storeAnswer(q, {
          value,
          label: value,
          meta: { roles: [], attributes: [] }
        });

        this.navigateToNext(q.next);
      });
    }

    // ---------------------------------------------------------
    // Speichern
    // ---------------------------------------------------------
    storeAnswer(question, entry) {
      this.answers.set(question.id, { question, ...entry });
    }

    // ---------------------------------------------------------
    // Ergebnis
    // ---------------------------------------------------------
    renderResult(endType) {
      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className =
        CHERWARE_THEME.card +
        " p-6 sm:p-8 space-y-6 transition-opacity duration-300 opacity-0";

      // Titel & Badge
      const title = document.createElement("h3");
      title.className =
        "text-2xl font-bold text-gray-900 flex items-center gap-2";

      const badge = document.createElement("span");
      badge.className = "inline-flex px-3 py-1 rounded-full text-xs font-semibold";

      if (endType === "END_NONE") {
        title.textContent = "Ergebnis: Keine besondere Relevanz";
        badge.textContent = "Info";
        badge.classList.add("bg-gray-100", "text-gray-700");
      } else if (endType === "END_PROVIDER") {
        title.textContent = "Ergebnis: Rolle als Provider";
        badge.textContent = "Provider";
        badge.classList.add("bg-blue-100", "text-blue-700");
      } else if (endType === "END_SUMMARY") {
        title.textContent = "Zusammenfassung";
        badge.textContent = "Summary";
        badge.classList.add("bg-green-100", "text-green-700");
      } else {
        title.textContent = "Ergebnis";
        badge.textContent = "Result";
        badge.classList.add("bg-blue-100", "text-blue-700");
      }

      title.appendChild(badge);
      card.appendChild(title);

      // Rollen & Attribute
      const roleSet = new Set();
      const attrSet = new Set();

      this.answers.forEach(a => {
        (a.meta?.roles || []).forEach(r => roleSet.add(r));
        (a.meta?.attributes || []).forEach(at => attrSet.add(at));
      });

      // Rollen
      const rolesSection = document.createElement("div");
      rolesSection.className = "space-y-2";
      const rolesTitle = document.createElement("h4");
      rolesTitle.className = "text-sm font-semibold text-gray-800";
      rolesTitle.textContent = "Ermittelte Rollen";
      rolesSection.appendChild(rolesTitle);

      const rolesList = document.createElement("div");
      rolesList.className = "flex flex-wrap gap-2";

      if (!roleSet.size) {
        const chip = document.createElement("span");
        chip.className = CHERWARE_THEME.chipGray;
        chip.textContent = "Keine speziellen Rollen ermittelt";
        rolesList.appendChild(chip);
      } else {
        roleSet.forEach(r => {
          const chip = document.createElement("span");
          chip.className = CHERWARE_THEME.chipBlue;
          chip.textContent = r;
          rolesList.appendChild(chip);
        });
      }

      rolesSection.appendChild(rolesList);
      card.appendChild(rolesSection);

      // Attribute
      const attrsSection = document.createElement("div");
      attrsSection.className = "space-y-2";
      const attrsTitle = document.createElement("h4");
      attrsTitle.className = "text-sm font-semibold text-gray-800";
      attrsTitle.textContent = "Ermittelte Attribute";
      attrsSection.appendChild(attrsTitle);

      const attrsList = document.createElement("div");
      attrsList.className = "flex flex-wrap gap-2";

      if (!attrSet.size) {
        const chip = document.createElement("span");
        chip.className = CHERWARE_THEME.chipGray;
        chip.textContent = "Keine zusätzlichen Attribute ermittelt";
        attrsList.appendChild(chip);
      } else {
        attrSet.forEach(a => {
          const chip = document.createElement("span");
          chip.className = CHERWARE_THEME.chipGreen;
          chip.textContent = a;
          attrsList.appendChild(chip);
        });
      }

      attrsSection.appendChild(attrsList);
      card.appendChild(attrsSection);

      // Antworten-Tabelle
      const ansSection = document.createElement("div");
      ansSection.className = "space-y-2";
      const ansTitle = document.createElement("h4");
      ansTitle.className = "text-sm font-semibold text-gray-800";
      ansTitle.textContent = "Antworten im Detail";
      ansSection.appendChild(ansTitle);

      const tableWrapper = document.createElement("div");
      tableWrapper.className =
        "overflow-hidden border border-gray-200 rounded-xl bg-gray-50";

      const table = document.createElement("table");
      table.className = "w-full text-sm border-collapse";

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr class="bg-gray-100 border-b border-gray-200">
          <th class="text-left p-3 text-xs font-semibold text-gray-600 w-1/2">Frage</th>
          <th class="text-left p-3 text-xs font-semibold text-gray-600 w-1/2">Antwort</th>
        </tr>`;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      this.answers.forEach(a => {
        const tr = document.createElement("tr");
        tr.className = "odd:bg-white even:bg-gray-50 border-t border-gray-100";

        const qTd = document.createElement("td");
        qTd.className = "p-3 align-top text-gray-800";
        qTd.textContent = a.question.question;

        const aTd = document.createElement("td");
        aTd.className = "p-3 align-top text-gray-700";
        aTd.textContent = a.label ?? "";

        tr.appendChild(qTd);
        tr.appendChild(aTd);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrapper.appendChild(table);
      ansSection.appendChild(tableWrapper);
      card.appendChild(ansSection);

      // Aktionen ------------------------------------------------
      const actions = document.createElement("div");
      actions.className =
        "flex flex-wrap gap-2 pt-4 mt-2 border-t border-gray-100";

      const backBtn = document.createElement("button");
      backBtn.textContent = "Zurück";
      backBtn.className =
        "px-4 py-2 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.secondary;
      backBtn.disabled = !this.history.length;
      backBtn.addEventListener("click", () => this.navigateBack());
      actions.appendChild(backBtn);

      const spacer = document.createElement("div");
      spacer.className = "flex-1";
      actions.appendChild(spacer);

      const restartBtn = document.createElement("button");
      restartBtn.textContent = "Neustart";
      restartBtn.className =
        "px-4 py-2 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.secondary;
      restartBtn.addEventListener("click", () => this.restart());
      actions.appendChild(restartBtn);

      const pdfBtn = document.createElement("button");
      pdfBtn.textContent = "PDF Export";
      pdfBtn.className =
        "px-4 py-2 rounded-lg text-sm font-medium " +
        CHERWARE_THEME.primary;
      pdfBtn.addEventListener("click", () => this.exportToPdf(endType));
      actions.appendChild(pdfBtn);

      card.appendChild(actions);

      this.container.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      });
    }

    // ---------------------------------------------------------
    // PDF EXPORT
    // ---------------------------------------------------------
    exportToPdf(endType) {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF-Export nicht verfügbar (jsPDF fehlt).");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let y = 15;
      const lineHeight = 7;
      const margin = 15;
      const maxWidth = 180;

      const add = (text, opts = {}) => {
        const fontSize = opts.size || 11;
        const bold = opts.bold || false;
        const extra = opts.extra || 0;

        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");

        const lines = doc.splitTextToSize(text, maxWidth);
        for (const line of lines) {
          if (y > 280) {
            doc.addPage();
            y = 15;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        }
        y += extra;
      };

      // Titel
      let title = "Fragebogen – Ergebnis";
      if (endType === "END_NONE") title = "Ergebnis: Keine besondere Relevanz";
      if (endType === "END_PROVIDER") title = "Ergebnis: Rolle als Provider";
      if (endType === "END_SUMMARY") title = "Zusammenfassung";

      add(title, { size: 16, bold: true, extra: 4 });
      add("Erstellt am: " + new Date().toLocaleString(), { size: 9, extra: 6 });

      // Rollen & Attribute
      const roles = new Set();
      const attrs = new Set();

      this.answers.forEach(a => {
        (a.meta?.roles || []).forEach(r => roles.add(r));
        (a.meta?.attributes || []).forEach(r => attrs.add(r));
      });

      add("Ermittelte Rollen:", { size: 12, bold: true, extra: 2 });
      if (!roles.size) add("• Keine Rollen");
      else roles.forEach(r => add("• " + r));
      y += 4;

      add("Ermittelte Attribute:", { size: 12, bold: true, extra: 2 });
      if (!attrs.size) add("• Keine Attribute");
      else attrs.forEach(a => add("• " + a));
      y += 6;

      // Antworten
      add("Antworten im Detail:", { size: 12, bold: true, extra: 3 });

      this.answers.forEach(a => {
        add("Frage: " + a.question.question, { bold: true });
        add("Antwort: " + (a.label || ""));
        y += 3;
      });

      doc.save("fragebogen-ergebnis.pdf");
    }
  }

  // -----------------------------------------------------------
  // Auto-Init (optional)
  // -----------------------------------------------------------
  function autoInit() {
    const root = document.querySelector("[data-forms-src]");
    if (!root) return;

    const src = root.getAttribute("data-forms-src");
    if (!src) {
      root.innerHTML = "<p class='text-red-600'>Keine Formularquelle angegeben.</p>";
      return;
    }

    fetch(src)
      .then(r => r.json())
      .then(json => new FormsEngine(root, json))
      .catch(err => {
        root.innerHTML =
          "<p class='text-red-600'>Fehler beim Laden des Formulars: " +
          err.message +
          "</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  // -----------------------------------------------------------
  // Manuelle Initialisierung
  // -----------------------------------------------------------
  window.WebAppCoreForms = {
    init(root, json) {
      return new FormsEngine(root, json);
    }
  };

})();
