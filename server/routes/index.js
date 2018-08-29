/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router

router.get('/test', controllers.test)

//about notice
router.get('/listNoticeInfo', controllers.listNoticeInfo)
router.get('/writeNoticeInfo', controllers.writeNoticeInfo)
router.post('/writeNoticeInfo', controllers.writeNoticeInfo)
router.get('/delNoticeInfo', controllers.delNoticeInfo)
router.post('/delNoticeInfo', controllers.delNoticeInfo)
router.get('/updateNoticeInfo', controllers.updateNoticeInfo)
router.post('/updateNoticeInfo', controllers.updateNoticeInfo)
router.post('/topNoticeInfo',controllers.topNoticeInfo)

//about question
router.get('/listQues', controllers.listQues)
router.get('/writeQues', controllers.writeQues)
router.post('/writeQues', controllers.writeQues)
router.get('/delQues', controllers.delQues)
router.post('/delQues', controllers.delQues)
router.get('/updateQues', controllers.updateQues)
router.post('/updateQues', controllers.updateQues)
router.post('/upAnswerInfo', controllers.upAnswerInfo)

// about schedule
router.post('/createSchedule', controllers.createSchedule)
router.post('/getScheduleList', controllers.getScheduleList)
router.post('/releaseSchedule', controllers.releaseSchedule)
router.post('/listSchedule', controllers.listSchedule)
router.post('/updateSchedule', controllers.updateSchedule)

// about user info
router.post('/getStatus', controllers.getStatus)
router.post('/getAddressList', controllers.getAddressList)
router.post('/getStudentInfo', controllers.getStudentInfo)
router.post('/bindInfo', controllers.bindInfo)

// about signin
router.post('/signinTable',controllers.signinTable)
router.get('/listSigninTable',controllers.listSigninTable)
router.post('/affirmSigninTable',controllers.affirmSigninTable)
router.post('/delSigninInfo',controllers.delSigninInfo)

// about manhour
router.post('/calcManHour', controllers.calcManHour)
router.post('/getManHour',controllers.getManHour)