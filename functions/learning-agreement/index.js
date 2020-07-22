"use strict";

const { createFileAndSaveToDisk, createReadStream } = require("../util/pdfCreator");
const { readFile } = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFileAsync = promisify(readFile);
const { getLearningAgreementById } = require("../util/retrieve");

const basicTemplatePath = path.resolve(__dirname, "template");
const basicTemplatePathImage = path.resolve(__dirname, "template", "HsKaLogo.png");
const imgSrc = path.normalize(`file://${basicTemplatePathImage}`);

const templates = {
  learningAgreementApprovedDe: "learningAgreementApproved_de.html",
};

const generatePDFAndSaveToDisk = async (learningAgreementID, path) => {
  try {
    const learningAgreement = await getLearningAgreementById(learningAgreementID, true);
    const html = await readTemplate(templates.learningAgreementApprovedDe);
    return await createFileAndSaveToDisk({
      html,
      data: {
        ...learningAgreement,
      },
      path,
    });
  } catch (err) {
    console.error("Creating PDF failed!");
    console.error(err);
    return Promise.reject(err);
  }
};

const generatePDFSteam = async (learningAgreementID) => {
  try {
    const learningAgreement = await getLearningAgreementById(learningAgreementID, true);
    const html = await readTemplate(templates.learningAgreementApprovedDe);
    return await createReadStream(
      {
        html,
        data: {
          ...learningAgreement,
          imgSrc,
        },
      },
      getPDFOptions()
    );
  } catch (err) {
    console.error("Creating PDF failed!");
    console.error(err);
    return Promise.reject(err);
  }
};

const readTemplate = async (name) => {
  try {
    return await readFileAsync(path.resolve(basicTemplatePath, name), "utf8");
  } catch (err) {
    console.error("Couldn't read email template: %s", name);
    return Promise.reject(err);
  }
};

const getPDFOptions = () => {
  return {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    footer: {
      height: "28mm",
      contents: {
        // first: 'Cover page',
        // 2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        // last: 'Last Page'
      },
    },
  };
};

module.exports = {
  generatePDFAndSaveToDisk,
  generatePDFSteam,
};
