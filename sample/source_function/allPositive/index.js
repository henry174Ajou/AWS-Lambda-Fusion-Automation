exports.handler = async (event) => {
    for(let v of event.numberList){
        if(v <= 0){
            return {result: false};
        }
    }

    return {result: true};
}