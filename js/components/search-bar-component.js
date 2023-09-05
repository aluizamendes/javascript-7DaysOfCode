import { Storage } from "../utils/Storage.js";
import { getSearchedMovieAPI } from "../utils/apiFunctions.js";
import { cleanMovieList } from "../utils/clean-movie-list.js";
import MovieList from "./movie-component.js";

const searchInput = document.getElementById("pesquisar");
const searchBtn = document.getElementById("searchBtn");
const checkboxShowFavoritesElement = document.getElementById("mostrarFavoritos");

// pesquisar e exibir filmes
async function showSearchedMovies() {
    const searchedMovies = await getSearchedMovieAPI(searchInput.value);
    cleanMovieList();
    MovieList.update(searchedMovies);
}

async function handleSearch(event) {
    const eventType = event.type;

    if (eventType == "click") {
        await showSearchedMovies();

        checkboxShowFavoritesElement.checked = false;
    }

    else if (eventType == "keyup") {
        if (event.key == "Enter") {
            await showSearchedMovies();

            checkboxShowFavoritesElement.checked = false;
        }
    }

    if (searchInput.value == "") {
        cleanMovieList();
        const popularMovies = Storage.getItems("popularMovies");
        MovieList.update(popularMovies);

        checkboxShowFavoritesElement.checked = false;
    }

    // o `checkboxShowFavorites.checked = false` certifica de que a lista agora apresentada não é mais dos filmes favoritos, o desmarcando
}

// se o usuário clicar no botão da lupa ou apertar enter no input, fazer pesquisa de filmes
searchInput.addEventListener("keyup", handleSearch);
searchBtn.addEventListener("click", handleSearch);
