const path = require("path");
const fs = require("fs");

exports.handler = async (event) => {
    const name = event.name;
    const size = event.size;

    const data = fs.readFileSync(path.join(__dirname, `size${size}.json`), "utf8");

    const resultObject = {};

    resultObject[name] = JSON.parse(data);

    return resultObject;
}