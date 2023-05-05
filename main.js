import { apiKey } from "./apiKey.js";

const movieList = document.getElementById("movieList");

async function getPopularMovies() {
    try {
        let request =  await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`);
        let resposta = await request.json();
        let movies = resposta.results;
        
        movies.forEach((movie) => {
            console.log(movie)
            renderMovies(movie);
        })
    }

    catch(error) {
        console.log(error);
    }
}

function isFavorite(movie) {
    if (movie.isFavorite) {
        return `
        <img src="assets/heart-fill-icon.svg">
        <span>Desfavoritar</span>
        `;
    } else {
        return `
        <img src="assets/heart-icon.svg">
        <span>Favoritar</span>
        `;
    }
}

// "formatar" a visualização da data pra aparecer só o ano
function formatReleaseYear(date) {
    let year = date.split("-")[0];
    return year;
}

function showDescription(description) {
    return description == "" ? "Sinopse não disponível." : description;
}

function renderMovies(movie) {
    let imagePath = "https://image.tmdb.org/t/p/w500/";

    movieList.innerHTML +=  `
    <div class="movie_item">
        <div class="movie_image">
            <img src="${imagePath}${movie.backdrop_path}" alt="">
        </div>
        <div class="movie_infoBox">
            <p class="movie_title">${movie.title} (${ formatReleaseYear(movie.release_date) })</p>
            <div class="movie_actions">
                <div class="movie_actionBox">
                    <img src="assets/star-icon.svg">
                    <span id="movieRating">${movie.vote_average}</span>
                </div>
                <div class="movie_actionBox">
                    ${ isFavorite(movie) }
                </div>
            </div>
        </div>
        <div class="movie_description">
            <p>${ showDescription(movie.overview) }</p>
        </div>
    </div>
    `
}

// consume a api toda vez que a janela é carregada
window.addEventListener("load", getPopularMovies);