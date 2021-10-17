exports.handler = async (event) => {
    return {
        result: event.numerator / event.denominator
    }
}