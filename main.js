const movies = [
    { 
        cover: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/i9XdxHsFrcqLkRWSF1coOHo4R39.jpg",
        title: "Super Mario Bros.: O Filme",
        rating: 9.8,
        year: 2023,
        description: "Mario é um encanador junto com seu irmão Luigi. Um dia, eles vão parar no reino dos cogumelos, governado pela Princesa Peach, mas ameaçado pelo rei dos Koopas, que faz de tudo para conseguir reinar em todos os lugares.",
        isFavorite: true
    },
    { 
        cover: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/nnryxxmgS17IBKvu23Hpg1mimZU.jpg",
        title: "Renfield - Dando Sangue pelo Chefe",
        rating: 8.8,
        year: 2023,
        description: "Renfield, o sofrido ajudante do chefe mais narcisista da história, Drácula, é forçado a encontrar as vítimas para seu mestre e fazer tudo o que ele lhe pede, qualquer que seja o grau de degradação da ordem recebida. Mas agora, depois de séculos de servidão, Renfield está pronto para descobrir se há vida lá fora, para além da sombra do Príncipe das Trevas. Se pelo menos ele puder descobrir como dar fim à sua dependência dele.",
        isFavorite: true
    },
    { 
        cover: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/bS6g13i3LByRPDcuA7rwGIqSoKT.jpg",
        title: "Três Homens em Conflito",
        rating: 10,
        year: 1966,
        description: "Durante o auge da Guerra Civil, um misterioso pistoleiro vaga pela fronteira do oeste. Ele não possui um lar, lealdade ou companhia... Até que encontra dois estrangeiros, que são tão brutos e desapegados quanto ele. Unidos pelo destino, os três homens juntam suas forças para tentar encontrar uma fortuna em ouro roubado. Mas trabalho em equipe não é uma coisa natural para voluntariosos pistoleiros, e eles logo descobrem que seu maior desafio é concentrar-se em sua perigosa missão — e em manterem-se vivos — atravessando um país arrasado pela guerra.",
        isFavorite: false
    },
    { 
        cover: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg",
        title: "Clube da Luta",
        rating: 10,
        year: 1999,
        description: "Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes chamado Tyler Durden. Eles formam um clube clandestino com regras rígidas onde lutam com outros homens cansados de suas vidas mundanas. Mas sua parceria perfeita é comprometida quando Marla chama a atenção de Tyler.",
        isFavorite: true
    }
];

const movieList = document.getElementById("movieList");

function isFavorite(movie) {
    if (movie.isFavorite) {
        return `
        <img src="assets/heart-fill-icon.svg">
        <span>Desfavoritar</span>
        `
    } else {
        return `
        <img src="assets/heart-icon.svg">
        <span>Favoritar</span>
        `
    }
}

function renderMovies(movie) {
    movieList.innerHTML +=  `
    <div class="movie_item">
        <div class="movie_image">
            <img src="${movie.cover}" alt="">
        </div>
        <div class="movie_infoBox">
            <p class="movie_title">${movie.title} (${movie.year})</p>
            <div class="movie_actions">
                <div class="movie_actionBox">
                    <img src="assets/star-icon.svg">
                    <span id="movieRating">${movie.rating}</span>
                </div>
                <div class="movie_actionBox">
                    ${ isFavorite(movie) }
                </div>
            </div>
        </div>
        <div class="movie_description">
            <p>${movie.description}</p>
        </div>
    </div>
    `
}

movies.forEach((movie) => {
    renderMovies(movie);
})