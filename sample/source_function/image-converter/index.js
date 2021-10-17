exports.handler = async (event) => {
    return {
        list: [
            {
                data: event,
                path: 1
            },
            {
                data: event,
                path: 2
            }
        ]
    };
};
