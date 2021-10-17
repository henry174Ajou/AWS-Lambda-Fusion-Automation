exports.handler = async (event) => {
    let p = new Promise(function(res){
        setTimeout(()=>{res()}, 4000);
    })

    await p;

    return event;
}
