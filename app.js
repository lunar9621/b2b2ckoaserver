const moment =require('moment');
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
    console.log("apikoaroutes");
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

//菜单配置保存
router.post('/apikoa/saveMenuData', async ctx => {
    console.log("saveMenuData",ctx.request.body);
    let data = await DB.insert('MenuConf', ctx.request.body);
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
//查询新建按钮下拉菜单菜单项
router.get('/apikoa/listMake/queryListNewMenu', async ctx => {
    console.log("queryListSettingquery",ctx.query);
    let {moduleID}=ctx.query;
    let tmpid=parseInt(moduleID);
    let result;
  if(tmpid==3){
      let supplierresult,channelresult;
 supplierresult=await DB.find('TypeConfigure',{classify:'supplier'});
 channelresult=await DB.find('TypeConfigure',{classify:'channel'});
 result={
    supplierresult,
     channelresult,
 }}else{
    let contractresult;
contractresult=await DB.find('TypeConfigure',{classify:'contract'});
result={
 contractresult,
}
 console.log("result",result);
  }
 ctx.body={
     success:true,
     msg:"获取成功",
     obj:result,    
 };
})

//编辑页配置
router.get('/apikoa/editMake/queryEditSetting', async ctx => {
    console.log("queryEditSettingquery",ctx.query);
    let {moduleID}=ctx.query;
    let tmpid=parseInt(moduleID);
 let result;
 result=await DB.find('EditSetting',{moduleID:tmpid});
 ctx.body={
     success:true,
     msg:"获取配置成功",
     obj:result[0],
 };
})

router.post('/apikoa/editMake/saveEditSetting', async ctx => {
    console.log("saveeditsettingbody",ctx.request.body);
    let { moduleID } = ctx.request.body;
    let updateData={
        ...ctx.request.body,
        timestamp:new Date(),
    }
    let data = await DB.update('EditSetting', { moduleID },updateData);
    console.log("saveEditSettingResult",data);
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

//详情页配置
router.get('/apikoa/detailMake/queryDetailSetting', async ctx => {
    console.log("queryDetailSettingquery",ctx.query);
    let {moduleID}=ctx.query;
    let tmpid=parseInt(moduleID);
 let result;
 result=await DB.find('DetailSetting',{moduleID:tmpid});
 console.log("DetailSettingqueryresult",result);
 ctx.body={
     success:true,
     msg:"获取配置成功",
     obj:result[0],
 };
})

router.post('/apikoa/detailMake/saveDetailSetting', async ctx => {
    console.log("savedetailsettingbody",ctx.request.body);
    let { moduleID } = ctx.request.body;
    let updateData={
        ...ctx.request.body,
        timestamp:new Date(),
    }
    let data = await DB.update('DetailSetting', { moduleID },updateData);
    console.log("saveDetailSettingResult",data);
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

//查询合作方数据
router.get('/apikoa/listMake/queryCoopList', async ctx => {
    console.log("queryCoopData",ctx.query);
 let queryparam=ctx.query;
 if(queryparam.dataSource!='all'){
 queryparam.coopType=queryparam.dataSource;
 }
 delete queryparam.page;
 delete queryparam.rows;
 delete queryparam.dataSource; 
 console.log("coopListparam",queryparam);
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
     console.log("queryallcoop");
 result=await DB.find('CoopData',{});
 }else{
    result=await DB.find('CoopData',queryparam);
 }
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     pageNumber:queryparam.page,
     pageSize:queryparam.rows,
     total:result.length,
     rows:result},
 };
})

router.get('/apikoa/editMake/queryCoopNewProper', async ctx => {
    console.log("queryCoopData",ctx.query);
 let {typeID}=ctx.query;
 let resultall,resultproper; 
 resultall=await DB.find('TypeConfigure',{typeID});
 console.log("result",resultall);
 resultproper=resultall[0].specialProperty;
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     specialProperty:resultall[0].specialProperty,
    },
 };
})

router.get('/apikoa/editMake/queryCoopEdit', async ctx => {
    console.log("queryCoopData",ctx.query);
    let queryparam=ctx.query;
 let result;
 result=await DB.find('CoopData',queryparam);
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
        CoopInfo:result[0],
    },
 };
})




router.get('/apikoa/editMake/queryCoopEdit', async ctx => {
    console.log("queryCoopData",ctx.query);
    let queryparam=ctx.query;
 let result;
 result=await DB.find('CoopData',queryparam);
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
        CoopInfo:result[0],
    },
 };
})

//查询类型配置数据
router.get('/apikoa/listMake/queryTypeConfigureList', async ctx => {
    console.log("queryTypeConfigureData",ctx.query);
 let queryparam=ctx.query;
 delete queryparam.page;
 delete queryparam.rows;
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
 result=await DB.find('TypeConfigure',{});
 }else{
 result=await DB.find('TypeConfigure',{queryparam});
 }
 ctx.body={
     success:true,
     msg:"查询成功",
     obj:{
         pageNumber:queryparam.page,
         pageSize:queryparam.rows,
         total:result.length,
         rows:result},
 };
})

router.get('/apikoa/detailMake/queryTypeConfigureDetail', async ctx => {
    console.log("typeID",ctx.query);
    let {typeID}=ctx.query;
    let result;
    result=await DB.find('TypeConfigure',{typeID});
    let propertyInfo=result[0].specialProperty;
    console.log("resultpropertyinfo",propertyInfo);
    delete result[0].specialProperty;
    console.log("queryTypeConfigureEditresult",propertyInfo);
    let TypeDetailData;
    if(result[0].classify=="supplier"||result[0].classify=="channel"){
        TypeDetailData=await DB.find('CoopData',{coopDetailType:typeID});
    }
    let TypeData=await DB.find('TypeConfigure',{typeID});
    ctx.body={
        success:true,
        msg:"查询成功",
        obj:{
            TypeBasicInfo:result[0],
            TypePropertyInfo:propertyInfo,
            TypeData:TypeDetailData,
        },
    };
})

router.get('/apikoa/editMake/queryTypeConfigureEdit', async ctx => {
    console.log("typeID",ctx.query);
 let {typeID}=ctx.query;
 let result;
 result=await DB.find('TypeConfigure',{typeID});
 let propertyInfo=result[0].specialProperty;
 console.log("resultpropertyinfo",propertyInfo);
 delete result[0].specialProperty;
 console.log("queryTypeConfigureEditresult",propertyInfo);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj:{
         TypeBasicInfo:result[0],
         TypePropertyInfo:propertyInfo,
     },
 };
})

router.post('/apikoa/editMake/saveTypeConfigureEdit', async ctx => {
    console.log("savelistsettingbody",ctx.request.body);
    let { typeID } = ctx.request.body;
    let params=ctx.request.body
    let data = await DB.update('TypeConfigure', {typeID},params);
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

router.post('/apikoa/editMake/saveNewTypeConfigure', async ctx => {
    console.log("savelistsettingbody",ctx.request.body);
    let allqueryresult=await DB.find('TypeConfigure',{});
    console.log("allqueryresult",allqueryresult);
    let lasttypeID=parseInt(allqueryresult[allqueryresult.length-1].typeID)+1;
     ctx.request.body.typeID=lasttypeID+"";
    let params=ctx.request.body;
    console.log("insertparams",params);
    let data = await DB.insert('TypeConfigure', params);
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

//登录及个人中心
router.post('/apikoa/login/account', async ctx => {
    console.log("loginaccountbody",ctx.request.body);
    let {password, userName,type}=ctx.request.body;
    let result= await DB.find('UserInfo',{userName});
    console.log("result",result);
    let datachange = {};
    try {
        if (password==result[0].password) {
            datachange = {
                status: 'ok',
                type,
             currentAuthority:result[0].currentAuthority,
             currentUserInfo:result[0],
            }
        }
    } catch (err) {
        datachange = {
            status: 'ok',
            type,
            currentAuthority: result[0].currentAuthority,
        }
    }
    ctx.body = datachange;
})

// router.post('/apikoa/currentUser', async ctx => {
//     console.log("loginaccountbody",ctx.request.body);
//     let {password, userName,type}=ctx.request.body;
//     let result= await DB.find('UserInfo',{userName});
//     console.log("result",result);
//     let datachange = {};
//     try {
//         if (password==result[0].password) {
//             datachange = {
//                 status: 'ok',
//                 type,
//              currentAuthority:result[0].currentAuthority,
//             }
//         }
//     } catch (err) {
//         datachange = {
//             status: 'ok',
//             type,
//             currentAuthority: result[0].currentAuthority,
//         }
//     }
//     ctx.body = datachange;
// })



//用户及角色管理
router.post('/apikoa/editMake/saveNewUser', async ctx => {
    console.log("loginaccountbody",ctx.request.body);
    let params=ctx.request.body;
    let data = await DB.insert('UserInfo', ctx.request.body);
    console.log("dataResult",data);
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
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})

router.get('/apikoa/listMake/queryUserList', async ctx => {
    console.log("queryUserData",ctx.query);
 let queryparam=ctx.query;
 delete queryparam.page;
 delete queryparam.rows;
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
     console.log("queryallcoop");
 result=await DB.find('UserInfo',{});
 }else{
    result=await DB.find('UserInfo',{queryparam});
 }
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     pageNumber:queryparam.page,
     pageSize:queryparam.rows,
     total:result.length,
     rows:result},
 };
})



//个人中心
router.post('/apikoa/UserInfo/saveUserInfoModify', async ctx => {
    console.log("saveUserInfoModify",ctx.request.body);
    
    let {userName}=ctx.request.body;
    let data = await DB.update('UserInfo', {userName},ctx.request.body);
    console.log("saveuserinforesult",data);
    let datachange = {};
    try {
        if (data.result.ok) {
            console.log("enterresultok");
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        console.log("enter",err);
        datachange = {
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})


//公告管理
router.get('/apikoa/queryNotices', async ctx => {
    console.log("queryNoticeData",ctx.query);
 let queryparam=ctx.query;
 delete queryparam.page;
 delete queryparam.rows;
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
 result=await DB.find('NoticeInfo',{});
 }else{
    result=await DB.find('NoticeInfo',{queryparam});
 }
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     pageNumber:queryparam.page,
     pageSize:queryparam.rows,
     total:result.length,
     rows:result},
 };
})

router.get('/apikoa/queryNoticeDetail', async ctx => {
    console.log("queryNoticeData",ctx.query);
 let {id}=ctx.query;
 let result;
 result=await DB.find('NoticeInfo',{id});
 
 console.log("result",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: result[0],
 };
})


//查询合同管理数据
router.get('/apikoa/listMake/queryContractList', async ctx => {
    console.log("queryContractData",ctx.query);
 let queryparam=ctx.query;
 delete queryparam.page;
 delete queryparam.rows;
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
     console.log("queryallcontract");
 result=await DB.find('ContractData',{});
 }else{
    result=await DB.find('ContractData',{queryparam});
 }
 console.log("contractlistresult",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     pageNumber:queryparam.page,
     pageSize:queryparam.rows,
     total:result.length,
     rows:result},
 };
})

router.get('/apikoa/detailMake/queryContractDetail', async ctx => {
    console.log("contractquery",ctx.query);
    let {contractCode}=ctx.query;
    let result;
    result=await DB.find('ContractData',{contractCode});
    ctx.body={
        success:true,
        msg:"查询成功",
        obj:{
            ContractInfo:result[0],
        },
    };
})

//合同管理
router.post('/apikoa/editMake/contractPay', async ctx => {
    console.log("contractPay",ctx.request.body);
    
    let {contractCode}=ctx.request.body;
    let data = await DB.update('ContractData', {contractCode},{contractStatus:'正常'});
    console.log("savecontractPayresult",data);
    let datachange = {};
    try {
        if (data.result.ok) {
            console.log("enterresultok");
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        console.log("enter",err);
        datachange = {
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})

router.post('/apikoa/editMake/SubmitToAudit', async ctx => {
    console.log("SubmitToAudit",ctx.request.body);
    
    let {contractCode}=ctx.request.body;
    let contractResult = await DB.insert('ContractData', ctx.request.body);
    let auditResult = await DB.insert('AuditData', ctx.request.body);
    console.log("SubmitToAuditcontractResult",contractResult);
    let datachange = {};
    try {
        if (contractResult.result.ok&&auditResult.result.ok) {
            console.log("enterresultok");
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        console.log("enter",err);
        datachange = {
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})

//审核管理
router.get('/apikoa/listMake/queryCheckList', async ctx => {
    console.log("queryCheckData",ctx.query);
 let queryparam=ctx.query;
 delete queryparam.page;
 delete queryparam.rows;
 let keysArr=Object.keys(queryparam);
 let result;
 if(keysArr.length==0){
     console.log("queryallcheck");
 result=await DB.find('AuditData',{});
 }else{
    result=await DB.find('AuditData',{queryparam});
 }
 console.log("contractlistresult",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: {
     pageNumber:queryparam.page,
     pageSize:queryparam.rows,
     total:result.length,
     rows:result},
 };
})

router.post('/apikoa/editMake/saveAuditResult', async ctx => {
    console.log("saveAuditResultBody",ctx.request.body);
    
    let {contractCode}=ctx.request.body;
    let contractResult = await DB.update('ContractData', {contractCode},{contractStatus:'未生效',auditStatus:"已通过"});
    let auditResult = await DB.update('AuditData', {contractCode},{contractStatus:'未生效',auditStatus:"已通过"});
    console.log("SubmitToAuditcontractResult",contractResult);
    let datachange = {};
    try {
        if (contractResult.result.ok&&auditResult.result.ok) {
            console.log("enterresultok");
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        console.log("enter",err);
        datachange = {
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})

//语言配置
router.get('/apikoa/localeConf/queryLocalConf', async ctx => {
    console.log("querylocalConf",ctx.query);
 let queryparam=ctx.query;
 let result;
result=await DB.find('LocaleConf',{});
 console.log("contractlistresult",result);
 ctx.body={
     success:true,
     msg:"查询成功",
     obj: result[0],
 };
})


router.post('/apikoa/localeConf/saveLocaleConf', async ctx => {
    console.log("saveLocaleConf",ctx.request.body);
    let removedata=await DB.removeAll('LocaleConf',{});
    let data = await DB.insert('LocaleConf', ctx.request.body);
    console.log("SubmitToAuditdata",data);
    let datachange = {};
    try {
        if (data.result.ok) {
            console.log("enterresultok");
            datachange = {
                success: true,
                msg: "保存成功",
            }
        }
    } catch (err) {
        console.log("enter",err);
        datachange = {
            success: true,
            msg: "保存成功",
        }
    }
    ctx.body = datachange;
})
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})