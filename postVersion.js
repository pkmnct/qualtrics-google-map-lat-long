// This script ensures that the Readme includes the up-to-date script src

/* eslint-disable */
const fs = require("fs");

const filename = "README.md";
const version = process.argv[2];
const regex = /qualtrics-google-map-lat-long@(.*)\/dist/g;
const replace = `qualtrics-google-map-lat-long@${version}/dist`;

if (process.argv.length !== 3) {
  return console.error("Invalid Arguments");
}

fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    return console.error(err);
  }
  const result = data.replace(regex, replace);

  fs.writeFile(filename, result, "utf8", (err) => {
    if (err) {
      return console.error(err);
    }
  });
});
