exports.handler = async (event) => {
    let p = new Promise(function(res){
        setTimeout(()=>{res()}, 50);
    })

    await p;

    return event;
}