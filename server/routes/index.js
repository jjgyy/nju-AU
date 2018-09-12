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

router.get('/demo', controllers.demo)

router.get('/addNews', controllers.addNews)

router.get('/getNewsList', controllers.getNewsList)

router.get('/getNewsDetail', controllers.getNewsDetail)

router.get('/addAuditAssociation', validationMiddleware, controllers.addAuditAssociation)

router.get('/addAssociationQQ', validationMiddleware, controllers.validateManager, controllers.addAssociationQQ)

router.get('/addAssociationOfficial', validationMiddleware, controllers.validateManager, controllers.addAssociationOfficial)

router.get('/addAssociationArticle', validationMiddleware, controllers.validateManager, controllers.addAssociationArticle)

router.get('/addAssociationJoiner', validationMiddleware, controllers.addAssociationJoiner)

router.get('/getAssociationList', controllers.getAssociationList)

router.get('/getAssociationListByCategory', controllers.getAssociationListByCategory)

router.get('/getAssociationDetail', controllers.getAssociationDetail)

router.get('/getAssociationArticleList', controllers.getAssociationArticleList)

router.get('/getAllArticleList', controllers.getAllArticleList)

router.get('/getAssociationContact', controllers.getAssociationContact)

router.get('/deleteAssociationOfficial', validationMiddleware, controllers.validateManager, controllers.deleteAssociationOfficial)

router.get('/deleteAssociationQQ', validationMiddleware, controllers.validateManager, controllers.deleteAssociationQQ)

router.get('/getUserAssociationList', validationMiddleware, controllers.getUserAssociationList)

router.get('/getUserManageList', validationMiddleware, controllers.getUserManageList)

router.get('/deleteUserJoinedAssociation', validationMiddleware, controllers.deleteUserJoinedAssociation)

router.get('/updateAssociationInfo', validationMiddleware, controllers.validateManager, controllers.updateAssociationInfo)

router.get('/loginAdmin', validationMiddleware, controllers.validateAdmin, controllers.loginAdmin)

router.get('/addAssociation', validationMiddleware, controllers.validateAdmin, controllers.addAssociation)

router.get('/addAssociationChief', validationMiddleware, controllers.validateAdmin, controllers.addAssociationChief)

router.get('/getAuditAssociationList', validationMiddleware, controllers.validateAdmin, controllers.getAuditAssociationList)

router.get('/getAuditAssociationDetail', validationMiddleware, controllers.validateAdmin, controllers.getAuditAssociationDetail)

router.get('/deleteAuditAssociation', validationMiddleware, controllers.validateAdmin, controllers.deleteAuditAssociation)

router.get('/validateAdmin', validationMiddleware, controllers.validateAdmin)

router.get('/validateManager', validationMiddleware, controllers.validateManager)

module.exports = router
