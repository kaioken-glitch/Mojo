const API_KEY = 'AIzaSyD2iGspJH8SvAjDKEYmpYTTcIHFfLhr2tw';
const searchInput = document.querySelector('#searchInput');
const searchResults = document.querySelector('.searchResults');
const searchIcon = document.querySelector('.fa-magnifying-glass');

async function searchMovies(query) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query} full movie&type=video&videoDuration=long&key=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Search Error:', error);
        throw error;
    }
}

function createResultDiv(movie) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'resultDiv';
    
    const thumbnail = movie.snippet.thumbnails?.high?.url || movie.snippet.thumbnails?.default?.url;
    
    resultDiv.innerHTML = `
        <div class="image">
            <img src="${thumbnail}" alt="${movie.snippet.title}">
        </div>
        <p>${movie.snippet.title}</p>
    `;
    
    resultDiv.addEventListener('click', () => {
        if (movie.id?.videoId) {
            window.location.href = `../routes/watch.html?v=${movie.id.videoId}&title=${encodeURIComponent(movie.snippet.title)}`;
        }
    });
    
    return resultDiv;
}

async function handleSearch() {
    const query = searchInput.value.trim();

    if (query.length > 2) {
        try {
            searchResults.innerHTML = '<div class="loading">Searching...</div>';
            const movies = await searchMovies(query);
            
            searchResults.innerHTML = '';
            if (movies.length > 0) {
                movies.forEach(movie => {
                    const resultDiv = createResultDiv(movie);
                    searchResults.appendChild(resultDiv);
                });
            } else {
                searchResults.innerHTML = '<div class="no-results">No movies found</div>';
            }
        } catch (error) {
            searchResults.innerHTML = '<div class="error">Failed to fetch results</div>';
        }
    }
}

// Event Listeners
searchIcon.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
