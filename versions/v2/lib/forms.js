// versions/v2/lib/forms.js
// Generischer Fragebogen-Renderer für webapp-core v2
// Erwartet einen Container mit data-forms-src="<pfad-zur-json-datei>"
// - Liest eine JSON-Datei mit Fragen (dein Format).
// - Rendert Schritt für Schritt das UI.
// - Steuert Navigation (Weiter / Zurück / Neustart).
// - Erzeugt eine Ergebnisansicht aus Rollen, Attributen und Antworten.

// versions/v2/lib/forms.js
// Generischer Formular- und Fragebogen-Renderer für webapp-core v2
// Erwartet ein Root-Element mit data-forms-src="<pfad-zur-json-datei>"

(function () {
  "use strict";

  class FormsEngine {
    constructor(rootElement, questions) {
      this.root = rootElement;
      this.questions = questions;
      this.questionsById = new Map();
      questions.forEach(q => this.questionsById.set(q.id, q));

      this.currentQuestionId = null;
      this.history = [];
      this.answers = new Map();

      // Container erzeugen
      this.container = document.createElement("div");
      this.container.className = "forms space-y-4";
      this.root.innerHTML = "";
      this.root.appendChild(this.container);

      this.init();
    }

    init() {
      if (!this.questions.length) {
        this.container.innerHTML = "<p>Formular ist leer.</p>";
        return;
      }
      this.currentQuestionId = this.questions[0].id;
      this.renderCurrentQuestion();
    }

    getQuestion(id) {
      return this.questionsById.get(id);
    }

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
      if (this.history.length === 0) {
        return;
      }
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

    // ----------------------------
    // Rendering
    // ----------------------------

    renderCurrentQuestion() {
      const q = this.getQuestion(this.currentQuestionId);
      if (!q) {
        this.container.innerHTML = "<p>Fehler: Formularpunkt nicht gefunden.</p>";
        return;
      }

      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className = "bg-white shadow rounded-lg p-4 space-y-3";

      const title = document.createElement("h3");
      title.className = "text-xl font-semibold";
      title.textContent = q.question;
      card.appendChild(title);

      if (q.description) {
        const desc = document.createElement("p");
        desc.className = "text-sm text-gray-600";
        desc.textContent = q.description;
        card.appendChild(desc);
      }

      const body = document.createElement("div");
      body.className = "space-y-3";
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
          body.innerHTML = "<p>Unbekannter Fragetyp.</p>";
      }

      const nav = this.buildNavBar();
      card.appendChild(nav);

      this.container.appendChild(card);
    }

    buildNavBar() {
      const nav = document.createElement("div");
      nav.className = "flex flex-wrap gap-2 pt-2 border-t mt-2";

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.textContent = "Zurück";
      backBtn.className = "px-3 py-1 border rounded";
      backBtn.disabled = this.history.length === 0;
      backBtn.addEventListener("click", () => this.navigateBack());

      const restartBtn = document.createElement("button");
      restartBtn.type = "button";
      restartBtn.textContent = "Neustart";
      restartBtn.className = "px-3 py-1 border rounded ml-auto";
      restartBtn.addEventListener("click", () => this.restart());

      nav.appendChild(backBtn);
      nav.appendChild(restartBtn);
      return nav;
    }

    // ----------------------------
    // Typen
    // ----------------------------

    renderYesNo(q, container) {
      const row = document.createElement("div");
      row.className = "flex gap-2";

      const yesBtn = document.createElement("button");
      yesBtn.className = "px-4 py-2 rounded bg-blue-600 text-white";
      yesBtn.textContent = "Ja";
      yesBtn.addEventListener("click", () => {
        const meta = this.getYesNoMeta(q, true);
        this.storeAnswer(q, { value: true, label: "Ja", meta });
        this.navigateToNext(q.yes?.next);
      });

      const noBtn = document.createElement("button");
      noBtn.className = "px-4 py-2 rounded bg-gray-200";
      noBtn.textContent = "Nein";
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

    renderSelect(q, container) {
      const select = document.createElement("select");
      select.className = "border rounded px-3 py-2 w-full";
      select.innerHTML = `<option value="">Bitte wählen...</option>`;

      q.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        select.appendChild(o);
      });

      container.appendChild(select);

      const nextBtn = document.createElement("button");
      nextBtn.className = "px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50";
      nextBtn.textContent = "Weiter";
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

    renderText(q, container) {
      const input = q.multiline
        ? document.createElement("textarea")
        : document.createElement("input");

      if (!q.multiline) input.type = "text";
      input.className = "border rounded px-3 py-2 w-full";
      if (q.placeholder) input.placeholder = q.placeholder;

      container.appendChild(input);

      const nextBtn = document.createElement("button");
      nextBtn.className = "px-4 py-2 rounded bg-blue-600 text-white mt-2";
      nextBtn.textContent = "Weiter";
      container.appendChild(nextBtn);

      nextBtn.addEventListener("click", () => {
        const value = input.value.trim();
        if (q.required && !value) {
          input.classList.add("border-red-500");
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

    storeAnswer(question, entry) {
      this.answers.set(question.id, { question, ...entry });
    }

    // ----------------------------
    // Ergebnis
    // ----------------------------

    renderResult(endType) {
      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className = "bg-white shadow rounded-lg p-4 space-y-4";

      const title = document.createElement("h3");
      title.className = "text-xl font-semibold";

      if (endType === "END_NONE") title.textContent = "Ergebnis: Keine Relevanz";
      else if (endType === "END_PROVIDER") title.textContent = "Ergebnis: Provider";
      else if (endType === "END_SUMMARY") title.textContent = "Zusammenfassung";
      else title.textContent = "Ergebnis";

      card.appendChild(title);

      const roleSet = new Set();
      const attrSet = new Set();

      this.answers.forEach(a => {
        (a.meta.roles || []).forEach(r => roleSet.add(r));
        (a.meta.attributes || []).forEach(at => attrSet.add(at));
      });

      // Rollen
      const rSec = document.createElement("div");
      rSec.innerHTML =
        "<h4 class='font-semibold'>Rollen:</h4>" +
        `<ul class='list-disc list-inside'>${[...roleSet]
          .map(r => `<li>${r}</li>`)
          .join("") || "<li>Keine</li>"}</ul>`;
      card.appendChild(rSec);

      // Attribute
      const aSec = document.createElement("div");
      aSec.innerHTML =
        "<h4 class='font-semibold'>Attribute:</h4>" +
        `<ul class='list-disc list-inside'>${[...attrSet]
          .map(a => `<li>${a}</li>`)
          .join("") || "<li>Keine</li>"}</ul>`;
      card.appendChild(aSec);

      // Antworten Übersicht
      const ansSec = document.createElement("div");
      ansSec.innerHTML = "<h4 class='font-semibold'>Antworten:</h4>";
      const table = document.createElement("table");
      table.className = "w-full text-sm border-collapse";

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr class="border-b">
          <th class="text-left p-1">Frage</th>
          <th class="text-left p-1">Antwort</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      this.answers.forEach(a => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `
          <td class="p-1">${a.question.question}</td>
          <td class="p-1">${a.label ?? ""}</td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      ansSec.appendChild(table);
      card.appendChild(ansSec);

      // Aktionen
      const actions = document.createElement("div");
      actions.className = "flex gap-2 pt-2 border-t";

      const backBtn = document.createElement("button");
      backBtn.className = "px-3 py-1 border rounded";
      backBtn.textContent = "Zurück";
      backBtn.disabled = this.history.length === 0;
      backBtn.addEventListener("click", () => this.navigateBack());
      actions.appendChild(backBtn);

      const restartBtn = document.createElement("button");
      restartBtn.className = "px-3 py-1 border rounded ml-auto";
      restartBtn.textContent = "Neustart";
      restartBtn.addEventListener("click", () => this.restart());
      actions.appendChild(restartBtn);

      const pdfBtn = document.createElement("button");
      pdfBtn.className = "px-3 py-1 bg-blue-600 text-white rounded";
      pdfBtn.textContent = "PDF Export";
      pdfBtn.addEventListener("click", () => window.print());
      actions.appendChild(pdfBtn);

      card.appendChild(actions);
      this.container.appendChild(card);
    }
  }

  // ----------------------------
  // Auto-Initialisierung
  // ----------------------------

  function autoInit() {
    const root = document.querySelector("[data-forms-src]");
    if (!root) return;

    const src = root.getAttribute("data-forms-src");
    if (!src) {
      console.warn("data-forms-src ist nicht gesetzt.");
      return;
    }

    fetch(src)
      .then(r => r.json())
      .then(json => new FormsEngine(root, json))
      .catch(err => {
        console.error(err);
        root.innerHTML = "<p>Fehler beim Laden des Formulars.</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  // global optional
  window.WebAppCoreForms = {
    init(root, json) {
      return new FormsEngine(root, json);
    }
  };
})();
