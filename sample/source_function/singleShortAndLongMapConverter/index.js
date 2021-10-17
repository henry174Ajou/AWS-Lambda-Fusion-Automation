exports.handler = async (event) => {
    const newList = [];
    for(let value of event.numberList){
        newList.push({
            number: value,
            sum: event.sum
        });
    }

    return newList;
}