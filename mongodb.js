const MongoClient=require('mongodb').MongoClient;
const dbUrl='mongodb://127.0.0.1:27017';
const dbName='B2B2C';
//连接数据库
MongoClient.connect(dbUrl,function(err,client){
    if(err){
        console.log(err);
        return;
    }
    var db=client.db(dbName);
    //查询数据
    var result=db.collection('B2B2C').find({});
    result.toArray((err,docs)=>{
        console.log(docs);
    })
})