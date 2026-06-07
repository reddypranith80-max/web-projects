/* ==========================================
   DIMENSION QUIZ - 3D INTERACTIVE JAVASCRIPT
   ========================================== */

// --- 1. QUIZ DATABASE ---
const quizDatabase = {
    geography: {
        title: "Geography",
        questions: [
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
                question: "What is the largest ocean on Earth?",
                answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
                correctIndex: 2
            },
            {
                question: "Which river flows through Egypt?",
                answers: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
                correctIndex: 1
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                answers: ["China", "Japan", "South Korea", "Thailand"],
                correctIndex: 1
            }
        ]
    },
    science: {
        title: "Space & Science",
        questions: [
            {
                question: "Which planet is closest to the Sun?",
                answers: ["Venus", "Earth", "Mercury", "Mars"],
                correctIndex: 2
            },
            {
                question: "What is the chemical symbol for gold?",
                answers: ["Gd", "Au", "Ag", "Fe"],
                correctIndex: 1
            },
            {
                question: "What is known as the powerhouse of the cell?",
                answers: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
                correctIndex: 1
            },
            {
                question: "Approximately how fast does light travel in a vacuum?",
                answers: ["3,000 km/s", "150,000 km/s", "300,000 km/s", "1,000,000 km/s"],
                correctIndex: 2
            },
            {
                question: "What is the most abundant gas in Earth's atmosphere?",
                answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
                correctIndex: 1
            }
        ]
    },
    literature: {
        title: "History & Lit",
        questions: [
            {
                question: "Who wrote the classic play 'Romeo and Juliet'?",
                answers: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
                correctIndex: 1
            },
            {
                question: "In which year did World War I begin?",
                answers: ["1914", "1918", "1939", "1945"],
                correctIndex: 0
            },
            {
                question: "Which famous artist painted the Mona Lisa?",
                answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correctIndex: 2
            },
            {
                question: "Which ancient civilization built the Great Pyramids of Giza?",
                answers: ["Romans", "Greeks", "Egyptians", "Aztecs"],
                correctIndex: 2
            },
            {
                question: "What ship brought the Pilgrims to America in 1620?",
                answers: ["Santa Maria", "Mayflower", "HMS Beagle", "Endeavour"],
                correctIndex: 1
            }
        ]
    }
};

// --- 2. GAME STATE VARIABLES ---
let activeCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let timeBonus = 0;
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
let timerInterval = null;
let questionTimeRemaining = 0; // milliseconds
const QUESTION_LIMIT = 15000; // 15 seconds
let acceptInput = true;

// --- 3. DOM ELEMENTS ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const categoryCards = document.querySelectorAll(".category-card");

const currentCategoryName = document.getElementById("current-category-name");
const scoreCounter = document.getElementById("score-counter");
const currentQuestionNum = document.getElementById("current-question-num");
const totalQuestionsNum = document.getElementById("total-questions-num");
const progressFill = document.getElementById("progress-fill");
const livesBox = document.getElementById("lives-box");
const questionCard = document.getElementById("question-card");
const questionText = document.getElementById("question-text");
const timerFill = document.getElementById("timer-fill");
const optionsBox = document.getElementById("options-box");

const badgeIcon = document.getElementById("badge-icon");
const performanceFeedback = document.getElementById("performance-feedback");
const accuracyRate = document.getElementById("accuracy-rate");
const finalScoreCounter = document.getElementById("final-score-counter");
const timeBonusValue = document.getElementById("time-bonus-value");
const tiltBox = document.getElementById("tilt-box");

// Initialize Sound Button State
if (!soundEnabled) {
    soundIcon.className = "fas fa-volume-mute";
}

// --- 4. 3D PARALLAX TILT SCRIPT ---
function initTiltEffect() {
    const isMobile = window.matchMedia("(max-width: 650px)").matches;
    if (isMobile) {
        tiltBox.style.transform = "none";
        return;
    }

    document.addEventListener("mousemove", (e) => {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        
        // Calculate relative coordinates from screen center (-1 to 1)
        const mouseX = (e.clientX - halfWidth) / halfWidth;
        const mouseY = (e.clientY - halfHeight) / halfHeight;

        // Max rotation degrees
        const maxRotation = 10; 

        const rotX = -mouseY * maxRotation;
        const rotY = mouseX * maxRotation;

        tiltBox.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    document.addEventListener("mouseleave", () => {
        // Smoothly restore horizontal center
        tiltBox.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}
initTiltEffect();

// --- 5. SYNTHESIZED SOUND EFFECTS (WEB AUDIO API) ---
let audioCtx = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSynthSound(type) {
    if (!soundEnabled) return;
    
    try {
        initAudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        switch (type) {
            case "select": {
                // Quick clean click
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            }
            case "hover": {
                // Ultra-soft click
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            }
            case "success": {
                // Rising major triad arpeggio
                const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, now + i * 0.08);
                    gain.gain.setValueAtTime(0.12, now + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.25);
                });
                break;
            }
            case "failure": {
                // Descending sliding buzz
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.linearRampToValueAtTime(110, now + 0.4);
                
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
            }
            case "intro": {
                // Sci-fi sweep upward
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
                
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            }
            case "gameover": {
                // Sinking sad minor descent
                const notes = [196.00, 155.56, 130.81]; // G3, Eb3, C3
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(freq, now + i * 0.15);
                    gain.gain.setValueAtTime(0.15, now + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.45);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.15);
                    osc.stop(now + i * 0.15 + 0.45);
                });
                break;
            }
            case "triumphant": {
                // Sparkling final brass sound
                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 to G5
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, now + i * 0.05);
                    gain.gain.setValueAtTime(0.1, now + i * 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.05);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.05);
                    osc.stop(now + 0.5 + i * 0.05);
                });
                break;
            }
        }
    } catch (err) {
        console.warn("Audio Context synth generation failed: ", err);
    }
}

// --- 6. UTILITIES: SOUND TOGGLE ---
soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    if (soundEnabled) {
        soundIcon.className = "fas fa-volume-up";
        playSynthSound("select");
    } else {
        soundIcon.className = "fas fa-volume-mute";
    }
});

// Add hover sound to icons and categories
document.querySelectorAll(".icon-btn, .category-card").forEach(el => {
    el.addEventListener("mouseenter", () => playSynthSound("hover"));
});

// --- 7. CATEGORY SELECTION LOGIC ---
categoryCards.forEach(card => {
    card.addEventListener("click", () => {
        playSynthSound("select");
        categoryCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        
        activeCategory = card.getAttribute("data-category");
        startBtn.classList.remove("disabled");
        startBtn.querySelector(".btn-front").textContent = `Launch ${quizDatabase[activeCategory].title}`;
    });
});

startBtn.addEventListener("click", () => {
    if (!activeCategory) return;
    playSynthSound("intro");
    transitionScreen(startScreen, quizScreen);
    initializeGame();
});

// Screen Swapping Helper
function transitionScreen(currentScreen, nextScreen) {
    currentScreen.classList.remove("active");
    // Short timeout to let transition complete before changing display
    setTimeout(() => {
        currentScreen.style.display = "none";
        nextScreen.style.display = "block";
        // Force layout repaint
        nextScreen.offsetHeight;
        nextScreen.classList.add("active");
    }, 300);
}

// --- 8. GAME INITIALIZATION & RUNNER ---
function initializeGame() {
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    timeBonus = 0;
    
    currentCategoryName.textContent = quizDatabase[activeCategory].title;
    scoreCounter.textContent = "00";
    totalQuestionsNum.textContent = quizDatabase[activeCategory].questions.length;
    
    updateLivesDisplay();
    loadQuestion();
}

function updateLivesDisplay() {
    livesBox.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement("i");
        heart.className = "fas fa-heart";
        if (i < lives) {
            heart.classList.add("active-life");
        } else {
            heart.classList.add("lost-life");
        }
        livesBox.appendChild(heart);
    }
}

function loadQuestion() {
    acceptInput = true;
    const currentQuestionObj = quizDatabase[activeCategory].questions[currentQuestionIndex];
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    
    // Progress fill update
    const progressPct = ((currentQuestionIndex) / quizDatabase[activeCategory].questions.length) * 100;
    progressFill.style.width = `${progressPct}%`;
    
    // Animate Card Spin
    questionCard.classList.add("spin");
    setTimeout(() => {
        questionText.textContent = currentQuestionObj.question;
        questionCard.classList.remove("spin");
    }, 300);
    
    // Populate Answers
    optionsBox.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    currentQuestionObj.answers.forEach((ans, index) => {
        const optBtn = document.createElement("button");
        optBtn.className = "option-btn-3d";
        optBtn.dataset.index = index;
        
        optBtn.innerHTML = `
            <span class="opt-back"></span>
            <span class="opt-front">
                <span class="opt-prefix">${letters[index]}</span>
                ${ans}
            </span>
        `;
        
        optBtn.addEventListener("mouseenter", () => playSynthSound("hover"));
        optBtn.addEventListener("click", () => selectAnswer(index, optBtn));
        
        optionsBox.appendChild(optBtn);
    });

    startQuestionTimer();
}

// --- 9. QUESTION TIMER SYSTEM ---
function startQuestionTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    questionTimeRemaining = QUESTION_LIMIT;
    timerFill.className = "timer-fill";
    timerFill.style.width = "100%";
    
    const tickRate = 50; // 50ms intervals
    timerInterval = setInterval(() => {
        questionTimeRemaining -= tickRate;
        
        const pct = (questionTimeRemaining / QUESTION_LIMIT) * 100;
        timerFill.style.width = `${pct}%`;
        
        if (questionTimeRemaining <= 4000) {
            timerFill.classList.add("warning");
        }
        
        if (questionTimeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, tickRate);
}

function handleTimeout() {
    if (!acceptInput) return;
    acceptInput = false;
    playSynthSound("failure");
    
    lives--;
    updateLivesDisplay();
    
    // Highlight the correct answer
    const correctIdx = quizDatabase[activeCategory].questions[currentQuestionIndex].correctIndex;
    const optionBtns = optionsBox.querySelectorAll(".option-btn-3d");
    
    optionBtns.forEach(btn => {
        btn.classList.add("disabled");
        if (parseInt(btn.dataset.index) === correctIdx) {
            btn.classList.add("correct");
        }
    });

    checkGameStateOrContinue();
}

// --- 10. ANSWER SELECTION LOGIC ---
function selectAnswer(selectedIndex, selectedBtn) {
    if (!acceptInput) return;
    acceptInput = false;
    clearInterval(timerInterval);
    
    const correctIndex = quizDatabase[activeCategory].questions[currentQuestionIndex].correctIndex;
    const isCorrect = (selectedIndex === correctIndex);
    const optionBtns = optionsBox.querySelectorAll(".option-btn-3d");

    optionBtns.forEach(btn => btn.classList.add("disabled"));

    if (isCorrect) {
        playSynthSound("success");
        selectedBtn.classList.add("correct");
        
        // Score calculation: Base 10 + speed bonus
        const speedBonus = Math.floor((questionTimeRemaining / 1000) * 2);
        timeBonus += speedBonus;
        score += 10 + speedBonus;
        
        scoreCounter.textContent = score.toString().padStart(2, "0");
    } else {
        playSynthSound("failure");
        selectedBtn.classList.add("incorrect");
        
        // Show correct answer alongside incorrect selection
        optionBtns.forEach(btn => {
            if (parseInt(btn.dataset.index) === correctIndex) {
                btn.classList.add("correct");
            }
        });
        
        lives--;
        updateLivesDisplay();
    }

    checkGameStateOrContinue();
}

function checkGameStateOrContinue() {
    setTimeout(() => {
        if (lives <= 0) {
            endGame(false);
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizDatabase[activeCategory].questions.length) {
                loadQuestion();
            } else {
                endGame(true);
            }
        }
    }, 1800); // 1.8 seconds delay to visualize correct/incorrect answers
}

// --- 11. END GAME & RESULTS ---
function endGame(completedSuccessfully) {
    clearInterval(timerInterval);
    
    // Update progress fill one final time to 100%
    if (completedSuccessfully) {
        progressFill.style.width = "100%";
    }
    
    transitionScreen(quizScreen, resultScreen);
    
    const totalQuestions = quizDatabase[activeCategory].questions.length;
    const accuracy = Math.round((completedSuccessfully ? (3 - (3 - lives)) : 0) * 20); // Dummy accurate math placeholder
    
    // Correctly count correct answers:
    // Let's count correct questions directly.
    let correctAnswersCount = 0;
    // We can infer correct count by looking at score minus bonus, or track it directly. Let's compute based on remaining lives
    // but wait! If you get it wrong, you lose a life. So correct answers is simply (Total Questions - (3 - lives))
    // Let's make it robust:
    const lostLives = 3 - lives;
    const correctCount = Math.max(0, totalQuestions - lostLives);
    const accPercent = Math.round((correctCount / totalQuestions) * 100);

    // Render Stats
    accuracyRate.textContent = `${accPercent}%`;
    finalScoreCounter.textContent = `${score}`;
    timeBonusValue.textContent = `+${timeBonus}`;

    // Trophy badges depending on performance
    let badgeHtml = "";
    let commentary = "";
    
    if (accPercent >= 100) {
        badgeHtml = `<i class="fas fa-trophy" style="color:#fbbf24;"></i>`;
        commentary = "Astral Intellect! Perfect execution.";
        playSynthSound("triumphant");
    } else if (accPercent >= 80) {
        badgeHtml = `<i class="fas fa-award" style="color:#e5e7eb;"></i>`;
        commentary = "Superb! Highly optimized neuron structure.";
        playSynthSound("triumphant");
    } else if (accPercent >= 50) {
        badgeHtml = `<i class="fas fa-medal" style="color:#d97706;"></i>`;
        commentary = "Good pass. Solid standard trivia metrics.";
        playSynthSound("intro");
    } else {
        badgeHtml = `<i class="fas fa-heart-broken" style="color:#ef4444;"></i>`;
        commentary = "System critical. Please re-read core documentation.";
        playSynthSound("gameover");
    }
    
    badgeIcon.innerHTML = badgeHtml;
    performanceFeedback.textContent = commentary;
}

// --- 12. RETRY / RESET NAVIGATION ---
restartBtn.addEventListener("click", () => {
    playSynthSound("intro");
    transitionScreen(resultScreen, quizScreen);
    initializeGame();
});

menuBtn.addEventListener("click", () => {
    playSynthSound("select");
    
    // Reset category grids
    categoryCards.forEach(c => c.classList.remove("selected"));
    activeCategory = null;
    startBtn.classList.add("disabled");
    startBtn.querySelector(".btn-front").textContent = "Choose a Domain";
    
    transitionScreen(resultScreen, startScreen);
});
