/**
 * Motor de Interatividade e Diagnóstico de Erros
 * Focado em aprendizado ativo, retentiva e feedback formativo
 */

const SessionTracker = {
  stumbles: new Set(),

  recordStumble(conceptName) {
    if (conceptName) {
      this.stumbles.add(conceptName);
      this.renderSummary();
    }
  },

  renderSummary() {
    const summaryContainer = document.getElementById("review-summary-list");
    const summaryCard = document.getElementById("review-summary-card");
    if (!summaryContainer || !summaryCard) return;

    if (this.stumbles.size > 0) {
      summaryCard.style.display = "block";
      summaryContainer.innerHTML = Array.from(this.stumbles)
        .map(item => `<li><strong>Ponto de atenção:</strong> ${item}</li>`)
        .join("");
    }
  }
};

/**
 * Inicializa exercícios de múltipla escolha diagnóstica
 */
function initMultipleChoice(containerId, conceptName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll(".option-btn");
  const feedbackBox = container.querySelector(".feedback-box");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      const feedback = btn.dataset.feedback || (isCorrect ? "Exato! Raciocínio correto." : "Resposta incorreta. Tente novamente.");

      feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");
      feedbackBox.innerHTML = feedback;

      if (isCorrect) {
        btn.classList.add("selected-success");
        buttons.forEach(b => {
          if (b !== btn) b.disabled = true;
        });
      } else {
        btn.classList.add("selected-error");
        SessionTracker.recordStumble(conceptName);
      }

      // Renderizar KaTeX dentro do feedback se houver
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
 * Inicializa exercícios de preenchimento / active recall
 */
function initInputExercise(containerId, expectedValue, conceptName, customValidator = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const input = container.querySelector(".text-input");
  const button = container.querySelector(".action-btn");
  const feedbackBox = container.querySelector(".feedback-box");

  function checkAnswer() {
    const userVal = input.value.trim();
    let isCorrect = false;

    if (customValidator && typeof customValidator === "function") {
      isCorrect = customValidator(userVal);
    } else {
      isCorrect = userVal.toLowerCase() === String(expectedValue).trim().toLowerCase();
    }

    feedbackBox.className = "feedback-box show " + (isCorrect ? "success" : "error");

    if (isCorrect) {
      feedbackBox.innerHTML = "Correto! Excelente retenção.";
      button.disabled = true;
      input.disabled = true;
    } else {
      feedbackBox.innerHTML = "Ainda não está certo. Revise a definição ou o cálculo e tente novamente.";
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
