import { getPopularMoviesAPI } from "./utils/apiFunctions.js";
import MovieList from "./components/movie-component.js";
import { Storage } from "./utils/Storage.js";
import "./components/movie-component.js"
import "./components/search-bar-component.js"

window.addEventListener("load", async () => {
    // consume a api quando a janela é carregada
    const popularMovies = await getPopularMoviesAPI();

    // salva a lista de filmes da resposta da api no cache e mostra na tela
    Storage.save("popularMovies", popularMovies);

    // atualiza lista dos populares
    const movies = Storage.getItems("popularMovies");
    MovieList.update(movies);
});