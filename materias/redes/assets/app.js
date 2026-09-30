/**
 * Motor de Interatividade e Diagnóstico de Erros
 * Aprendizagem Ativa com Verificação Imediata e Randomização de Alternativas
 */

// Sincronização e aplicação imediata de preferências visuais (evita FOUC)
(function() {
  try {
    const t = localStorage.getItem("intelcomp_theme") || "tufte";
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

/**
 * Utilitário: Atualiza o prefixo de letra de um botão preservando nós internos (KaTeX, tags)
 */
function setButtonPrefix(btn, newLetter) {
  const walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();
  while (textNode && !textNode.nodeValue.trim()) {
    textNode = walker.nextNode();
  }
  if (textNode) {
    const cleaned = textNode.nodeValue.replace(/^\s*[A-Za-z]\s*[\)\.\-:]\s*/, "");
    textNode.nodeValue = `${newLetter}) ${cleaned.trimStart()}`;
  } else {
    btn.textContent = `${newLetter}) ${btn.textContent.trim()}`;
  }
}

/**
 * Múltipla Escolha com Randomização de Alternativas (Anti-Viés de Posição)
 */
function initMultipleChoice(containerId, conceptName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const optionsList = container.querySelector(".options-list");
  if (!optionsList) return;

  const buttons = Array.from(optionsList.querySelectorAll("button.option-btn"));

  // Embaralhar alternativas dinamicamente a cada carregamento/F5
  if (buttons.length > 1) {
    const shuffled = [...buttons];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fragment = document.createDocumentFragment();

    shuffled.forEach((btn, idx) => {
      const letter = alphabet[idx] || `${idx + 1}`;
      setButtonPrefix(btn, letter);
      fragment.appendChild(btn);
    });

    optionsList.appendChild(fragment);
  }

  const feedbackBox = container.querySelector(".feedback-box");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      const rawFeedback = btn.dataset.feedback || (isCorrect ? "Resposta correta." : "Resposta incorreta.");
      const cleanFeedback = rawFeedback.replace(/^(Brilhante!|Exato!|Correto!|Atenção:|Cuidado:|Incorreto:)\s*/i, "");

      if (feedbackBox) {
        feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");
        feedbackBox.innerHTML = (isCorrect ? "<strong>Correto: </strong>" : "<strong>Incorreto: </strong>") + cleanFeedback;

        if (window.renderMathInElement) {
          window.renderMathInElement(feedbackBox, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false }
            ]
          });
        }
      }

      if (isCorrect) {
        btn.classList.remove("selected-error");
        btn.classList.add("selected-success");
        buttons.forEach(b => {
          if (b !== btn) b.disabled = true;
        });
      } else {
        btn.classList.add("selected-error");
      }
    });
  });
}

/**
 * Randomização de Exemplos em Caixas de Texto (Evita Dedurar Respostas)
 */
function randomizeInputPlaceholder(input, validAnswers = []) {
  if (!input) return;
  const original = input.getAttribute("data-original-placeholder") || input.placeholder || "";
  if (!original) return;

  if (!input.hasAttribute("data-original-placeholder")) {
    input.setAttribute("data-original-placeholder", original);
  }

  if (!/^ex\s*:/i.test(original.trim())) return;

  const exampleBody = original.replace(/^ex\s*:\s*/i, "").trim();
  const normalizedAnswers = (Array.isArray(validAnswers) ? validAnswers : [validAnswers])
    .map(a => String(a || "").trim().toLowerCase());

  let fakeExample = "";

  // 1. IP com Máscara CIDR (ex: 146.164.69.128/26)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/.test(exampleBody)) {
    const fakeOctet1 = [10, 172, 192][Math.floor(Math.random() * 3)];
    const fakeOctet2 = Math.floor(Math.random() * 200) + 1;
    const fakeOctet3 = Math.floor(Math.random() * 200);
    const fakeMask = Math.floor(Math.random() * 6) + 24; // /24 a /29
    fakeExample = `${fakeOctet1}.${fakeOctet2}.${fakeOctet3}.0/${fakeMask}`;
  }
  // 2. Endereço IP Simples (ex: 224.0.0.9)
  else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(exampleBody)) {
    const isMulticast = /^22[4-9]|23\d/.test(exampleBody);
    if (isMulticast) {
      fakeExample = `239.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
    } else {
      fakeExample = `192.168.${Math.floor(Math.random() * 100) + 1}.${Math.floor(Math.random() * 254) + 1}`;
    }
  }
  // 3. Apenas Dígitos / Número Inteiro (ex: 4, 15, 185, 370, 3600)
  else if (/^\d+$/.test(exampleBody)) {
    const len = exampleBody.length;
    let candidate = "";
    let attempts = 0;
    do {
      attempts++;
      if (len === 1) {
        candidate = String(Math.floor(Math.random() * 8) + 2); // 2 a 9
      } else if (len === 2) {
        candidate = String(Math.floor(Math.random() * 80) + 12); // 12 a 91
      } else if (len === 3) {
        candidate = String(Math.floor(Math.random() * 700) + 150); // 150 a 849
      } else {
        candidate = String(Math.floor(Math.random() * 5000) + 1000); // 1000 a 5999
      }
    } while (attempts < 50 && (normalizedAnswers.includes(candidate.toLowerCase()) || candidate === exampleBody));
    fakeExample = candidate;
  }
  // 4. Letra Única (ex: B)
  else if (/^[A-Za-z]$/.test(exampleBody)) {
    const pool = "XYZKWMHPRTDJ".split("");
    const available = pool.filter(l => !normalizedAnswers.includes(l.toLowerCase()) && l.toUpperCase() !== exampleBody.toUpperCase());
    fakeExample = available[Math.floor(Math.random() * available.length)] || "X";
  }
  // 5. Sigla Curta em Maiúsculas (ex: ABR)
  else if (/^[A-Z]{2,5}$/.test(exampleBody)) {
    const dummyAcronyms = ["BGP", "DNS", "XYZ", "TCP", "ASBR", "NAT", "SNMP", "MPLS", "VPN"].filter(
      a => !normalizedAnswers.includes(a.toLowerCase()) && a !== exampleBody
    );
    fakeExample = dummyAcronyms[Math.floor(Math.random() * dummyAcronyms.length)] || "XYZ";
  }
  // 6. Texto com Várias Palavras (ex: Triggered Updates)
  else {
    const dummyPhrases = ["Nome do Mecanismo", "Termo Conceitual", "Nome do Protocolo", "Conceito Técnico"];
    fakeExample = dummyPhrases[Math.floor(Math.random() * dummyPhrases.length)];
  }

  input.placeholder = `Ex: ${fakeExample}`;
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

  if (input) {
    randomizeInputPlaceholder(input, validAnswers);
  }

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

    if (feedbackBox) {
      feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");

      if (isCorrect) {
        feedbackBox.innerHTML = "<strong>Correto:</strong> Resposta confirmada.";
        if (button) button.disabled = true;
        if (input) input.disabled = true;
      } else {
        const hint = container.dataset.hint;
        feedbackBox.innerHTML = `<strong>Incorreto:</strong> A resposta (<code>${rawVal || "vazio"}</code>) está incorreta.${hint ? ` <em>Dica: ${hint}</em>` : ""}`;
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
  }

  if (button) button.addEventListener("click", checkAnswer);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  }
}

/**
 * Verdadeiro ou Falso / Identificação de Falácia (Ordem Fixa [V / F])
 */
function initTrueFalse(containerId, isTrueCorrect, conceptName, trueFeedback, falseFeedback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const btnTrue = container.querySelector(".btn-true");
  const btnFalse = container.querySelector(".btn-false");
  const feedbackBox = container.querySelector(".feedback-box");

  function evaluate(chosenTrue, clickedBtn, otherBtn) {
    const isCorrect = (chosenTrue === isTrueCorrect);
    const rawFeedback = chosenTrue ? trueFeedback : falseFeedback;
    const cleanFeedback = (rawFeedback || "")
      .replace(/^(Brilhante!|Exato!|Correto!|Atenção à falácia:|Atenção:|Cuidado:|Incorreto:)\s*/i, "");

    if (feedbackBox) {
      feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");
      feedbackBox.innerHTML = (isCorrect ? "<strong>Correto: </strong>" : "<strong>Incorreto: </strong>") + cleanFeedback;

      if (window.renderMathInElement) {
        window.renderMathInElement(feedbackBox, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        });
      }
    }

    if (isCorrect) {
      clickedBtn.classList.remove("selected-error");
      clickedBtn.classList.add("selected-success");
      if (otherBtn) otherBtn.disabled = true;
    } else {
      clickedBtn.classList.add("selected-error");
    }
  }

  if (btnTrue && btnFalse) {
    btnTrue.addEventListener("click", () => evaluate(true, btnTrue, btnFalse));
    btnFalse.addEventListener("click", () => evaluate(false, btnFalse, btnTrue));
  }
}

const ThemeManager = {
  themes: [
    { id: "tufte", name: "📖 Tufte Paper (Padrão Claro)" },
    { id: "github-light", name: "☀️ GitHub Light (Claro)" },
    { id: "catppuccin-latte", name: "🌸 Catppuccin Latte (Claro)" },
    { id: "solarized-light", name: "📜 Solarized Light (Claro)" },
    { id: "nord-snow", name: "❄️ Nord Snow (Claro)" },
    { id: "slate", name: "🎨 Slate Soft (Escuro)" },
    { id: "gruvbox", name: "📻 Gruvbox Material (Escuro)" },
    { id: "monokai", name: "⚡ Monokai Pro Warm (Escuro)" },
    { id: "e-ink", name: "📄 E-Ink Minimalist (Escuro)" },
    { id: "nord", name: "❄️ Nord Frost (Escuro)" },
    { id: "catppuccin", name: "🌸 Catppuccin Mocha (Escuro)" },
    { id: "dracula", name: "🧛 Dracula Soft (Escuro)" },
    { id: "tokyo-night", name: "🌆 Tokyo Night (Escuro)" },
    { id: "solarized", name: "🌲 Solarized Dark (Escuro)" },
    { id: "sepia", name: "📜 Warm Sepia (Escuro)" }
  ],
  fonts: [
    { id: "clean", name: "🔤 Clean Sans (Inter)" },
    { id: "jakarta", name: "📐 Modern Sans (Plus Jakarta)" },
    { id: "atkinson", name: "👁️ Hiperlegível (Atkinson)" },
    { id: "lexend", name: "🎯 Acessível (Lexend)" },
    { id: "serif", name: "📖 Editorial (Merriweather)" },
    { id: "spectral", name: "📜 Clássico Tufte (Spectral)" },
    { id: "lora", name: "📚 Leitura Fluida (Lora)" },
    { id: "mono", name: "💻 Hacker Code (JetBrains)" },
    { id: "fira", name: "⌨️ Dev Mono (Fira Code)" },
    { id: "space", name: "🚀 Tech Sans (Space Grotesk)" }
  ],
  weights: [
    { id: "light", name: "Light (300)" },
    { id: "extra-light", name: "Extra-Light (200)" },
    { id: "regular", name: "Regular (400)" },
    { id: "medium", name: "Médio (500)" }
  ],
  sizes: [
    { id: "13px", name: "13px" },
    { id: "14px", name: "14px" },
    { id: "15px", name: "15px" },
    { id: "normal", name: "15.5px (Padrão)" },
    { id: "16.5px", name: "16.5px" },
    { id: "17.5px", name: "17.5px" },
    { id: "19px", name: "19px" },
    { id: "21px", name: "21px" }
  ],
  densities: [
    { id: "compact", name: "Compacto" },
    { id: "normal", name: "Normal" },
    { id: "relaxed", name: "Amplo" }
  ],

  init() {
    const savedTheme = localStorage.getItem("intelcomp_theme") || "tufte";
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
    if (document.getElementById("theme-toggle-btn")) return;

    const topBar = document.createElement("div");
    topBar.className = "top-nav-bar";

    const wrapper = document.createElement("div");
    wrapper.className = "theme-switcher-wrapper";

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle-btn";
    toggleBtn.className = "theme-toggle-btn";
    toggleBtn.type = "button";
    toggleBtn.title = "Aparência";
    toggleBtn.innerHTML = `⚙ Aparência`;

    const panel = document.createElement("div");
    panel.id = "theme-settings-modal";
    panel.className = "theme-settings-panel";

    const currentTheme = localStorage.getItem("intelcomp_theme") || "tufte";
    const currentFont = localStorage.getItem("intelcomp_font") || "clean";
    const currentWeight = localStorage.getItem("intelcomp_weight") || "light";
    const currentSize = localStorage.getItem("intelcomp_size") || "normal";
    const currentDensity = localStorage.getItem("intelcomp_density") || "normal";

    panel.innerHTML = `
      <div class="theme-panel-header">
        <strong>Aparência</strong>
        <button id="theme-close-btn" class="theme-panel-close" title="Fechar">&times;</button>
      </div>
      <div class="theme-panel-row">
        <label for="theme-selector-input">Tema</label>
        <select id="theme-selector-input" class="theme-pill-select">
          ${this.themes.map(t => `<option value="${t.id}" ${t.id === currentTheme ? 'selected' : ''}>${t.name}</option>`).join("")}
        </select>
      </div>
      <div class="theme-panel-row">
        <label for="font-selector-input">Fonte</label>
        <select id="font-selector-input" class="theme-pill-select">
          ${this.fonts.map(f => `<option value="${f.id}" ${f.id === currentFont ? 'selected' : ''}>${f.name}</option>`).join("")}
        </select>
      </div>
      <div class="theme-panel-row">
        <label for="weight-selector-input">Peso</label>
        <select id="weight-selector-input" class="theme-pill-select">
          ${this.weights.map(w => `<option value="${w.id}" ${w.id === currentWeight ? 'selected' : ''}>${w.name}</option>`).join("")}
        </select>
      </div>
      <div class="theme-panel-row">
        <label for="size-selector-input">Tamanho</label>
        <select id="size-selector-input" class="theme-pill-select">
          ${this.sizes.map(s => `<option value="${s.id}" ${s.id === currentSize ? 'selected' : ''}>${s.name}</option>`).join("")}
        </select>
      </div>
      <div class="theme-panel-row">
        <label for="density-selector-input">Espaçamento</label>
        <select id="density-selector-input" class="theme-pill-select">
          ${this.densities.map(d => `<option value="${d.id}" ${d.id === currentDensity ? 'selected' : ''}>${d.name}</option>`).join("")}
        </select>
      </div>
    `;

    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(panel);
    topBar.appendChild(wrapper);
    container.insertBefore(topBar, container.firstChild);

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("show");
    });

    panel.querySelector("#theme-close-btn")?.addEventListener("click", () => {
      panel.classList.remove("show");
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        panel.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("show")) {
        panel.classList.remove("show");
      }
    });

    panel.querySelector("#theme-selector-input")?.addEventListener("change", (e) => this.applyTheme(e.target.value));
    panel.querySelector("#font-selector-input")?.addEventListener("change", (e) => this.applyFont(e.target.value));
    panel.querySelector("#weight-selector-input")?.addEventListener("change", (e) => this.applyWeight(e.target.value));
    panel.querySelector("#size-selector-input")?.addEventListener("change", (e) => this.applySize(e.target.value));
    panel.querySelector("#density-selector-input")?.addEventListener("change", (e) => this.applyDensity(e.target.value));
  }
};

const PinnedGraph = {
  init() {
    const graphDiagram = document.querySelector(".graph-diagram");
    if (!graphDiagram) return;

    const btn = document.createElement("button");
    btn.className = "pinned-graph-btn";
    btn.innerHTML = `Ver Grafo`;
    btn.title = "Visualizar o grafo de busca da lição";
    document.body.appendChild(btn);

    const modal = document.createElement("div");
    modal.className = "pinned-graph-modal";
    modal.innerHTML = `
      <div class="pinned-graph-box">
        <div class="pinned-graph-header">
          <strong style="color:var(--text-heading); font-size:0.95rem;">Grafo de Busca</strong>
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
  PinnedGraph.init();

  document.querySelectorAll(".text-input").forEach(input => {
    randomizeInputPlaceholder(input);
  });

  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
});
