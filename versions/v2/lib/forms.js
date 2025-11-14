// versions/v2/lib/forms.js
// Generischer Formular- und Fragebogen-Renderer für webapp-core v2
// Erwartet entweder:
//  - ein Element mit data-forms-src="<pfad-zur-json-datei>" (Auto-Init)
//  - oder manuellen Aufruf: WebAppCoreForms.init(rootElement, jsonArray)

(function () {
  "use strict";

  class FormsEngine {
    constructor(rootElement, questions) {
      this.root = rootElement;
      this.questions = Array.isArray(questions) ? questions : [];
      this.questionsById = new Map();
      this.questions.forEach(q => this.questionsById.set(q.id, q));

      this.currentQuestionId = null;
      this.history = [];
      this.answers = new Map();

      // Hauptcontainer im Root erzeugen
      this.container = document.createElement("div");
      this.container.className = "forms space-y-4";
      this.root.innerHTML = "";
      this.root.appendChild(this.container);

      this.init();
    }

    // --------------------------------
    // Initialisierung
    // --------------------------------
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

    // --------------------------------
    // Navigation
    // --------------------------------
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
      if (this.history.length === 0) return;
      const prevId = this.history.pop();
      this.currentQuestionId = prevId;
      this.renderCurrentQuestion();
    }

    restart() {
      this.history = [];
      this.answers.clear();
      this.currentQuestionId = this.questions[0]?.id ?? null;
      this.renderCurrentQuestion();
    }

    // --------------------------------
    // Rendering: aktuelle Frage
    // --------------------------------
    renderCurrentQuestion() {
      const q = this.getQuestion(this.currentQuestionId);
      if (!q) {
        this.container.innerHTML =
          "<p class='text-red-600'>Fehler: Formularpunkt nicht gefunden.</p>";
        return;
      }

      // Container leeren
      this.container.innerHTML = "";

      // Card-Hülle
      const card = document.createElement("div");
      card.className =
        "bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-5 border border-gray-100 " +
        "transition-opacity duration-300 opacity-0";

      // Stepper: Fortschrittsanzeige
      const stepIndicator = document.createElement("div");
      stepIndicator.className = "flex items-center justify-between text-xs sm:text-sm text-gray-500";

      const stepText = document.createElement("div");
      stepText.textContent = `Frage ${this.history.length + 1} von ${this.questions.length}`;
      stepText.className = "font-medium";

      const progressOuter = document.createElement("div");
      progressOuter.className = "w-32 sm:w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden";

      const progressInner = document.createElement("div");
      const progress =
        ((this.history.length + 1) / Math.max(this.questions.length, 1)) * 100;
      progressInner.style.width = `${progress}%`;
      progressInner.className = "h-full bg-blue-500 transition-all duration-300";

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
        desc.className =
          "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3";
        desc.textContent = q.description;
        card.appendChild(desc);
      }

      // Body für Steuerelemente
      const body = document.createElement("div");
      body.className = "space-y-4";
      card.appendChild(body);

      switch (q.type) {
        case "yesno":
          this.renderYesNo(q, body);
          break;
        case "select":
          this.renderSelect(q, body);
          break;
        case "text":
          this.renderText(q, body);
          break;
        default:
          body.innerHTML =
            "<p class='text-red-600'>Unbekannter Fragetyp. Bitte prüfen Sie die JSON-Definition.</p>";
      }

      // Navigationsleiste unten
      const nav = this.buildNavBar();
      card.appendChild(nav);

      this.container.appendChild(card);

      // Fade-in Animation
      requestAnimationFrame(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      });
    }

    buildNavBar() {
      const nav = document.createElement("div");
      nav.className = "flex flex-wrap gap-2 pt-4 mt-2 border-t border-gray-100";

      // Zurück
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.textContent = "Zurück";
      backBtn.className =
        "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium " +
        "hover:bg-gray-50 transition disabled:opacity-40";
      backBtn.disabled = this.history.length === 0;
      backBtn.addEventListener("click", () => this.navigateBack());
      nav.appendChild(backBtn);

      // Rechtsbündig: Neustart
      const spacer = document.createElement("div");
      spacer.className = "flex-1";
      nav.appendChild(spacer);

      const restartBtn = document.createElement("button");
      restartBtn.type = "button";
      restartBtn.textContent = "Neustart";
      restartBtn.className =
        "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium " +
        "hover:bg-gray-50 transition";
      restartBtn.addEventListener("click", () => this.restart());
      nav.appendChild(restartBtn);

      return nav;
    }

    // --------------------------------
    // Fragetyp: Yes/No
    // --------------------------------
    renderYesNo(q, container) {
      const row = document.createElement("div");
      row.className = "flex flex-wrap gap-3";

      const yesBtn = document.createElement("button");
      yesBtn.type = "button";
      yesBtn.textContent = "Ja";
      yesBtn.className =
        "px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold " +
        "shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400";

      yesBtn.addEventListener("click", () => {
        const meta = this.getYesNoMeta(q, true);
        this.storeAnswer(q, { value: true, label: "Ja", meta });
        this.navigateToNext(q.yes?.next);
      });

      const noBtn = document.createElement("button");
      noBtn.type = "button";
      noBtn.textContent = "Nein";
      noBtn.className =
        "px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 text-sm font-semibold " +
        "hover:bg-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300";

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

    // --------------------------------
    // Fragetyp: Select
    // --------------------------------
    renderSelect(q, container) {
      if (!Array.isArray(q.options) || q.options.length === 0) {
        container.innerHTML =
          "<p class='text-red-600'>Keine Optionen definiert.</p>";
        return;
      }

      const label = document.createElement("label");
      label.className = "block text-sm font-medium text-gray-700";
      label.textContent = "Bitte wählen:";
      container.appendChild(label);

      const select = document.createElement("select");
      select.className =
        "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 " +
        "text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
      select.innerHTML = `<option value="">Bitte wählen…</option>`;
      container.appendChild(select);

      q.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        select.appendChild(o);
      });

      const helper = document.createElement("p");
      helper.className = "text-xs text-gray-500 mt-1";
      helper.textContent = "Wählen Sie eine Option aus und klicken Sie dann auf „Weiter“.";
      container.appendChild(helper);

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.textContent = "Weiter";
      nextBtn.className =
        "mt-3 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold " +
        "shadow hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed";
      nextBtn.disabled = true;
      container.appendChild(nextBtn);

      select.addEventListener("change", () => {
        nextBtn.disabled = !select.value;
      });

      nextBtn.addEventListener("click", () => {
        const val = select.value;
        const opt = q.options.find(o => o.value === val);
        if (!opt) return;

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

    // --------------------------------
    // Fragetyp: Text
    // --------------------------------
    renderText(q, container) {
      const label = document.createElement("label");
      label.className = "block text-sm font-medium text-gray-700";
      label.textContent = "Ihre Antwort:";
      container.appendChild(label);

      const input = q.multiline
        ? document.createElement("textarea")
        : document.createElement("input");

      if (!q.multiline) input.type = "text";

      input.className =
        "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 " +
        "text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

      if (q.placeholder) {
        input.placeholder = q.placeholder;
      }

      const helper = document.createElement("p");
      helper.className = "text-xs text-gray-500 mt-1";
      helper.textContent = q.required
        ? "Dieses Feld ist verpflichtend."
        : "Dieses Feld ist optional.";
      container.appendChild(input);
      container.appendChild(helper);

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.textContent = "Weiter";
      nextBtn.className =
        "mt-3 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold " +
        "shadow hover:bg-blue-500";
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

    // --------------------------------
    // Antworten speichern
    // --------------------------------
    storeAnswer(question, entry) {
      this.answers.set(question.id, { question, ...entry });
    }

    // --------------------------------
    // Ergebnisansicht
    // --------------------------------
    renderResult(endType) {
      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className =
        "bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-200 " +
        "transition-opacity duration-300 opacity-0";

      // Titel
      const title = document.createElement("h3");
      title.className = "text-2xl font-bold text-gray-900 flex items-center gap-2";

      const badge = document.createElement("span");
      badge.className =
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

      switch (endType) {
        case "END_NONE":
          title.textContent = "Ergebnis: Keine besondere Relevanz";
          badge.textContent = "Info";
          badge.classList.add("bg-gray-100", "text-gray-700");
          break;
        case "END_PROVIDER":
          title.textContent = "Ergebnis: Rolle als Provider";
          badge.textContent = "Provider";
          badge.classList.add("bg-blue-100", "text-blue-700");
          break;
        case "END_SUMMARY":
          title.textContent = "Zusammenfassung";
          badge.textContent = "Summary";
          badge.classList.add("bg-green-100", "text-green-700");
          break;
        default:
          title.textContent = "Ergebnis";
          badge.textContent = "Result";
          badge.classList.add("bg-blue-100", "text-blue-700");
      }

      title.appendChild(badge);
      card.appendChild(title);

      // Rollen / Attribute aggregieren
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

      if (roleSet.size === 0) {
        const chip = document.createElement("span");
        chip.className =
          "inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs";
        chip.textContent = "Keine speziellen Rollen ermittelt";
        rolesList.appendChild(chip);
      } else {
        roleSet.forEach(r => {
          const chip = document.createElement("span");
          chip.className =
            "inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium";
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

      if (attrSet.size === 0) {
        const chip = document.createElement("span");
        chip.className =
          "inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs";
        chip.textContent = "Keine zusätzlichen Attribute ermittelt";
        attrsList.appendChild(chip);
      } else {
        attrSet.forEach(a => {
          const chip = document.createElement("span");
          chip.className =
            "inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium";
          chip.textContent = a;
          attrsList.appendChild(chip);
        });
      }

      attrsSection.appendChild(attrsList);
      card.appendChild(attrsSection);

      // Detailtabelle der Antworten
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
          <th class="text-left p-2 sm:p-3 text-xs font-semibold text-gray-600 w-1/2">Frage</th>
          <th class="text-left p-2 sm:p-3 text-xs font-semibold text-gray-600 w-1/2">Antwort</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      this.answers.forEach(a => {
        const tr = document.createElement("tr");
        tr.className = "odd:bg-white even:bg-gray-50 border-t border-gray-100";

        const qTd = document.createElement("td");
        qTd.className = "p-2 sm:p-3 align-top text-gray-800";
        qTd.textContent = a.question.question;

        const aTd = document.createElement("td");
        aTd.className = "p-2 sm:p-3 align-top text-gray-700";
        aTd.textContent = a.label ?? "";

        tr.appendChild(qTd);
        tr.appendChild(aTd);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrapper.appendChild(table);
      ansSection.appendChild(tableWrapper);
      card.appendChild(ansSection);

      // Aktionen unten
      const actions = document.createElement("div");
      actions.className = "flex flex-wrap gap-2 pt-4 mt-2 border-t border-gray-100";

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.textContent = "Zurück zur letzten Frage";
      backBtn.className =
        "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium " +
        "hover:bg-gray-50 transition disabled:opacity-40";
      backBtn.disabled = this.history.length === 0;
      backBtn.addEventListener("click", () => this.navigateBack());
      actions.appendChild(backBtn);

      const spacer = document.createElement("div");
      spacer.className = "flex-1";
      actions.appendChild(spacer);

      const restartBtn = document.createElement("button");
      restartBtn.type = "button";
      restartBtn.textContent = "Neustart";
      restartBtn.className =
        "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium " +
        "hover:bg-gray-50 transition";
      restartBtn.addEventListener("click", () => this.restart());
      actions.appendChild(restartBtn);

      const pdfBtn = document.createElement("button");
      pdfBtn.type = "button";
      pdfBtn.textContent = "Als PDF exportieren";
      pdfBtn.className =
        "px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow " +
        "hover:bg-blue-500";
      pdfBtn.addEventListener("click", () => window.print());
      actions.appendChild(pdfBtn);

      card.appendChild(actions);

      this.container.appendChild(card);

      // Fade-in Effekt
      requestAnimationFrame(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      });
    }
  }

  // --------------------------------
  // Auto-Initialisierung (optional)
  // --------------------------------
  function autoInit() {
    const root = document.querySelector("[data-forms-src]");
    if (!root) return;

    const src = root.getAttribute("data-forms-src");
    if (!src) {
      root.innerHTML =
        "<p class='text-red-600'>Keine Formular-Quelle (data-forms-src) angegeben.</p>";
      return;
    }

    fetch(src)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(json => {
        new FormsEngine(root, json);
      })
      .catch(err => {
        console.error(err);
        root.innerHTML =
          "<p class='text-red-600'>Fehler beim Laden des Formulars: " +
          (err.message || err) +
          "</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  // --------------------------------
  // Globaler Export für manuellen Aufruf
  // --------------------------------
  window.WebAppCoreForms = {
    init(rootElement, jsonArray) {
      return new FormsEngine(rootElement, jsonArray);
    }
  };
})();
