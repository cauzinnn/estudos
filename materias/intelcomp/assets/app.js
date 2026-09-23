/**
 * Motor de Interatividade e Diagnóstico de Erros — intelcomp
 * Focado em Aprendizagem Ativa Orientada pelo Erro
 */

// Sincronização e aplicação imediata de preferências visuais (evita FOUC)
(function() {
  try {
    const t = localStorage.getItem("intelcomp_theme") || "slate";
    const f = localStorage.getItem("intelcomp_font") || "clean";
    const w = localStorage.getItem("intelcomp_weight") || "light";
    const s = localStorage.getItem("intelcomp_size") || "normal";
    const d = localStorage.getItem("intelcomp_density") || "normal";
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("data-font", f);
    document.documentElement.setAttribute("data-weight", w);
    document.documentElement.setAttribute("data-size", s);
    document.documentElement.setAttribute("data-density", d);
  } catch(e) {}
})();

const SessionTracker = {
  stumbles: new Set(),
  lessonId: window.location.pathname.split("/").pop() || "geral",

  init() {
    try {
      const stored = JSON.parse(localStorage.getItem("intelcomp2_stumbles") || "{}");
      const existing = stored[this.lessonId] || [];
      existing.forEach(item => this.stumbles.add(item));
      this.renderSummary();
    } catch (e) {
      // localStorage bloqueado ou indisponível
    }
  },

  recordStumble(conceptName) {
    if (conceptName) {
      this.stumbles.add(conceptName);
      this.renderSummary();
      this.persistStumbles();
    }
  },

  persistStumbles() {
    try {
      const stored = JSON.parse(localStorage.getItem("intelcomp2_stumbles") || "{}");
      stored[this.lessonId] = Array.from(this.stumbles);
      localStorage.setItem("intelcomp2_stumbles", JSON.stringify(stored));
    } catch (e) {
      // localStorage restrito
    }
  },

  renderSummary() {
    const summaryContainer = document.getElementById("review-summary-list");
    const summaryCard = document.getElementById("review-summary-card");
    if (!summaryContainer || !summaryCard) return;

    if (this.stumbles.size > 0) {
      summaryCard.style.display = "block";
      summaryContainer.innerHTML = Array.from(this.stumbles)
        .map(item => `<li><strong>Ponto de tropeço registrado:</strong> ${item}</li>`)
        .join("");

      if (window.renderMathInElement) {
        window.renderMathInElement(summaryContainer, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        });
      }
    }
  }
};

/**
 * Múltipla Escolha com Diagnóstico de Distratores
 */
function initMultipleChoice(containerId, conceptName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll(".option-btn");
  const feedbackBox = container.querySelector(".feedback-box");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      const feedback = btn.dataset.feedback || (isCorrect ? "Correto! Raciocínio perfeito." : "Incorreto. Tente novamente.");

      feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");
      feedbackBox.innerHTML = (isCorrect ? "<strong>Correto! </strong>" : "<strong>Diagnóstico do Erro: </strong>") + feedback;

      if (isCorrect) {
        btn.classList.remove("selected-error");
        btn.classList.add("selected-success");
        buttons.forEach(b => {
          if (b !== btn) b.disabled = true;
        });
        ProgressBar.markSolved(containerId);
      } else {
        btn.classList.add("selected-error");
        SessionTracker.recordStumble(conceptName);
      }

      if (window.renderMathInElement) {
        window.renderMathInElement(feedbackBox, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        });
      }
    });
  });
}

/**
 * Preenchimento / Active Recall
 */
function initInputExercise(containerId, validAnswers, conceptName, customValidator = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const input = container.querySelector(".text-input");
  const button = container.querySelector(".action-btn");
  const feedbackBox = container.querySelector(".feedback-box");

  function normalize(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/→/g, "->")
      .replace(/–/g, "-")
      .replace(/[\(\)\[\]\{\}]/g, "");
  }

  function checkAnswer() {
    const rawVal = input.value.trim();
    const cleanUserVal = normalize(rawVal);
    let isCorrect = false;

    if (customValidator && typeof customValidator === "function") {
      isCorrect = customValidator(rawVal, cleanUserVal);
    } else if (Array.isArray(validAnswers)) {
      isCorrect = validAnswers.some(ans => normalize(ans) === cleanUserVal);
    } else {
      isCorrect = normalize(validAnswers) === cleanUserVal;
    }

    feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");

    if (isCorrect) {
      feedbackBox.innerHTML = "<strong>Exato!</strong> Resposta verificada e correta.";
      button.disabled = true;
      input.disabled = true;
      ProgressBar.markSolved(containerId);
    } else {
      const hint = container.dataset.hint || "Revise o passo a passo da regra e tente novamente.";
      feedbackBox.innerHTML = `<strong>Ainda não:</strong> A resposta (<code>${rawVal || "vazio"}</code>) não condiz com o rastreamento esperado. <em>Dica: ${hint}</em>`;
      SessionTracker.recordStumble(conceptName);
    }

    if (window.renderMathInElement) {
      window.renderMathInElement(feedbackBox, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }
  }

  if (button) button.addEventListener("click", checkAnswer);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  }
}

/**
 * Verdadeiro ou Falso / Identificação de Falácia
 */
function initTrueFalse(containerId, isTrueCorrect, conceptName, trueFeedback, falseFeedback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const btnTrue = container.querySelector(".btn-true");
  const btnFalse = container.querySelector(".btn-false");
  const feedbackBox = container.querySelector(".feedback-box");

  function evaluate(chosenTrue, clickedBtn, otherBtn) {
    const isCorrect = (chosenTrue === isTrueCorrect);
    const feedback = chosenTrue ? trueFeedback : falseFeedback;

    feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");
    feedbackBox.innerHTML = (isCorrect ? "<strong>Exato! </strong>" : "<strong>Atenção à falácia: </strong>") + feedback;

    if (isCorrect) {
      clickedBtn.classList.remove("selected-error");
      clickedBtn.classList.add("selected-success");
      otherBtn.disabled = true;
      ProgressBar.markSolved(containerId);
    } else {
      clickedBtn.classList.add("selected-error");
      SessionTracker.recordStumble(conceptName);
    }

    if (window.renderMathInElement) {
      window.renderMathInElement(feedbackBox, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }
  }

  if (btnTrue && btnFalse) {
    btnTrue.addEventListener("click", () => evaluate(true, btnTrue, btnFalse));
    btnFalse.addEventListener("click", () => evaluate(false, btnFalse, btnTrue));
  }
}

const ThemeManager = {
  themes: [
    { id: "slate", name: "🎨 Slate Soft (Padrão)" },
    { id: "gruvbox", name: "📻 Gruvbox Material" },
    { id: "monokai", name: "⚡ Monokai Pro Warm" },
    { id: "e-ink", name: "📄 E-Ink Minimalist (P&B)" },
    { id: "nord", name: "❄️ Nord Frost" },
    { id: "catppuccin", name: "🌸 Catppuccin Mocha" },
    { id: "dracula", name: "🧛 Dracula Soft" },
    { id: "tokyo-night", name: "🌆 Tokyo Night" },
    { id: "solarized", name: "🌲 Solarized Dark" },
    { id: "sepia", name: "📜 Warm Sepia" }
  ],
  fonts: [
    { id: "clean", name: "🔤 Clean Sans (Inter)" },
    { id: "lexend", name: "🎯 Acessível (Lexend)" },
    { id: "mono", name: "💻 Hacker Code (JetBrains)" },
    { id: "serif", name: "📖 Editorial (Merriweather)" }
  ],
  weights: [
    { id: "light", name: "🪶 Peso: Light (300)" },
    { id: "extra-light", name: "✨ Peso: Extra-Light (200)" },
    { id: "regular", name: "📝 Peso: Regular (400)" },
    { id: "medium", name: "💪 Peso: Médio (500)" }
  ],
  sizes: [
    { id: "13px", name: "A 13px (Micro)" },
    { id: "14px", name: "A 14px (Pequeno)" },
    { id: "15px", name: "A 15px (Leitura)" },
    { id: "normal", name: "A 15.5px (Padrão)" },
    { id: "16.5px", name: "A 16.5px (Médio)" },
    { id: "17.5px", name: "A 17.5px (Conforto)" },
    { id: "19px", name: "A 19px (Grande)" },
    { id: "21px", name: "A 21px (Extra)" }
  ],
  densities: [
    { id: "normal", name: "📏 Espaçamento: Normal" },
    { id: "compact", name: "📐 Espaçamento: Compacto" },
    { id: "relaxed", name: "🛋️ Espaçamento: Amplo" }
  ],

  init() {
    const savedTheme = localStorage.getItem("intelcomp_theme") || "slate";
    const savedFont = localStorage.getItem("intelcomp_font") || "clean";
    const savedWeight = localStorage.getItem("intelcomp_weight") || "light";
    const savedSize = localStorage.getItem("intelcomp_size") || "normal";
    const savedDensity = localStorage.getItem("intelcomp_density") || "normal";

    this.applyTheme(savedTheme, false);
    this.applyFont(savedFont, false);
    this.applyWeight(savedWeight, false);
    this.applySize(savedSize, false);
    this.applyDensity(savedDensity, false);

    this.mountSwitcher();
  },

  applyTheme(themeId, save = true) {
    document.documentElement.setAttribute("data-theme", themeId);
    if (save) {
      try { localStorage.setItem("intelcomp_theme", themeId); } catch(e){}
    }
  },

  applyFont(fontId, save = true) {
    document.documentElement.setAttribute("data-font", fontId);
    if (save) {
      try { localStorage.setItem("intelcomp_font", fontId); } catch(e){}
    }
  },

  applyWeight(weightId, save = true) {
    document.documentElement.setAttribute("data-weight", weightId);
    if (save) {
      try { localStorage.setItem("intelcomp_weight", weightId); } catch(e){}
    }
  },

  applySize(sizeId, save = true) {
    document.documentElement.setAttribute("data-size", sizeId);
    if (save) {
      try { localStorage.setItem("intelcomp_size", sizeId); } catch(e){}
    }
  },

  applyDensity(densityId, save = true) {
    document.documentElement.setAttribute("data-density", densityId);
    if (save) {
      try { localStorage.setItem("intelcomp_density", densityId); } catch(e){}
    }
  },

  mountSwitcher() {
    const container = document.querySelector(".container");
    if (!container) return;

    if (document.getElementById("theme-control-panel")) return;

    const panel = document.createElement("div");
    panel.id = "theme-control-panel";
    panel.className = "theme-panel-bar";

    const currentTheme = localStorage.getItem("intelcomp_theme") || "slate";
    const currentFont = localStorage.getItem("intelcomp_font") || "clean";
    const currentWeight = localStorage.getItem("intelcomp_weight") || "light";
    const currentSize = localStorage.getItem("intelcomp_size") || "normal";
    const currentDensity = localStorage.getItem("intelcomp_density") || "normal";

    panel.innerHTML = `
      <select id="theme-selector-input" class="theme-pill-select" title="Trocar Tema Visual">
        ${this.themes.map(t => `<option value="${t.id}" ${t.id === currentTheme ? 'selected' : ''}>${t.name}</option>`).join("")}
      </select>
      <select id="font-selector-input" class="theme-pill-select" title="Trocar Família Tipográfica">
        ${this.fonts.map(f => `<option value="${f.id}" ${f.id === currentFont ? 'selected' : ''}>${f.name}</option>`).join("")}
      </select>
      <select id="weight-selector-input" class="theme-pill-select" title="Trocar Peso da Fonte (Espessura)">
        ${this.weights.map(w => `<option value="${w.id}" ${w.id === currentWeight ? 'selected' : ''}>${w.name}</option>`).join("")}
      </select>
      <select id="size-selector-input" class="theme-pill-select" title="Ajustar Tamanho da Fonte">
        ${this.sizes.map(s => `<option value="${s.id}" ${s.id === currentSize ? 'selected' : ''}>${s.name}</option>`).join("")}
      </select>
      <select id="density-selector-input" class="theme-pill-select" title="Ajustar Espaçamento e Densidade">
        ${this.densities.map(d => `<option value="${d.id}" ${d.id === currentDensity ? 'selected' : ''}>${d.name}</option>`).join("")}
      </select>
    `;

    container.insertBefore(panel, container.firstChild);

    panel.querySelector("#theme-selector-input")?.addEventListener("change", (e) => this.applyTheme(e.target.value));
    panel.querySelector("#font-selector-input")?.addEventListener("change", (e) => this.applyFont(e.target.value));
    panel.querySelector("#weight-selector-input")?.addEventListener("change", (e) => this.applyWeight(e.target.value));
    panel.querySelector("#size-selector-input")?.addEventListener("change", (e) => this.applySize(e.target.value));
    panel.querySelector("#density-selector-input")?.addEventListener("change", (e) => this.applyDensity(e.target.value));
  }
};

const ProgressBar = {
  total: 0,
  solved: 0,

  init() {
    const exercises = document.querySelectorAll(".card-exercise[id]");
    this.total = exercises.length;
    if (this.total === 0) return;

    this.mount();
  },

  mount() {
    const container = document.querySelector(".container");
    if (!container) return;

    if (document.getElementById("session-progress-container")) return;

    const panel = document.createElement("div");
    panel.id = "session-progress-container";
    panel.className = "session-progress-wrapper";
    panel.innerHTML = `
      <div class="session-progress-info">
        <span>Progresso da Lição</span>
        <span id="session-progress-counter">0 de ${this.total} desafios dominados</span>
      </div>
      <div class="session-progress-track">
        <div id="session-progress-fill" class="session-progress-fill"></div>
      </div>
    `;

    const nav = container.querySelector(".nav-links");
    if (nav && nav.nextSibling) {
      container.insertBefore(panel, nav.nextSibling);
    } else {
      const header = container.querySelector("header");
      if (header && header.nextSibling) {
        container.insertBefore(panel, header.nextSibling);
      } else {
        container.appendChild(panel);
      }
    }
  },

  markSolved(containerId) {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.solved === "true") return;

    container.dataset.solved = "true";
    this.solved++;

    const fill = document.getElementById("session-progress-fill");
    const counter = document.getElementById("session-progress-counter");

    if (fill && counter) {
      const pct = Math.round((this.solved / this.total) * 100);
      fill.style.width = pct + "%";
      counter.textContent = `${this.solved} de ${this.total} desafios dominados (${pct}%)`;
    }
  }
};

const PinnedGraph = {
  init() {
    const graphDiagram = document.querySelector(".graph-diagram");
    if (!graphDiagram) return;

    const btn = document.createElement("button");
    btn.className = "pinned-graph-btn";
    btn.innerHTML = `🗺️ Ver Grafo`;
    btn.title = "Visualizar o grafo de rastreamento da lição";
    document.body.appendChild(btn);

    const modal = document.createElement("div");
    modal.className = "pinned-graph-modal";
    modal.innerHTML = `
      <div class="pinned-graph-box">
        <div class="pinned-graph-header">
          <strong style="color:var(--text-heading); font-size:1rem;">Grafo de Busca da Lição</strong>
          <button class="pinned-graph-close" title="Fechar">&times;</button>
        </div>
        <div class="pinned-graph-body">
          ${graphDiagram.innerHTML}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".pinned-graph-close");
    btn.addEventListener("click", () => modal.classList.add("show"));
    closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("show");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        modal.classList.remove("show");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  SessionTracker.init();
  ProgressBar.init();
  PinnedGraph.init();

  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
});
