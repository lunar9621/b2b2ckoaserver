const MongoClient=require('mongodb').MongoClient;
const dbUrl='mongodb://127.0.0.1:27017';
const dbName='koaTodos';
//连接数据库
MongoClient.connect(dbUrl,function(err,client){
    if(err){
        console.log(err);
        return;
    }
    var db=client.db(dbName);
    //增加数据
    // db.collection('todos').insertOne({'index':1,'name':'烘干','done':false},function(err,result){
    //     if(!err){
    //        console.log('增加数据成功');
    //        client.close();
    //     }
    // })
    //查询数据
    var result=db.collection('todos').find({});
    result.toArray((err,docs)=>{
        console.log(docs);
    })
})