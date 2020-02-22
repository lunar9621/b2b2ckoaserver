async function getData(){
    return "这是一个数据"
}

async function test(){
    var d=await getData();
    console.log(d);
}

test();