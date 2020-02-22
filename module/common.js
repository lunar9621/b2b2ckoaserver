//原生nodejs获取表单提交数据方法
exports.getPostData=function(ctx){
    return new Promise(function(resolve,reject){
        try{
          let str='';
          ctx.req.on('data',function(chunk){
              str+=chunk;
          })

          ctx.req.on('end',function(chunk){
              resolve(str);
          })
        }catch(err){
         reject(err)
        }
    })
}