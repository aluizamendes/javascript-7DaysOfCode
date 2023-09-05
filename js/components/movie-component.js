import { Formatter } from "../utils/Formatters.js";
import { Storage } from "../utils/Storage.js";
import { checkMovieIsFavorite } from "../utils/check-favorite.js";
import { favoriteMovieAction } from "./favorite-movie-component.js";

const movieListElement = document.getElementById("movieList");
const favoritedMovies =  Storage.getItems("favorites") || [];

class MovieList {
    constructor() {}

    static getFavoriteMovies() {
        return favoritedMovies;
    }

    static update(movies) {
        movies.forEach(movie => { this.renderMovies(movie) });        
        favoriteMovieAction(movies);
    }

    static renderMovies(movie) {
        const imagePath = "https://image.tmdb.org/t/p/w500/";
        const posterPath = movie.poster_path == null ? "assets/poster-not-found.png" : imagePath + movie.poster_path;
        const isFavorite = checkMovieIsFavorite(favoritedMovies, movie.id);
    
        const movieData = {
            movieID: movie.id,
            moviePoster: posterPath,
            movieTitle: movie.title,
            movieYear: Formatter.formatReleaseYear(movie.release_date),
            movieRating: movie.vote_average.toFixed(1),
            movieDescription: Formatter.formatDescription(movie.overview),
            heartIconState: isFavorite ? "assets/heart-fill-icon.svg" : "assets/heart-icon.svg",
            favoriteText: isFavorite ? "Desfavoritar" : "Favoritar"
        }
    
        movieListElement.innerHTML +=  `
        <div class="movie_item" data-id="${movieData.movieID}">
            <div class="movie_image">
                <img src="${movieData.moviePoster}" alt="Poster do filme ${movieData.movieTitle}">
            </div>
            <div class="movie_infoBox">
                <p class="movie_title">${movieData.movieTitle} (${movieData.movieYear})</p>
                <div class="movie_actions">
                    <div class="movie_actionBox">
                        <img src="assets/star-icon.svg">
                        <span id="movieRating">${movieData.movieRating}</span>
                    </div>
                    <div class="movie_actionBox" >
                        <button id="btnFavoritar" class="btn-favoritar">                        
                            <img id="heartIcon" src="${movieData.heartIconState}">
                            <span>${movieData.favoriteText}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="movie_description">
                <p>${movieData.movieDescription}</p>
            </div>
        </div>
        `
    }
}

export default MovieList;
