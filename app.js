const Koa=require("koa");
const Router=require("koa-router");
//const views=require("koa-views");
const Bodyparser=require('koa-bodyparser');
const common=require("./module/common.js");
const DB=require('./module/db.js');
//实例化koa
const app=new Koa();
const router=new Router();
//配置post提交数据的中间件
app.use(Bodyparser());
// //配置模板引擎 
// app.use(views('views',{
//     extension:'ejs'  
// }))
//db操作
router.get('/api/eventList',async ctx=>{
    console.log(ctx.query);
    let {status}=ctx.query;
 let result;
 if(status==='0'){
    result= await DB.find('todos',{});
}else if(status==='1'){
   result=await DB.find('todos',{done:false});
}else{
    result=await DB.find('todos',{done:true}); 
}
 let eventList;
 try{
eventList={
    success:true,
    msg:'获取事件列表成功',
    obj:result,
}
 }catch(err){
   console.log("err",err);
   eventList={
       success:false,
       msg:"获取事件列表出错",
       obj:{}
   }
 }
 ctx.body=eventList;
 console.log("eventList",eventList);
})


router.post('/api/deleteEvent',async ctx=>{
    let {index}=ctx.request.body;
    let data=await DB.remove('todos',{index});
    let datachange={};
    try{
        if(data.result.ok){
            datachange={
                success:true,
                msg:"删除事件成功",
            }
        }
    }catch(err){
        datachange={
            success:false,
            msg:err,
        }
    }
    ctx.body=datachange;
})

router.post('/api/addEvent',async ctx=>{
    let {index,name,done}=ctx.request.body;
    let data=await DB.insert('todos',ctx.request.body);
    let datachange={};
    try{
        if(data.result.ok){
            datachange={
                success:true,
                msg:"添加事件成功",
            }
        }
    }catch(err){
        datachange={
            success:false,
            msg:err,
        }
    }
    ctx.body=datachange;
})

router.post('/api/updateEvent',async ctx=>{
    let {index,name}=ctx.request.body;
    let data=await DB.update('todos',{index},{name});
    let datachange={};
    try{
        if(data.result.ok){
            datachange={
                success:true,
                msg:"修改事件成功",
            }
        }
    }catch(err){
        datachange={
            success:false,
            msg:err,
        }
    }
    ctx.body=datachange;
})

router.post('/api/clearCompleted',async ctx=>{
    let data=await DB.remove ('todos',{done:true});
    let datachange={};
    try{
        if(data.result.ok){
            datachange={
                success:true,
                msg:"清除已完成事件成功",
            }
        }
    }catch(err){
        datachange={
            success:false,
            msg:err,
        }
    }
    ctx.body=datachange;
})

router.post('/api/changeDoneStatus',async ctx=>{
    console.log(ctx.request.body);
    let {index,selected}=ctx.request.body;
    let data;
    if(selected===true){
    data=await DB.update('todos',{index},{done:true});
    }else{
    data=await DB.update('todos',{index},{done:false});
    }
    let datachange={};
    try{
        if(data.result.ok){
            datachange={
                success:true,
                msg:"改变事件状态成功",
            }
        }
    }catch(err){
        datachange={
            success:false,
            msg:err,
        }
    }
    ctx.body=datachange;
})

// router.get('/add',async ctx=>{
//    let result= await DB.insert('todos',{"index":2,"name":"晾晒","done":false});
//    console.log(result);
// })
// router.get('/edit',async ctx=>{
//     let result= await DB.update('todos',{"name":"晾晒"},{"name":"晾干"});
//     console.log(result);
//  })
// router.get('/delete',async ctx=>{
//     let id=ctx.query.id;
//     let result=await DB.remove('todos',{"name":"晾干"});
//     console.log(result);
// })


// router.post('/doEdit',async ctx=>{
//     let index=request.body.index;
//     let name=request.body.name;
//     let done=request.body.done;
//     let data=await DB.update('todos',{"index":index},{
//         name,
//         done, 
//     })
//     console.log(data);
//     try{
//         if(data.result.ok){
//             ctx.redirect('/')
//         }
//     }catch(err){
//         console.log(err);
//         return;
//         ctx.redirect("/add");
//     }
// })
// //通过bodyparser获取提交数据
// router.post('/doAdd',async ctx=>{
//     let result=await DB.insert('todos',ctx.request.body);
//     try{
//       if(data.result.ok){
//           ctx.body={};
//       }
//     }catch(err){
//        console.log(err);
//        return;
//     }
//  })
// //动态路由
router.get('/newscontent/:aid',async (ctx)=>{

    console.log(ctx.params);
    ctx.body="新闻详情";
})

// //接收post提交的数据
// router.post('/doAdd',async (ctx)=>{
//     //获取表单提交的数据
//   const data=await common.getPostData(ctx);
//   console.log(data);
//   ctx.body=data;
// })
//配置路由
app.use(router.routes()).use(router.allowedMethods());

const port=process.env.PORT||5000;

app.listen(port,()=>{
    console.log(`server started on ${port}`);
})