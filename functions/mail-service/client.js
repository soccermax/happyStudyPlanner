"use strict"

const admin = require("firebase-admin");
const { readFile } = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFileAsync = promisify(readFile);

const basicTemplatePath = path.resolve(__dirname, "template");

const templates = {
    learningAgreementApprovedDe: "learningAgreementApproved_de.xhtml"
}

const normalVariableReplacer = (text, replacerMap) =>
    text.replace(/{{(.+?)}}/g, (match, varName) => {
        const value = replacerMap[varName];
        return value === null ? "" : value;
    });

const readTemplate = async (name) => {
    try {
        return await readFileAsync(path.resolve(basicTemplatePath, name));
    } catch (err) {
        console.error("Couldn't read email template: %s", name);
        return null;
    }
}

const sendLearningAgreementApproved = async (receiver, parameterMap) => {
    const body = normalVariableReplacer((await readTemplate(templates.learningAgreementApprovedDe)).toString(), parameterMap);
    if (body !== null) {
        return _queueEmail({
            to: receiver,
            subject: "Dein Learning Agreement wurde genehmigt",
            html: body
        });
    }
}


const _queueEmail = async (emailPayload) => {
    try {
        await admin
            .firestore()
            .collection("mail")
            .add({
                to: [emailPayload.to],
                message: {
                    subject: emailPayload.subject,
                    html: emailPayload.html,
                },
            });
        console.log("Email queued");
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    sendLearningAgreementApproved
}