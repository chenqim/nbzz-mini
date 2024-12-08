module.exports = {
    // 基础模块
    APP_CONFIG:"/wxapp/misc/readAppConfig",                     //app配置读取
    //权限认证模块
    SEND_CODE : "/wxapp/auth/code2Session",                     // 发送code获取session
    AUTO_LOGIN: "/wxapp/auth/code2Login",                       // 已绑定过的自动登录
    GET_TOKEN : "/wxapp/auth/login",                            // 获取token 认证
    LOGOUT: "/wxapp/auth/logout",                               //登出
    CURRENT_MENT_INFO:"/wxapp/auth/queryCurrentMenuInfo",       //查询当前菜单信息
    CURRENT_USER_INFO : "/wxapp/auth/queryCurrentUserInfo",     //查询当前用户信息
    CHANGE_PASSWORD:"/wxapp/auth/updatePassword",               //修改密码
    WORK_ORDER_PAGE: "/wxapp/workOrder/queryByPage",
    MY_WORK_ORDER_PAGE: "/wxapp/workOrder/queryMyByPage",
    WORK_ORDER_DETAIL: "/wxapp/workOrder/queryDetail",
    RECEIVE_PROCEDURE: "/wxapp/workOrder/queryReceiveProcedure",
    RECEIVE_PROCESS: "/wxapp/workOrder/receive",
    CANCEL_PROCESS: "/wxapp/workOrder/cancel",
    STAGE_DETAIL: "/wxapp/stagingArea/queryStagingAreaByCode",
    WRITE_ATR: "/wxapp/produce/writeArtifact",
    //站内信模块
    MESSAGE_ID:"/wxapp/message/queryMyMessageById?id=",         //读取站内信
    MESSAGE_PAGE:"/wxapp/message/queryMyMessageByPage",         //查询当前用户站内信列表
    MESSAGE_COUNT:"/wxapp/message/queryMyMessageCount",         //查询未读站内信数
    MESSAGE_STATUS:"/wxapp/message/updateMyMessageStatus",      //批量标记已读
    MESSAGE_READ:"/wxapp/message/updateMyAllMessageStatus",     //一键已读
    MESSAGE_CLEAN:"/wxapp/message/deleteMyAllMessage",          //一键清空
    //站点管理模块
    SITE_DETAILS:"/wxapp/site/details/",                        //查询站点详情
    SITE_PAGE:"/wxapp/site/queryByPage",                        //分页查询站点
    SITE_OP_PAGE:"/wxapp/siteMaintainRecord/queryByPage",       //分页查询运维记录
    //签到
    SIGNIN_NEARBY_SITE:"/wxapp/site/queryNearbySiteList",       //查询附近站点
    SIGNIN_PAGE:"/wxapp/signInRecord/queryByPage",              //分页查询签到记录
    SIGNIN_CONFIG:"/wxapp/signInRecord/querySignInConfig",      //查询签到配置
    SIGNIN:"/wxapp/signInRecord/signIn",                        //签到
    //站点运维
    SITE_LIST:"/wxapp/site/querySiteList",                      //站点列表
    SITE_SUBMIT:"/wxapp/siteMaintainRecord/commitMaintain",     //提交站点运维
    SITE_PARTICULARS:"/wxapp/siteMaintainRecord/details/",      //查询运维记录详情
                                                                //查询运维单照片
    SITE_OPSIMG:"/commonFile/queryFilesByMainId?bizCode=maintain_record_ops_form_img&mainId=",
                                                                //查询站房环境照片
    SITE_SITEIMG:"/commonFile/queryFilesByMainId?bizCode=maintain_record_site_img&mainId=",
    //药品申报
    M_PAGE:"/wxapp/appDrugsRecord/queryByPage",                 //分页查询药剂申报记录
    M_DETAIL:"/wxapp/appDrugsRecord/queryById/",                //查询单个药剂申报记录
    M_SUBMIT:"/wxapp/appDrugsRecord/commitDrugsRecord",         //提交药剂申报
    M_LIST:"/wxapp/appDrugsRecordItem/queryListByRecordId",     //查询申报记录项列表
    M_SEARCH:"/wxapp/materiaDrugs/queryListByType",             //根据药剂类型查找药剂列表
    //配件申报
    K_PAGE:"/wxapp/appAccessoryRecord/queryByPage",             //分页查询配件申报记录
    K_DETAIL:"/wxapp/appAccessoryRecord/queryById/",            //查询单个配件申报记录
    K_SUBMIT:"/wxapp/appAccessoryRecord/commitAccessoryRecord", //提交配件申报记录
    K_LIST:"/wxapp/appAccessoryRecordItem/queryListByRecordId", //查询申报记录项列表
    K_SEARCH:"/wxapp/materialAccessory/queryListByGroupId",     //查询申报记录项列表
     // 监控报警
    POLICE_LIST:"/wxapp/callPoliceRecord/currentUserQueryByPage", //查询监控报警列表
    //在线数据
    ONLINE_DETAIL:"/wxapp/onlineData/queryRealTimeDataBySiteId?id=",  //查询单个站点的实时数据列表
    HISTORY_DATA:"/wxapp/onlineData/queryHistoryDataByTime",    //查询历史数据列表
    ONLINE_DATA:"/wxapp/onlineData/queryRealTimeDataByPage",    //查询所有的实时数据
    HISTORY_FACTOR:"/wxapp/historyData/queryMonitorDataFactor", //查询历史数据因子列表
    HISTORY_LIST:"/wxapp/historyData/queryHistoryDataByTime",   //查询历史数据
    HISTORY_TOTAL:"/wxapp/historyData/queryMonitorDataTotal",   //查询总数
    //文件上传
    FU_SIGNIN:"/commonFile/upload?bizCode=sign_in_record_sign_in_img",     //签到照片上传
    FU_MAINTAIN_SITE_IMG:"/commonFile/upload?bizCode=maintain_record_site_img",        //站点运维，站点照片
    FU_MAINTAIN_FORM_IMG:"/commonFile/upload?bizCode=maintain_record_ops_form_img",        //站点运维，运维单照片
}