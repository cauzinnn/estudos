/**
 * Motor de Interatividade e Diagnóstico de Erros — intelcomp2
 * Focado em Aprendizagem Ativa Orientada pelo Erro
 */

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

document.addEventListener("DOMContentLoaded", () => {
  SessionTracker.init();

  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
});
