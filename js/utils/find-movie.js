export function findMovieIndex(movies, movieName) {
    return movies.findIndex(movie => movie.title == movieName);
}