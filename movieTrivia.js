// DOM Elements
const titlePage = document.getElementById('title-page');
const gamePage = document.getElementById('game-page');
const highScoresPage = document.getElementById('high-scores-page');
const newGameBtn = document.getElementById('new-game-btn');
const highScoresBtn = document.getElementById('high-scores-btn');
const returnBtn = document.getElementById('return-btn');
const moviePlot = document.getElementById('movie-plot');
const movieGuessInput = document.getElementById('movie-guess');
const submitGuessBtn = document.getElementById('submit-guess');
const giveUpBtn = document.getElementById('give-up-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const hint1Btn = document.getElementById('hint1-btn');
const hint2Btn = document.getElementById('hint2-btn');
const hint3Btn = document.getElementById('hint3-btn');
const hintText = document.getElementById('hint-text');
const feedbackText = document.getElementById('feedback-text');
const totalTimeDisplay = document.getElementById('total-time');
const currentQuestionDisplay = document.getElementById('current-question');
const moviePosterContainer = document.getElementById('movie-reveal-container');
const moviePoster = document.getElementById('movie-poster');
const highScoresList = document.getElementById('high-scores-list');

// Game State Variables
let movies = [];
let currentMovieIndex = 0;
let totalTime = 0;
let questionStartTime = 0;
let hintsUsed = 0;
let timerInterval;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Timer Functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    questionStartTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - questionStartTime) / 1000);
        totalTimeDisplay.textContent = elapsedTime;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

// Navigation Functions
function showTitlePage() {
    titlePage.classList.remove('hidden');
    gamePage.classList.add('hidden');
    highScoresPage.classList.add('hidden');
}

function showGamePage() {
    titlePage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    highScoresPage.classList.add('hidden');
    startNewGame();
}

function showHighScoresPage() {
    titlePage.classList.add('hidden');
    gamePage.classList.add('hidden');
    highScoresPage.classList.remove('hidden');
    displayHighScores();
}

// Game Initialization
function startNewGame() {
    currentMovieIndex = 0;
    totalTime = 0;
    hintsUsed = 0;
    totalTimeDisplay.textContent = '0';
    currentQuestionDisplay.textContent = '1';
    
    resetUI();
    loadMovies().then(loadNextQuestion);
}

function resetUI() {
    hint1Btn.disabled = false;
    hint2Btn.disabled = false;
    hint3Btn.disabled = false;
    hintText.textContent = '';
    feedbackText.textContent = '';
    moviePosterContainer.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');
    submitGuessBtn.disabled = false;
    movieGuessInput.value = '';
    movieGuessInput.disabled = false;
}

// Load Movies
async function loadMovies() {
    const response = await fetch('movies.json');
    const data = await response.json();
    movies = data.movies.sort(() => 0.5 - Math.random());
}

function loadNextQuestion() {
    if (currentMovieIndex >= movies.length) {
        endGame();
        return;
    }

    const currentMovie = movies[currentMovieIndex];
    moviePlot.textContent = currentMovie.plot;
    moviePoster.src = currentMovie.posterPath;

    startTimer();
}

// Hint Handling
hint1Btn.addEventListener('click', () => applyHint('genre'));
hint2Btn.addEventListener('click', () => applyHint('releaseDate'));
hint3Btn.addEventListener('click', () => applyHint('mainCast'));

function applyHint(hintType) {
    const currentMovie = movies[currentMovieIndex];
    let hintContent = '';

    if (hintType === 'genre') hintContent = `Genre: ${currentMovie.genre}`;
    else if (hintType === 'releaseDate') hintContent = `Release Date: ${currentMovie.releaseDate}`;
    else if (hintType === 'mainCast') hintContent = `Main Cast: ${currentMovie.mainCast}`;

    hintText.textContent += ` | ${hintContent}`;
    document.getElementById(`hint${hintsUsed + 1}-btn`).disabled = true;
    hintsUsed++;
    totalTime += 15;
}

// Guess Handling
submitGuessBtn.addEventListener('click', checkGuess);
movieGuessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGuess();
});

function checkGuess() {
    const userGuess = movieGuessInput.value.trim().toLowerCase();
    const currentMovie = movies[currentMovieIndex];
    const correctTitle = currentMovie.title.toLowerCase();

    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    totalTime += questionTime;

    if (userGuess === correctTitle) {
        feedbackText.textContent = `Correct! The movie is ${currentMovie.title}.`;
        stopTimer();
        handleCorrectGuess();
    } else {
        feedbackText.textContent = 'Wrong. Try again!';
        movieGuessInput.value = '';
    }
}

function handleCorrectGuess() {
    moviePosterContainer.classList.remove('hidden');
    nextQuestionBtn.classList.remove('hidden');
    submitGuessBtn.disabled = true;
    movieGuessInput.disabled = true;
}

// Give Up Function
giveUpBtn.addEventListener('click', () => {
    const currentMovie = movies[currentMovieIndex];
    feedbackText.textContent = `You gave up. The movie was ${currentMovie.title}. 60 seconds added!`;
    totalTime += 60 + hintsUsed * 30;
    stopTimer();
    handleCorrectGuess();
});

// Next Question Handling
nextQuestionBtn.addEventListener('click', () => {
    currentMovieIndex++;
    currentQuestionDisplay.textContent = `${currentMovieIndex + 1}`;
    resetUI();
    loadNextQuestion();
});

// End Game Function
function endGame() {
    stopTimer();
    gamePage.classList.add('hidden');
    const playerName = prompt('Game Over! Enter your name for the high score:');
    if (playerName) saveHighScore(playerName, totalTime);
    showHighScoresPage();
}

// High Score Functions
function saveHighScore(name, time) {
    highScores.push({ name, time });
    highScores.sort((a, b) => a.time - b.time);
    highScores = highScores.slice(0, 10); // Keep top 10 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    highScoresList.innerHTML = highScores.map(
        (score) => `<li>${score.name} - ${score.time}s</li>`
    ).join('');
}

// Event Listeners
newGameBtn.addEventListener('click', showGamePage);
highScoresBtn.addEventListener('click', showHighScoresPage);
returnBtn.addEventListener('click', showTitlePage);
