import { apiKey } from "./apiKey.js";

const movieList = document.getElementById("movieList");
const inputPesquisar = document.getElementById("pesquisar");

async function getPopularMovies() {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    
    try {
        let request =  await fetch(url);

        // desestruturação de array
        let { results } = await request.json();
        return results;
    }

    catch(error) {
        console.log(error);
    }
}

async function getSearchedMovie(movieName) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${movieName}&page=1&include_adult=false`;

    try {
        let request = await fetch(url);
        let { results } = await request.json();
        return results;
    }

    catch(error) {
        console.error(`Erro ao carregar recursos: ${error}`);
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

async function showPopularMovies() {    
    const movies = await getPopularMovies();
    movies.forEach(movie => renderMovies(movie));
}

function renderMovies(movie) {
    let imagePath = "https://image.tmdb.org/t/p/w500/";

    movieList.innerHTML +=  `
    <div class="movie_item">
        <div class="movie_image">
            <img src="${imagePath}${movie.poster_path}" alt="">
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
window.addEventListener("load", async () => {
    await showPopularMovies();
});

// pesquisar e exibir filme
// se o  input estiver vazio e o user der `enter` ou `focusout` volta a mostrar os filmes populares

inputPesquisar.addEventListener("keyup", async (evt) => { 

    if (evt.key == "Enter") {
        let searchedMovies = await getSearchedMovie(inputPesquisar.value);

        movieList.innerHTML = "";
        searchedMovies.forEach(movie => renderMovies(movie));

        if (inputPesquisar.value == "") {
            movieList.innerHTML = "";
            await showPopularMovies();
        }
    } 
})

inputPesquisar.addEventListener("focusout", async () => {
    
    if (inputPesquisar.value == "") {
        movieList.innerHTML = "";
        await showPopularMovies();  
    }
})
