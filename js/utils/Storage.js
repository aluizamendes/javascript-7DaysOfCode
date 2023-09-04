export class Storage {
    static save(key, valor) {
        const valorString = JSON.stringify(valor);
        localStorage.setItem(key, valorString);
    }

    static getItems(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}