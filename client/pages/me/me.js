// pages/me/me.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var http = require('../../utils/http')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    authority: '',
    name: '',
    library: '',
    modalHidden: true,
    modalChoose: 0,
    imageUrl: '../../image/kunbaby.jpeg',
    menu:[
      { menuImage: "../../image/questionnaire.png", descs: "填写问卷" },
      { menuImage: "../../image/manHour.png", descs: "工时查看" },
      { menuImage: "../../image/bindingNum.png", descs: "绑定学号" },
      { menuImage: "../../image/messageBox.png", descs: "留言" },
      //下面是测试用代码，用来调整权限值
      // { menuImage: "../../image/beMember.png", descs: "成为队员" },
      // { menuImage: "../../image/beLeader.png", descs: "成为负责人" },
      // { menuImage: "../../image/beAdmin.png", descs: "成为管理员" },
    ]

  },
  checkStatus: function (that) {
    //根据用户的openId去通讯录查询权限
    app.globalData.userInfo = that.data.userInfo
    app.globalData.authority = 1
    console.log(app.globalData.userInfo)
    var data = {}
    data.openId = that.data.userInfo.openId
    http.POST({
      url: 'getStatus',
      data: data,
      success: function (res) {
        console.log(res)
        if (res.data.data.length != 0) {
          that.setData({
            authority: res.data.data[0].grade,
            name: res.data.data[0].name,
            library: res.data.data[0].library,
          })
          app.globalData.authority = that.data.authority
          app.globalData.name = that.data.name
          app.globalData.library = that.data.library
          console.log('全局变量的值为：', app.globalData)
        }
      },
      fail: function (res) {
        util.showNetworkFail()
      },
      complete: function (res) {
        console.log('验证结束')
      },
    })
  },
  login: function (e) {
    if (this.data.logged) return
    var that = this
    if (e.detail.userInfo){
      console.log('授权成功')
      console.log('获得的用户信息：', e.detail.userInfo)
      util.showBusy('正在登录')
      const session = qcloud.Session.get()
      if (session) {
      // 第二次登录，或者本地已经有登录态，使用本函数更新登录态
        qcloud.loginWithCode({
          success: res => {
              this.setData({ userInfo: res, logged: true })
              util.showSuccess('登录成功')
              console.log('验证开始2')
              this.checkStatus(this)
          },
          fail: err => {
              console.error(err)
              util.showModel('登录错误', err.message)
          }
        })
      } 
      else {
      // 首次登录
        qcloud.login({
          success: res => {
              this.setData({ userInfo: res, logged: true })
              util.showSuccess('登录成功')
              console.log('验证开始1')
              this.checkStatus(this)
          },
          fail: err => {
              console.error(err)
              util.showModel('登录错误', err.message)
          }
        })
      }
    }
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '请求授权失败',
        content: '将无法使用小程序的大部分功能，要转到设置界面去授权吗？',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              //重新获取用户信息
            })
          }
        }
      })
    }
  },
  showAction: function () {
    this.setData({
      modalChoose: 0,
      modalHidden: false,
    })
  },
  showActionAbout: function () {
    this.setData({
      modalChoose: 1,
      modalHidden: false,
    })
  },
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true,
    })
  },

  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  bindMenuTap: function (event) {
    var index = event.target.dataset.index
    if (app.globalData.authority < 2 && index < 4 && !(app.globalData.authority == 1&&index==2)) {
      if (app.globalData.authority < 1){
        util.showFail('请先登录', '小图不认识你 ~(＞_＜)~')
      }
      else{
        util.showFail('请先绑定学号', '小图不认识你 ~(＞_＜)~')
      }
    }
    else {
      switch(index)
      {
        case 0:
        {
          wx.navigateTo({
            url: '../toWork/editQuestionnaire/questionnaireView?urlFrom=me',
          })
          break;
        }
        case 1:
        {
          wx.navigateTo({
            url: 'manHourView',
          })
          break;
        }
        case 2:
        {
            wx.navigateTo({
              url: 'bindStudentNum',
            })
          break;
        }
        // case 3:
        //   {
        //     wx.makePhoneCall({
        //       phoneNumber: '18813139066',
        //     })
        //     break;
        //   }
        // case 4:
        // {
        //   app.globalData.authority = 2;
        //   util.showSuccess("权限等级:2");
        //   break;
        // }
        // case 5:
        //   {
        //     app.globalData.authority = 3;
        //     util.showSuccess("权限等级:3");
        //     break;
        //   }
        // case 6:
        //   {
        //     app.globalData.authority = 4;
        //     util.showSuccess("权限等级:4");
        //     break;
        //   }
        default:
        {
          wx.showModal({
            title: '施工中',
            content: '敬请期待',
            showCancel: false
          })
          break;
        }
      }
    }
  },

})