exports.handler = async (event) => {
    return {number: event.number * 2};
}