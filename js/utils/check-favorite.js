export function checkMovieIsFavorite(arr, id) {
    return arr.find(movie => movie.id === id);
}