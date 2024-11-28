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

function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Clear any existing interval
    questionStartTime = Date.now(); // Reset the start time
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - questionStartTime) / 1000);
        totalTimeDisplay.textContent = elapsedTime; // Update the display
    }, 1000); // Update every second
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval); // Stop the timer
}

// Load Movies
async function loadMovies() {
    const response = await fetch('movies.json');
    const data = await response.json();
    movies = data.movies.sort(() => 0.5 - Math.random()); // Shuffle movies
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
    
    // Reset buttons and containers
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
    
    loadNextQuestion();
}

function loadNextQuestion() {
    if (currentMovieIndex >= movies.length) {
        endGame();
        return;
    }

    const currentMovie = movies[currentMovieIndex];
    moviePlot.textContent = currentMovie.plot;
    moviePoster.src = currentMovie.posterPath;

    startTimer(); // Start the timer here
}


// Hint Handling
hint1Btn.addEventListener('click', () => {
    const currentMovie = movies[currentMovieIndex];
    hintText.textContent = `Genre: ${currentMovie.genre}`;
    hint1Btn.disabled = true;
    hintsUsed++;
    totalTime += 15; // 15-second penalty for hint usage
});

hint2Btn.addEventListener('click', () => {
    const currentMovie = movies[currentMovieIndex];
    hintText.textContent += ` | Release Date: ${currentMovie.releaseDate}`;
    hint2Btn.disabled = true;
    hintsUsed++;
    totalTime += 15; // 15-second penalty for hint usage
});

hint3Btn.addEventListener('click', () => {
    const currentMovie = movies[currentMovieIndex];
    hintText.textContent += ` | Main Cast: ${currentMovie.mainCast}`;
    hint3Btn.disabled = true;
    hintsUsed++;
    totalTime += 15; // 15-second penalty for hint usage
});

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
        giveUpBtn.classList.add('hidden'); // Hide the "Give Up" button when correct
        stopTimer(); // Stop the timer here (only when the guess is correct)
    } else {
        feedbackText.textContent = `Wrong. Try again!`; // Let user know it's incorrect
        submitGuessBtn.disabled = false; // Allow them to submit again
        movieGuessInput.disabled = false; // Allow them to type another guess
        movieGuessInput.value = ''; // Clear the input for a new guess
        // Timer keeps running so the user can continue guessing
    }

    // Reveal poster and show next question button only after correct guess or give up
    if (userGuess === correctTitle || giveUpBtn.classList.contains('hidden')) {
        moviePosterContainer.classList.remove('hidden');
        nextQuestionBtn.classList.remove('hidden');
        submitGuessBtn.disabled = true;
        movieGuessInput.disabled = true;
    }
}



// Give Up Function
giveUpBtn.addEventListener('click', () => {
    const currentMovie = movies[currentMovieIndex];
    feedbackText.textContent = `You gave up. The movie was ${currentMovie.title}. 60 Seconds added to your time!`;
    submitGuessBtn.disabled = true;
    movieGuessInput.disabled = true;
    moviePosterContainer.classList.remove('hidden');
    nextQuestionBtn.classList.remove('hidden');
    
    // Calculate time and add penalties
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    totalTime += questionTime + 60 + (hintsUsed * 30); // Add 60-second penalty for giving up
    stopTimer(); // Ensure the timer is stopped
});

// Next Question Handling
nextQuestionBtn.addEventListener('click', () => {
    currentMovieIndex++;
    currentQuestionDisplay.textContent = `${currentMovieIndex + 1}`;
    
    // Reset for next question
    hintText.textContent = '';
    feedbackText.textContent = '';
    moviePosterContainer.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');
    submitGuessBtn.disabled = false;
    movieGuessInput.disabled = false;
    movieGuessInput.value = '';
    
    // Reset hint buttons
    hint1Btn.disabled = false;
    hint2Btn.disabled = false;
    hint3Btn.disabled = false;
    hintsUsed = 0;
    
    loadNextQuestion();
});

// End Game Function
function endGame() {
    gamePage.classList.add('hidden');
    const playerName = prompt('Game Over! Enter your name for the high score:');
    if (playerName) {
        saveHighScore(playerName, totalTime);
    }
    showHighScoresPage();
}

// High Score Functions
function saveHighScore(name, time) {
    let highScores = JSON.parse(localStorage.getItem('movieTriviaHighScores')) || [];
    highScores.push({ name, time });
    
    // Sort and keep top 10
    highScores.sort((a, b) => a.time - b.time);
    highScores = highScores.slice(0, 10);
    
    localStorage.setItem('movieTriviaHighScores', JSON.stringify(highScores));
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('movieTriviaHighScores')) || [];
    highScoresList.innerHTML = highScores.map((score, index) => 
        `<li>${index + 1}. ${score.name} - ${score.time} seconds</li>`
    ).join('');
}

// Event Listeners for Navigation
newGameBtn.addEventListener('click', showGamePage);
highScoresBtn.addEventListener('click', showHighScoresPage);
returnBtn.addEventListener('click', showTitlePage);

// Initial Setup
loadMovies();
showTitlePage();
