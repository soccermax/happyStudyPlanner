export class LearningAgreement {
    approved: boolean;
    lastEvaluatedOn: any;
    lastModifiedOn: any;
    responsible: string;
    score: number;
    student: string;
    targetUniversity: string;
    courses: any[];


    constructor(approved: boolean, lastEvaluatedOn: any, lastModifiedOn: any, responsible: string, score: number, student: string,
                targetUniversity: string, courses: any[]) {
        this.approved = approved;
        this.lastEvaluatedOn = lastEvaluatedOn;
        this.lastModifiedOn = lastModifiedOn;
        this.responsible = responsible;
        this.score = score;
        this.student = student;
        this.targetUniversity = targetUniversity;
        this.courses = courses;
    }
}
