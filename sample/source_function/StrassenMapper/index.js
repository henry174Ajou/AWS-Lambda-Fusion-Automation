'use strict'

//code from https://github.com/Open-SL/Matrix_Strassen_Multiplier/blob/master/index.js

exports.handler = async (event) => {
    const p = getP(event, event.pId);

    const resultObject = {};
    resultObject[`p${event.pId}`] = p;

    return resultObject
};

function strassen(A,B){
    var n = A.length;

    var C = [];
    declareMatrix(C,n);

    if (n%2 != 0 && n !=1){

        var a1 = [];
        var b1 = [];
        var c1 = [];
        var n_new = n+1;

        declareMatrix(a1,n_new);
        declareMatrix(b1,n_new);
        declareMatrix(c1,n_new);

        for(var i=0; i<n; i++)
            for(var j=0; j<n; j++)
            {
                a1[i][j] =A[i][j];
                b1[i][j] =B[i][j];
            }

        c1 = strassen(a1, b1);
        for(var i=0; i<n; i++)
            for(var j=0; j<n; j++)
                C[i][j] =c1[i][j];
        return C;
    }
    if (n == 1){
        C[0][0] = A[0][0]*B[0][0];

    }
    else{

        var A11,A12,A22,A21,B11,B12,B22,B21 = [];

        A11 = matrix_map(A,0,0,n/2);
        A12 = matrix_map(A,n/2,0,n/2);
        A21 = matrix_map(A,0,n/2,n/2);
        A22 = matrix_map(A,n/2,n/2,n/2);

        B11 = matrix_map(B,0,0,n/2);
        B12 = matrix_map(B,n/2,0,n/2);
        B21 = matrix_map(B,0,n/2,n/2);
        B22 = matrix_map(B,n/2,n/2,n/2);

        var P1 = strassen(matrix_add(A11, A22), matrix_add(B11, B22));
        var P2 = strassen(matrix_add(A21, A22), B11);
        var P3 = strassen(A11, matrix_sub(B12, B22));
        var P4 = strassen(A22, matrix_sub(B21, B11));
        var P5 = strassen(matrix_add(A11, A12), B22);
        var P6 = strassen(matrix_sub(A21, A11), matrix_add(B11, B12));
        var P7 = strassen(matrix_sub(A12, A22), matrix_add(B21, B22));

        var C11 = matrix_add(matrix_sub(matrix_add(P1, P4), P5), P7);
        var C12 = matrix_add(P3, P5);
        var C21 = matrix_add(P2, P4);
        var C22 = matrix_add(matrix_sub(matrix_add(P1, P3), P2), P6);

        reduce(C,C11,0,0);
        reduce(C,C12,n/2,0);
        reduce(C,C21,0,n/2);
        reduce(C,C22,n/2,n/2);
    }

    return C;

}

function declareMatrix(matrix,n){

    for(var x = 0; x < n; x++){
        matrix[x] = [];
        for(var y = 0; y < n; y++){
            matrix[x][y] = 0;
        }
    }
}

function matrix_map(parent,startX,startY,n){
    var child = [];
    for(var i=0,i2 = startX; i < n; i++,i2++){
        var array1 = []
        for (var j=0,j2=startY; j < n; j++,j2++){
            array1.push(parent[i2][j2]);

        }
        child.push(array1);
    }

    return child;
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

function getP(subMatrices, pId){
    let p = null;

    switch (pId){
        case 1:
            p = strassen(matrix_add(subMatrices.A11, subMatrices.A22), matrix_add(subMatrices.B11, subMatrices.B22));
            break;
        case 2:
            p = strassen(matrix_add(subMatrices.A21, subMatrices.A22), subMatrices.B11);
            break;
        case 3:
            p = strassen(subMatrices.A11, matrix_sub(subMatrices.B12, subMatrices.B22));
            break;
        case 4:
            p = strassen(subMatrices.A22, matrix_sub(subMatrices.B21, subMatrices.B11));
            break;
        case 5:
            p = strassen(matrix_add(subMatrices.A11, subMatrices.A12), subMatrices.B22);
            break;
        case 6:
            p = strassen(matrix_sub(subMatrices.A21, subMatrices.A11), matrix_add(subMatrices.B11, subMatrices.B12));
            break;
        case 7:
            p = strassen(matrix_sub(subMatrices.A12, subMatrices.A22), matrix_add(subMatrices.B21, subMatrices.B22));
            break;
    }

    if(p === null){
        throw new Error("p is null. It may be because the pId is wrong. The current pId is " + pId);
    }

    return p;
}