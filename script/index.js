const API_KEY = 'AIzaSyDwQjoBuA7vPlwJ4emt7plplfpXSDoEhVs';
let currentMovieIndex = 0;
let featuredMovies = [];

// Featured search terms for main display
const FEATURED_KEYWORDS = [
    'latest movies full length',
    'new release movies',
    'popular movies full',
    'trending movies full',
    'blockbuster movies full'
];

// Genre-specific search terms
const GENRE_KEYWORDS = {
    'Horror': 'horror movies full length',
    'Action': 'action movies full length',
    'Comedy': 'comedy movies full length',
    'Drama': 'drama movies full length',
    'Sci-Fi': 'sci-fi movies full length'
};

async function fetchFeaturedMovies() {
    try {
        const randomKeyword = FEATURED_KEYWORDS[Math.floor(Math.random() * FEATURED_KEYWORDS.length)];
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${randomKeyword}&type=video&videoDuration=long&key=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching featured movies:', error);
        return [];
    }
}

async function updateMovieCard(index) {
    const movie = featuredMovies[index];
    const movieCard = document.querySelector('.movieCard');
    const card = movieCard.querySelector('.card');

    const thumbnail = movie.snippet.thumbnails.high.url;
    
    movieCard.style.backgroundImage = `url(${thumbnail})`;
    movieCard.style.backgroundSize = 'cover';
    movieCard.style.backgroundPosition = 'center';

    card.innerHTML = `
        <div class="title">
            <h1>${movie.snippet.title}</h1>
            <div class="info">
                <div class="age">
                    <p>ALL</p>
                </div>
                <div class="sound">
                    <p>HD</p>
                </div>
            </div>
        </div>
        <div class="more">
            <div class="playBtn">
                <i class="fa-solid fa-play"></i>
                <p>Play</p>
            </div>
            <div class="movieDsp">
                <p>${movie.snippet.description}</p>
            </div>
        </div>
    `;

    const playBtn = card.querySelector('.playBtn');
    playBtn.addEventListener('click', () => {
        if (movie.id?.videoId) {
            window.location.href = `routes/watch.html?v=${movie.id.videoId}&title=${encodeURIComponent(movie.snippet.title)}`;
        }
    });
}

async function fetchMoviesByGenre(genre) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${GENRE_KEYWORDS[genre]}&type=video&videoDuration=long&key=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

async function createGenreSections() {
    const genreLists = document.querySelector('.genreLists');
    genreLists.innerHTML = '';

    for (const genre of Object.keys(GENRE_KEYWORDS)) {
        const genreSection = document.createElement('div');
        genreSection.className = 'genreType';
        
        genreSection.innerHTML = `
            <h2>${genre}</h2>
            <div class="movies">
                <div class="genre-left"><i class="fa-solid fa-caret-left"></i></div>
                <div class="movies-container"></div>
                <div class="genre-right"><i class="fa-solid fa-caret-right"></i></div>
            </div>
        `;

        const moviesContainer = genreSection.querySelector('.movies-container');
        const moviesList = await fetchMoviesByGenre(genre);
        
        moviesList.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'genreMovies';
            
            const thumbnail = movie.snippet.thumbnails?.high?.url || movie.snippet.thumbnails?.default?.url;
            
            movieElement.innerHTML = `
                <div class="imageCont">
                    <img src="${thumbnail}" alt="${movie.snippet.title}" id="movieImage">
                </div>
                <p id="movieTitle">${movie.snippet.title}</p>
            `;
            
            movieElement.addEventListener('click', () => {
                if (movie.id?.videoId) {
                    window.location.href = `routes/watch.html?v=${movie.id.videoId}&title=${encodeURIComponent(movie.snippet.title)}`;
                }
            });
            
            moviesContainer.appendChild(movieElement);
        });

        genreLists.appendChild(genreSection);

        // Add scroll functionality
        const leftBtn = genreSection.querySelector('.genre-left');
        const rightBtn = genreSection.querySelector('.genre-right');
        
        leftBtn.addEventListener('click', () => {
            moviesContainer.scrollLeft -= 300;
        });
        
        rightBtn.addEventListener('click', () => {
            moviesContainer.scrollLeft += 300;
        });
    }
}

// Navigation controls
document.querySelector('.left').addEventListener('click', () => {
    currentMovieIndex = (currentMovieIndex - 1 + featuredMovies.length) % featuredMovies.length;
    updateMovieCard(currentMovieIndex);
});

document.querySelector('.right').addEventListener('click', () => {
    currentMovieIndex = (currentMovieIndex + 1) % featuredMovies.length;
    updateMovieCard(currentMovieIndex);
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const movieCard = document.querySelector('.movieCard');
        movieCard.innerHTML = '<div class="card"><h1>Loading...</h1></div>';

        featuredMovies = await fetchFeaturedMovies();
        if (featuredMovies && featuredMovies.length > 0) {
            updateMovieCard(currentMovieIndex);
        } else {
            movieCard.innerHTML = '<div class="card"><h1>No movies available</h1></div>';
        }
        
        await createGenreSections();
    } catch (error) {
        console.error('Failed to initialize:', error);
        const movieCard = document.querySelector('.movieCard');
        movieCard.innerHTML = '<div class="card"><h1>Error loading movies</h1></div>';
    }
});