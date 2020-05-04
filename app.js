const Koa = require("koa");
const Router = require("koa-router");
//const views=require("koa-views");
const Bodyparser = require('koa-bodyparser');
const common = require("./module/common.js");
const DB = require('./module/db.js');
//实例化koa
const app = new Koa();
const router = new Router();
//配置post提交数据的中间件
app.use(Bodyparser());

//db操作
router.get('/apikoa/routes', async ctx => {
    let result,body=[];
   result=await DB.find('MenuConf',{});
   console.log("result",result);
   for(let item in result){
  body.push({
    fatherNode:result[item].fatherNode,
    name:result[item].moduleName,
    dataSource:result[item].dataSource,
    path:result[item].path,
    component:result[item].templateModule=="CoopManage"?"./CoopManage/CoopList":"./CheckManage/CheckList"
  })
   }
    ctx.body={
       routes:body};
})

//列表页配置
router.get('/apikoa/listMake/queryListSetting', async ctx => {
    console.log("queryListSettingquery",ctx.query);
    let {moduleID}=ctx.query;
    let tmpid=parseInt(moduleID);
 let result;
 result=await DB.find('ListSetting',{moduleID:tmpid});
 ctx.body={
     success:true,
     msg:"获取配置成功",
     obj:result[0],
 };
})



router.post('/apikoa/listMake/saveListSetting', async ctx => {
    console.log("savelistsettingbody",ctx.request.body);
    let { moduleID } = ctx.request.body;
    let updateData={
        ...ctx.request.body,
        timestamp:new Date()};
    let data = await DB.update('ListSetting', { moduleID },updateData);
    let datachange = {};
    try {
        if (data.result.ok) {
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        datachange = {
            success: false,
            msg: err,
        }
    }
    ctx.body = datachange;
})





app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})