'use strict'

//code from https://github.com/Open-SL/Matrix_Strassen_Multiplier/blob/master/index.js

exports.handler = async (event) => {
    const pList = {};
    for(let o of event.list){
        for(let i = 1; i <= 7; i++){
            if(o[`p${i}`] !== undefined){
                pList[`p${i}`] = o[`p${i}`];
                break;
            }
        }
    }

    const result = collect(pList.p1, pList.p2, pList.p3, pList.p4, pList.p5, pList.p6, pList.p7);

    return {
        result: result
    }
};

function declareMatrix(matrix,n){

    for(var x = 0; x < n; x++){
        matrix[x] = [];
        for(var y = 0; y < n; y++){
            matrix[x][y] = 0;
        }
    }
}

function matrix_add(matrixA,matrixB){

    var matrixC = [];

    for (var i = 0; i < matrixA.length;i++){
        var array1 = [];
        for(var j = 0; j < matrixA[0].length; j++){
            array1.push(matrixA[i][j] + matrixB[i][j]);
        }
        matrixC.push(array1);
    }

    return matrixC;
}

function matrix_sub(matrixA,matrixB){

    var matrixC = [];

    for (var i = 0; i < matrixA.length;i++){
        var array1 = [];
        for(var j = 0; j < matrixA[0].length; j++){
            array1.push(matrixA[i][j] - matrixB[i][j]);
        }
        matrixC.push(array1);
    }

    return matrixC;
}

function reduce(parent, child, startX, startY){

    for(var i=0,i2 = startX; i < child.length; i++,i2++){
        var array1 = []
        for (var j=0,j2=startY; j < child.length; j++,j2++){
            parent[i2][j2] = child[i][j];
        }
    }
}

function collect(p1, p2, p3, p4, p5, p6, p7){
    var C = [];
    const n = p1.length * 2;
    declareMatrix(C,n);

    var C11 = matrix_add(matrix_sub(matrix_add(p1, p4), p5), p7);
    var C12 = matrix_add(p3, p5);
    var C21 = matrix_add(p2, p4);
    var C22 = matrix_add(matrix_sub(matrix_add(p1, p3), p2), p6);

    reduce(C,C11,0,0);
    reduce(C,C12,n/2,0);
    reduce(C,C21,0,n/2);
    reduce(C,C22,n/2,n/2);

    return C;
}