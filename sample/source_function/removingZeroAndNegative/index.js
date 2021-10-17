exports.handler = async (event) => {
    const newNumberList = [];
    for(let value of event.numberList){
        if(value > 0){
            newNumberList.push(value);
        }
    }

    return {
        numberList: newNumberList
    };
}

