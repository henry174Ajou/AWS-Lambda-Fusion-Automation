const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    const matrix = event.matrix;

    console.log(JSON.stringify(matrix));

    return event;
}