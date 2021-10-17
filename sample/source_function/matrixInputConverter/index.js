exports.handler = async (event) => {
    const list = event.list;

    if(list[0].matrixA === undefined){
        return {
            matrixA: list[1].matrixA,
            matrixB: list[0].matrixB
        }
    }
    else {
        return {
            matrixA: list[0].matrixA,
            matrixB: list[1].matrixB
        }
    }
}