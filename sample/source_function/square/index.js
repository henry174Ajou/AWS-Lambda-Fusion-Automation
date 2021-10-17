exports.handler = async (event) => {
    return {number: event.number * event.number};
}