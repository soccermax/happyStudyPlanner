"use strict";

const { firestore } = require("firebase-admin");
const { readFile } = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFileAsync = promisify(readFile);

const basicTemplatePath = path.resolve(__dirname, "template");

const templates = {
  learningAgreementApprovedDe: "learningAgreementApproved_de.html",
};

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
    return Promise.reject(err);
  }
};

const sendLearningAgreementApproved = async (receiver, parameterMap, metadata) => {
  const body = normalVariableReplacer(
    (await readTemplate(templates.learningAgreementApprovedDe)).toString(),
    parameterMap
  );
  return body !== null
    ? _queueEmail(
        {
          to: receiver,
          subject: "Dein Learning Agreement wurde genehmigt",
          html: body,
        },
        metadata
      )
    : Promise.resolve();
};

const _queueEmail = async (emailPayload, metadata) => {
  metadata.createdOn = firestore.FieldValue.serverTimestamp();
  try {
    return await firestore()
      .collection("mail")
      .add({
        to: [emailPayload.to],
        message: {
          subject: emailPayload.subject,
          html: emailPayload.html,
        },
        ...metadata,
      });
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

module.exports = {
  sendLearningAgreementApproved,
};
