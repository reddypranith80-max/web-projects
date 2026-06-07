const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answerContainer = document.getElementById("answer-container");
const currentQuestionSpan = document.getElementById("question-number");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("total-score");
const resultMessage = document.getElementById("feedback");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");



const questions = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2
    },
    {
        question: "What is the capital of Italy?",
        answers: ["Madrid", "Rome", "Paris", "Berlin"],
        correctIndex: 1
    },
    {
        question: "Which planet is closest to the Sun?",
        answers: ["Venus", "Earth", "Mercury", "Mars"],
        correctIndex: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctIndex: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        answers: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correctIndex: 1
    },
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = questions.length;
maxScoreSpan.textContent = questions.length;

startButton.addEventListener("click", startGame)
restartButton.addEventListener("click", resetGame);


function startGame() {
    console.log("Quiz started");
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = score
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();

}

function showQuestion() {
    answersDisabled = false;
    const currentQuestion = questions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPercent = (((currentQuestionIndex) + 1) / questions.length) * 100;
    progressBar.style.width = progressPercent + "%";
    questionText.textContent = currentQuestion.question;

    answerContainer.innerHTML = ""

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.textContent = answer;
        button.classList.add("answer-btn");

        button.dataset.correct =
            index === currentQuestion.correctIndex;

        button.addEventListener("click", selectAnswer);

        answerContainer.appendChild(button);
    });
}
function selectAnswer(event) {
    if (answersDisabled) return;

    answersDisabled = true;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true"

    Array.from(answerContainer.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        else if (button === selectedButton) {
            button.classList.add("incorrect");
        }
    });
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }
    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

function showResults() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    finalScoreSpan.textContent = score;

    const percentage = (score / questions.length) * 100;
    if (percentage >= 75) {
        feedback.textContent = "Excellent! Keep it up!"
    } else if (percentage >= 50) {
        feedback.textContent = "Good job!"
    } else if (percentage >= 25) {
        feedback.textContent = "Keep practicing!"
    } else {
        feedback.textContent = "Time to study more!"
    }
}


function resetGame() {
    resultScreen.classList.remove("active");
    startGame();
}

