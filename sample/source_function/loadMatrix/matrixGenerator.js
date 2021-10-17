const rootPath = __dirname;
const fs = require("fs");
const path = require("path");

const sizeList = [8, 16, 32, 64, 128, 256];

for(let size of sizeList){
    const matrix = [];

    for(let i = 0; i < size; i++){
        const temp = [];
        for(let j = 0; j < size; j++){
            temp.push(1);
        }
        matrix.push(temp);
    }

    fs.writeFileSync(path.join(rootPath, `size${size}.json`), JSON.stringify(matrix), "utf8");
    console.log(`size ${size} done`);
}

console.log("all done");
