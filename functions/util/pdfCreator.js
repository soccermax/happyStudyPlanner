"use strict"

const handlebars = require("handlebars");
const pdf = require("html-pdf");

const createFileAndSaveToDisk = (document, options) =>
  new Promise((resolve, reject) => {
    if (!document || !document.html || !document.data) {
      reject(new Error("Some, or all, options are missing."));
    }
    const html = handlebars.compile(document.html)(document.data);
    pdf.create(html, options).toFile(document.path, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });

const createReadStream = (document, options) =>
  new Promise((resolve, reject) => {
    if (!document || !document.html || !document.data) {
      reject(new Error("Some, or all, options are missing."));
    }
    const html = handlebars.compile(document.html)(document.data);
    pdf.create(html, options).toStream((err, stream) => {
      if (err) {
        reject(err);
      }
      resolve(stream);
    });
  });

module.exports = {
  createFileAndSaveToDisk,
  createReadStream,
};
