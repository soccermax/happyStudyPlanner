export class User {
    email: string;
    name: string;
    preName: string;
    major: string;
    gender: string;
    role: string;
    studentId: string;
    university: string;


    constructor(email: string, name: string, preName: string, major: string, gender: string, role: string, studentId: string, university: string) {
        this.email = email;
        this.name = name;
        this.preName = preName;
        this.major = major;
        this.gender = gender;
        this.role = role;
        this.studentId = studentId;
        this.university = university;
    }
}
