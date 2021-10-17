exports.handler = async (event) => {
    let sum = 0;
    for(let value of event.numberList){
        sum += value;
    }
    return {
        sum: sum
    };
}