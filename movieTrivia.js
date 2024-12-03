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
    const movieGuessDropdown = document.getElementById('movie-guess');
    movieGuessDropdown.disabled = false; // Enable dropdown
    movieGuessDropdown.value = ''; // Clear any previous selection
}


// Load Movies
async function loadMovies() {
    movies = [
        {
            "title": "Back to the Future",
            "plot": "A teenager is accidentally sent back in time from 1985 to 1955, where he meets his future parents and becomes his mother's romantic interest.",
            "genre": "Science Fiction, Comedy",
            "releaseDate": "1985",
            "mainCast": "Michael J. Fox, Christopher Lloyd",
            "posterPath": "Images/BackToTheFuture.jpg"
        },
        {
            "title": "Fight Club",
            "plot": "An insomniac office worker and a soap maker form an underground fight club that evolves into something much, much more.",
            "genre": "Drama, Psychological Thriller",
            "releaseDate": "1999",
            "mainCast": "Brad Pitt, Edward Norton",
            "posterPath": "Images/FightClub.jpg"
        },
        {
            "title": "Forrest Gump",
            "plot": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
            "genre": "Drama, Romance",
            "releaseDate": "1994",
            "mainCast": "Tom Hanks, Robin Wright",
            "posterPath": "Images/ForrestGump.jpg"
        },
        {
            "title": "Inception",
            "plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            "genre": "Science Fiction, Action",
            "releaseDate": "2010",
            "mainCast": "Leonardo DiCaprio, Joseph Gordon-Levitt",
            "posterPath": "Images/Inception.jpg"
        },
        {
            "title": "Jurassic Park",
            "plot": "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
            "genre": "Science Fiction, Adventure",
            "releaseDate": "1993",
            "mainCast": "Sam Neill, Laura Dern",
            "posterPath": "Images/JurassicPark.jpg"
        },
        {
            "title": "The Dark Knight",
            "plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "genre": "Action, Superhero",
            "releaseDate": "2008",
            "mainCast": "Christian Bale, Heath Ledger",
            "posterPath": "Images/TheDarkKnight.jpg"
        },
        {
            "title": "The Godfather",
            "plot": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            "genre": "Crime, Drama",
            "releaseDate": "1972",
            "mainCast": "Marlon Brando, Al Pacino",
            "posterPath": "Images/TheGodfather.jpg"
        },
        {
            "title": "The Matrix",
            "plot": "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to overthrow them.",
            "genre": "Science Fiction, Action",
            "releaseDate": "1999",
            "mainCast": "Keanu Reeves, Laurence Fishburne",
            "posterPath": "Images/TheMatrix.jpg"
        },
        {
            "title": "The Shawshank Redemption",
            "plot": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            "genre": "Drama",
            "releaseDate": "1994",
            "mainCast": "Tim Robbins, Morgan Freeman",
            "posterPath": "Images/TheShawshankRedemption.jpg"
        },
        {
            "title": "Titanic",
            "plot": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
            "genre": "Romance, Drama",
            "releaseDate": "1997",
            "mainCast": "Leonardo DiCaprio, Kate Winslet",
            "posterPath": "Images/Titanic.jpg"
        }
    ];
    movies = movies.sort(() => 0.5 - Math.random()); // Shuffle movies randomly
}


function loadNextQuestion() {
    if (currentMovieIndex >= movies.length) {
        endGame();
        return;
    }

    const currentMovie = movies[currentMovieIndex];
    moviePlot.textContent = currentMovie.plot;
    moviePoster.src = currentMovie.posterPath;

    // Populate the dropdown with movie titles
    const movieGuessDropdown = document.getElementById('movie-guess');
    movieGuessDropdown.innerHTML = '<option value="">Select a Movie</option>'; // Clear previous options
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.title;
        option.textContent = movie.title;
        movieGuessDropdown.appendChild(option);
    });

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
    const movieGuessDropdown = document.getElementById('movie-guess');
    const userGuess = movieGuessDropdown.value.trim().toLowerCase();
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

const movieGuessDropdown = document.getElementById('movie-guess');
movieGuessDropdown.addEventListener('change', () => {
    submitGuessBtn.disabled = !movieGuessDropdown.value; // Disable submit if no movie is selected
});


// Event Listeners
newGameBtn.addEventListener('click', showGamePage);
highScoresBtn.addEventListener('click', showHighScoresPage);
returnBtn.addEventListener('click', showTitlePage);
