//index.js
var config = require('../../config')
var http = require('../../utils/http')
var util = require('../../utils/util')

const app = getApp()

Page({
  data: {
    imgUrls:[
      "../../image/home_lib01.jpg",
      "../../image/home_lib02.jpg",
      "../../image/home_lib03.jpg",
      "../../image/home_lib04.jpg",
      "../../image/home_lib05.jpg",
    ],
    listData: [],
    userInfo: {},
    hasUserInfo: false,
    timestampLimit: 2592000,

    menu:[
      { menuImage: "../../image/contacts_socialScience.png", descs: "通讯录(社科)" },
      { menuImage: "../../image/contacts_science&tech.png", descs: "通讯录(科技)" }, 
      { menuImage: "../../image/dutyForm_socialScience.png", descs: "排班表(社科)"}, 
      { menuImage: "../../image/dutyForm_science&tech.png", descs: "排班表(科技)" },
    ]
  },

  onLoad: function () {
    var that = this;
    http.GET({
      url: 'listNoticeInfo',
      data: {},
      success: function(res){
        that.setData({
          listData: res.data.data
        })
      },
      fail: function (res){
        util.showNetworkFail()
      }, 
      complete: function (res){
        if (!app.globalData.logged) {
          try {
            var res = wx.getStorageInfoSync()
            console.log(res.keys)
            var userInfo = wx.getStorageSync('userInfo')
            var timestamp = wx.getStorageSync('timestamp')
            var timestampNow = Date.parse(new Date())/1000;
            var timePassed = timestampNow - timestamp
            var timestampLimit = that.data.timestampLimit
            console.log("距离上次手动登录：", timePassed, "秒")
            if (userInfo && timePassed < timestampLimit) {
              console.log("存储的用户信息为：", userInfo)
              app.globalData.userInfo = userInfo
              app.globalData.logged = true
              app.globalData.authority = 1
              that.checkStatus(userInfo.openId)
            }
            else {
              if (!userInfo){
                //用户没有登录过或找不到缓存
                util.showFail('请先登录', '小图不认识你 ~(＞_＜)~')
                console.log("没有用户信息")
              }
              else{
                util.showFail('登录态已过期', '请手动登录')
                console.log("登录态已过期")
              }

            }
          } catch (e) {
            console.log("读取缓存出错: ", e)
          }
        }
      },
    })
  },

  bindMenuTap: function(event) {
    var index = event.target.dataset.index
    if (app.globalData.authority < 2) {
      if (app.globalData.authority < 1) {
        util.jumpToLogin('../me/me', false)
      }
      else {
        util.jumpToLogin('../me/me', true)
      }
    }
    else{
      switch(index){
        case 0:{
          wx.navigateTo({
            url: '../info/addressList?urlFrom=0',
          })
          break;
        }
        case 1: {
          wx.navigateTo({
            url: '../info/addressList?urlFrom=1',
          })
          break;
        }
        case 2: {
          wx.navigateTo({
            url: '../info/dutyForm?urlFrom=0',
          })
          break;
        }
        case 3: {
          wx.navigateTo({
            url: '../info/dutyForm?urlFrom=1',
          })
          break;
        }
        default:
          break;
      }
    }
  },
  bindBullTap: function(event) {
    console.log(this.data.listData)
    var index = event.target.dataset.index
    var item = this.data.listData[index]
    wx.navigateTo({
      url: '../info/bulletinDetail?title=' + item.title + '&detail=' + item.detail,
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    http.GET({
      url: 'listNoticeInfo',
      data: {},
      success: function (res) {
        that.setData({
          listData: res.data.data
        })
      },
      fail: function (res) { }, complete: function (res) { },
    })
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  checkStatus: function (openId) {
    //根据缓存的用户openId去通讯录查询权限
    var data = {}
    data.openId = openId
    util.showBusy('自动登录中')
    http.POST({
      url: 'getStatus',
      data: data,
      success: function (res) {
        console.log(res)
        if (res.data.data.length != 0) {
          app.globalData.authority = res.data.data[0].grade
          app.globalData.name = res.data.data[0].name
          app.globalData.library = res.data.data[0].library
          console.log('全局变量的值为：', app.globalData)
          util.showSuccess('登录成功')
        }
        else{
          //用户未绑定过
          util.jumpToLogin('../me/me', true)
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})
