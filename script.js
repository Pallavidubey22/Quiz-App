const questions = [
  {
    question: 'What does HTML stand for?',
    answers: [
      { text: 'HyperText Markup Language', correct: true },
      { text: 'Home Tool Markup Language', correct: false },
      { text: 'Hyperlinks and Text Markup Language', correct: false },
      { text: 'HighText Machine Language', correct: false }
    ]
  },
  {
    question: 'Which CSS property is used to change text color?',
    answers: [
      { text: 'font-style', correct: false },
      { text: 'color', correct: true },
      { text: 'text-decoration', correct: false },
      { text: 'background-color', correct: false }
    ]
  },
  {
    question: 'What is the correct JavaScript syntax to change the content of an element with id "demo"?',
    answers: [
      { text: 'document.getElementById("demo").innerHTML = "Hello";', correct: true },
      { text: 'document.getElementByName("demo").innerHTML = "Hello";', correct: false },
      { text: 'document.getElement("demo").innerText = "Hello";', correct: false },
      { text: '#demo.innerHTML = "Hello";', correct: false }
    ]
  },
  {
    question: 'Which HTML element is used for creating a dropdown list?',
    answers: [
      { text: '<select>', correct: true },
      { text: '<list>', correct: false },
      { text: '<dropdown>', correct: false },
      { text: '<optionlist>', correct: false }
    ]
  },
  {
    question: 'Which CSS layout mode is best for responsive two-dimensional layouts?',
    answers: [
      { text: 'Grid', correct: true },
      { text: 'Float', correct: false },
      { text: 'Position', correct: false },
      { text: 'Table', correct: false }
    ]
  }
];

const questionElement = document.getElementById('question');
const answersButtons = document.getElementById('answersbuttons');
const nextButton = document.getElementById('next-btn');
const progressElement = document.getElementById('progress');

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  nextButton.disabled = true;
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  progressElement.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('answer-btn');
    button.dataset.correct = answer.correct;
    button.addEventListener('click', selectAnswer);
    answersButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.disabled = true;
  answered = false;
  while (answersButtons.firstChild) {
    answersButtons.removeChild(answersButtons.firstChild);
  }
}

function selectAnswer(event) {
  if (answered) return;
  answered = true;

  const selectedButton = event.target;
  const correct = selectedButton.dataset.correct === 'true';

  setStatusClass(selectedButton, correct ? 'selected-correct' : 'selected-wrong');
  selectedButton.disabled = true;

  Array.from(answersButtons.children).forEach(button => {
    button.disabled = true;
    const isCorrect = button.dataset.correct === 'true';
    if (isCorrect) {
      setStatusClass(button, 'correct');
    } else if (button !== selectedButton) {
      setStatusClass(button, 'incorrect');
    }
  });

  if (correct) {
    score++;
  }

  nextButton.disabled = false;
  nextButton.innerText = currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish';
}

function setStatusClass(element, statusClass) {
  element.classList.remove('correct', 'incorrect', 'selected-correct', 'selected-wrong');
  element.classList.add(statusClass);
}

function showResults() {
  resetState();
  progressElement.innerText = 'Quiz complete';
  questionElement.innerText = `You scored ${score} out of ${questions.length}`;

  const resultText = document.createElement('p');
  resultText.classList.add('result-card');
  const percentage = Math.round((score / questions.length) * 100);
  resultText.innerHTML = `Your score: <strong>${score}/${questions.length}</strong> (${percentage}%)`;
  answersButtons.appendChild(resultText);

  nextButton.innerText = 'Play Again';
  nextButton.disabled = false;
  nextButton.removeEventListener('click', nextButtonHandler);
  nextButton.addEventListener('click', restartQuiz, { once: true });
}

function restartQuiz() {
  nextButton.removeEventListener('click', restartQuiz);
  nextButton.addEventListener('click', nextButtonHandler);
  startQuiz();
}

function nextButtonHandler() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

nextButton.addEventListener('click', nextButtonHandler);
startQuiz();
