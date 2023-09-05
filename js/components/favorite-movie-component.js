import { getSearchedMovieAPI } from "../apiFunctions.js";
import { Storage } from "../utils/Storage.js";
import { cleanMovieList } from "../utils/clean-movie-list.js";
import movieList from "./movie-component.js";

// implementa sistema de favoritar um filme, adiciona e remove filmes do local storage
function handleShowFavoriteMovies(event) {
    const isChecked = event.target.checked;

    if (isChecked) { 
        cleanMovieList();  
        // updateMovieList(favoritedMovies);       
        movieList.update(favoritedMovies);

    } else {
        cleanMovieList();
        // showPopularMovies();
        const popularMovies = Storage.getItems("popularMovies");
        movieList.update(popularMovies);
    }
}

export function favoriteMovieAction(arrMovies) {
    const btnFavoritar = document.querySelectorAll("#btnFavoritar");
        
    btnFavoritar.forEach((btn) => {
        btn.addEventListener("click", (event) => {

            // define variáveis dos itens
            const buttonEl = event.target.id == "btnFavoritar" ? event.target : event.target.parentElement;
            const heartIcon = btn.querySelector("img");            
            const favoritarText = heartIcon.nextElementSibling;
            let movieNameText = buttonEl.closest('.movie_infoBox').firstElementChild.textContent;

            const favoriteState = {
                favorited: "assets/heart-fill-icon.svg",
                notFavorited: "assets/heart-icon.svg"
            }

            // array da string do nome e retirar o ano (ultimo elemento)
            let movieNameSplit = movieNameText.split(" ");
            movieNameSplit.pop();
            movieNameText = movieNameSplit.join(" ");

            // corresponde ao index do filme clicado
            const index = findMovieIndex(arrMovies, movieNameText); 
            const movieSelected = arrMovies[index];

            // checa se o filme esta na lista dos favoritos
            const isFavorite = checkMovieIsFavorite(movieSelected.id);           

            // se estiver nos favoritos remove, se não, adiciona
            if (isFavorite) {

                // definir a div do filme correspondente atraves do id
                const movieItem = document.querySelector(`[data-id="${movieSelected.id}"]`);

                heartIcon.src = favoriteState.notFavorited;
                favoritarText.textContent = "Favoritar";

                // se usuário estiver na lista de favoritos, remove div do filme
                const isShowingFavorites = checkboxShowFavorites.checked;
                if (isShowingFavorites) movieItem.remove();

                // achar o index dentro da lista de favoritos correspondente ao titulo do filme
                const indexMovieRemove = findMovieIndex(favoritedMovies, movieNameText); 
                
                // deleta do array e do local storage
                favoritedMovies.splice(indexMovieRemove, 1);
                Storage.save("favorites", favoritedMovies);

            } else {
                heartIcon.src = favoriteState.favorited;
                favoritarText.textContent = "Desfavoritar";
    
                // adiciona o filme correspondente na lista de favoritos
                favoritedMovies.push(movieSelected);
                Storage.save("favorites", favoritedMovies);
            }
        })
    });
}

checkboxShowFavorites.addEventListener("click", handleShowFavoriteMovies);