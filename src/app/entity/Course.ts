export class Course {
    id: string;
    name: string;
    major: string;
    description: string;
    creditPoints: number;
    language: string;
    university: string;
    tags: any[];


    constructor(id: string, name: string, major: string, description: string, creditPoints: number, language: string, university: string, tags: any[]) {
        this.id = id;
        this.name = name;
        this.major = major;
        this.description = description;
        this.creditPoints = creditPoints;
        this.language = language;
        this.university = university;
        this.tags = tags;
    }
}
