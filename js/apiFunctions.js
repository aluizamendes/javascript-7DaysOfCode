import { apiKey } from "./apiKey.js";

async function getPopularMoviesAPI() {
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

async function getSearchedMovieAPI(movieName) {
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

export { getPopularMoviesAPI, getSearchedMovieAPI };