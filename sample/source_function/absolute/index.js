exports.handler = async (event) => {
    if(event.number < 0){
        return {number: -event.number};
    }
    else {
        return {number: event.number};
    }
}