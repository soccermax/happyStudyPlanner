export class University {
    id: string;
    country: string;
    language: string;
    name: string;


    constructor(id: string, country: string, language: string, name: string) {
        this.id = id;
        this.country = country;
        this.language = language;
        this.name = name;
    }
}
