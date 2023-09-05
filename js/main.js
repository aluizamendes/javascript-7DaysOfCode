import { getPopularMoviesAPI, getSearchedMovieAPI } from "./apiFunctions.js";
import { favoriteMovieAction } from "./components/favorite-movie-component.js";
import { Storage } from "./utils/Storage.js";

const searchInput = document.getElementById("pesquisar");
const checkboxShowFavorites = document.getElementById("mostrarFavoritos");
const searchBtn = document.getElementById("searchBtn");

const favoritedMovies =  Storage.getItems("favoritos") || [];


// pesquisar e exibir filmes
async function showSearchedMovies() {
    const searchedMovies = await getSearchedMovieAPI(searchInput.value);
    cleanMovieList();
    updateMovieList(searchedMovies);  
}

async function handleSearch(event) {
    const eventType = event.type;

    if (eventType == "click") {
        await showSearchedMovies();

        checkboxShowFavorites.checked = false;
    }

    else if (eventType == "keyup") {

        if (event.key == "Enter") {
            await showSearchedMovies();

            checkboxShowFavorites.checked = false;
        }
    }

    if (searchInput.value == "") {
        cleanMovieList();
        showPopularMovies();

        checkboxShowFavorites.checked = false;
    }

    // o `checkboxShowFavorites.checked = false` certifica de que a lista agora apresentada não é mais dos filmes favoritos, o desmarcando

}

// se o usuário clicar no botão da lupa ou apertar enter no input, fazer pesquisa de filmes
searchInput.addEventListener("keyup", handleSearch);
searchBtn.addEventListener("click", handleSearch);


