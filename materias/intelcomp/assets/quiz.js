/* assets/quiz.js - Reusable quiz engine for lessons */
function handleQuiz(quizId, selectedIndex, correctIndex, explanation) {
  const quiz = document.getElementById(quizId);
  if (!quiz) return;
  const feedback = quiz.querySelector('.quiz-feedback');
  const buttons = quiz.querySelectorAll('.quiz-option');

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) {
      btn.style.borderColor = 'var(--success-color)';
      btn.style.fontWeight = 'bold';
    } else if (idx === selectedIndex) {
      btn.style.borderColor = 'var(--error-color)';
    }
  });

  if (selectedIndex === correctIndex) {
    feedback.className = 'quiz-feedback correct';
    feedback.innerHTML = '<strong>Correto!</strong> ' + explanation;
  } else {
    feedback.className = 'quiz-feedback incorrect';
    feedback.innerHTML = '<strong>Incorreto.</strong> ' + explanation;
  }
}
