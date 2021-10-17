exports.handler = async (event) => {
    return distribute(event.matrixA, event.matrixB);
}

function distribute(A, B){
    const n = A.length;

    let A11,A12,A22,A21,B11,B12,B22,B21 = [];

    A11 = matrix_map(A,0,0,n/2);
    A12 = matrix_map(A,n/2,0,n/2);
    A21 = matrix_map(A,0,n/2,n/2);
    A22 = matrix_map(A,n/2,n/2,n/2);

    B11 = matrix_map(B,0,0,n/2);
    B12 = matrix_map(B,n/2,0,n/2);
    B21 = matrix_map(B,0,n/2,n/2);
    B22 = matrix_map(B,n/2,n/2,n/2);

    const resultObject = {
        list: []
    }
    for(let p = 1; p <= 7; p++){
        let ob = null;
        switch (p){
            case 1:
                ob = {
                    A11, A22, B11, B22,
                    pId: p
                }
                break;
            case 2:
                ob = {
                    A21, A22, B11,
                    pId: p
                }
                break;
            case 3:
                ob = {
                    A11, B12, B22,
                    pId: p
                }
                break;
            case 4:
                ob = {
                    A22, B21, B11,
                    pId: p
                }
                break;
            case 5:
                ob = {
                    A11, A12, B22,
                    pId: p
                }
                break;
            case 6:
                ob = {
                    A21, A11, B11, B12,
                    pId: p
                }
                break;
            case 7:
                ob = {
                    A12, A22, B21, B22,
                    pId: p
                }
                break;
        }
        resultObject.list.push(ob);
    }

    return resultObject;
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
