// "formatar" a visualização da data pra aparecer só o ano
export class Formatter {
    static formatReleaseYear(date) {
        let year = date.split("-")[0];
        return year;
    }

    // mostra descrição
    static formatDescription(description) {
        return description == "" ? "Sinopse não disponível." : description;
    }
}