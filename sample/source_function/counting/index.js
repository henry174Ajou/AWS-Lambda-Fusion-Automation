exports.handler = async (event) => {
    return {
        count: event.list.length
    }
}
