exports.handler = async (event) => {
    let p = new Promise(function(res){
        setTimeout(()=>{res()}, 500);
    })

    await p;

    return event;
}
