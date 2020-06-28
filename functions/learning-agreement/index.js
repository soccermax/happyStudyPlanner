"use strict"

const { createFileAndSaveToDisk, createReadStream } = require("../util/pdfCreator");
const { readFile, createWriteStream } = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFileAsync = promisify(readFile);
const { getLearningAgreementById } = require("../util/retrieve");

const basicTemplatePath = path.resolve(__dirname, "template");

const templates = {
    learningAgreementApprovedDe: "learningAgreementApproved_de.html",
};

const generatePDFAndSaveToDisk = async (learningAgreementID, path) => {
    const learningAgreement = await getLearningAgreementById(learningAgreementID, true);
    const html = await readTemplate(templates.learningAgreementApprovedDe);
    const output = await createFileAndSaveToDisk({
        html,
        data: {
            ...learningAgreement
        },
        path
    });
    console.log(output);
}

const generatePDFSteam = async (learningAgreementID) => {
    try {
        const learningAgreement = await getLearningAgreementById(learningAgreementID, true);
        const html = await readTemplate(templates.learningAgreementApprovedDe);
        return await createReadStream({
            html,
            data: {
                ...learningAgreement
            },
        }, getPDFOptions());
    } catch(err) {
        console.error("Creating PDF failed!");
        console.error(err);
    }
}


const readTemplate = async (name) => {
    try {
        return await readFileAsync(path.resolve(basicTemplatePath, name), "utf8");
    } catch (err) {
        console.error("Couldn't read email template: %s", name);
        return null;
    }
};

const getPDFOptions = () => {
    return {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Max Green</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                // first: 'Cover page',
                // 2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                // last: 'Last Page'
            }
        }
    }
}

module.exports = {
    generatePDFAndSaveToDisk,
    generatePDFSteam
}