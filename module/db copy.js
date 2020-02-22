//db库
const MongoClient=require('mongodb').MongoClient;
const Config=require('./config.js');

class DB {
    static getInstance(){
        if(!this.instance){
            this.instance=new DB();
        }
            return this.instance;
    }
    constructor(){
       this.instance=null;
       this.dbClient='';/*属性 放db对象*/
       this.connect();
    }
//连接数据库
    connect(){
   return new Promise((resolve,reject)=>{
       if(!this.dbClient){
        MongoClient.connect(Config.dbUrl,(err,client)=>{
            if(err){
             reject(err);
            }else{
                this.dbClient=client.db(Config.dbName);
               resolve(this.dbClient);
            }
          });
       }else{
           resolve(this.dbClient);
       }  
   }) 
    }

    find(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then(function(db){
                const result=db.collection(collectionName).find(json);
                result.toArray((err,docs)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                 resolve(docs);
                })
            })
       })
    }
}

let myDb=DB.getInstance();

myDb.find('todos',{}).then(function(data){
    console.log(data);
});