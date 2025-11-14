// ============================================================================
//  Cherware FormsEngine (v2) — Schönes UI, Cherware-Farben, Tailwind-Styling
// ============================================================================
//  Features:
//  - Stepper (Frage X von Y)
//  - Cherware Theme (Farben, Chips, Buttons, Karten)
//  - Fade-In Animation
//  - Yes/No, Select, Text
//  - Ergebnisansicht (Chips, Tabellen, Actions)
//  - Kompatibel mit webapp-core v2 (include.js)
//  - Unterstützt Auto-Init (data-forms-src) ODER manuelle Init
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
  //  FORMS ENGINE
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

    // ------------------------------------------------------------------------
    // INIT
    // ------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------
    // NAVIGATION
    // ------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------
    // RENDER: aktuelle Frage
    // ------------------------------------------------------------------------
    renderCurrentQuestion() {
      const q = this.getQuestion(this.currentQuestionId);
      if (!q) {
        this.container.innerHTML =
          "<p class='text-red-600'>Fehler: Formularpunkt nicht gefunden.</p>";
        return;
      }

      this.container.innerHTML = "";

      const card = document.createElement("div");
      card.className =
        CHERWARE_THEME.card +
        " p-6 sm:p-8 space-y-5 transition-opacity duration-300 opacity-0";

      // Stepper ------------------------------------------------------------
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

      // TITEL --------------------------------------------------------------
      const title = document.createElement("h3");
      title.className = "text-2xl font-bold text-gray-800";
      title.textContent = q.question;
      card.appendChild(title);

      // BESCHREIBUNG --------------------------------------------------------
      if (q.description) {
        const desc = document.createElement("p");
        desc.className = CHERWARE_THEME.desc;
        desc.textContent = q.description;
        card.appendChild(desc);
      }

      // BODY ---------------------------------------------------------------
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
            "<p class='text-red-600'>Unbekannter Fragetyp.</p>";
      }

      // NAVIGATION ----------------------------------------------------------
      const nav = this.buildNavBar();
      card.appendChild(nav);

      this.container.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.remove("opacity-0");
        card.classList.add("opacity-100");
      });
    }
