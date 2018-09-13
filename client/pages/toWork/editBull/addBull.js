// pages/toWork/addBull.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
var config = require('../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    detail: ''
  },

  save: function(e){
    console.log(e.detail.value)
    var data = e.detail.value;
    if (data.title === '') {
      util.showFailShort('标题不能为空！')
    }
    else{
      wx.showModal({
        title: '提示',
        content: '确定发布公告吗？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('正在提交')
            http.POST({
              url: "writeNoticeInfo",
              data: data,
              success: function (res) {
                console.log(res.data)
                wx.hideToast()
                wx.showModal({
                  title: '提示',
                  content: '发布成功!',
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              },
              fail: function (res) {
                util.showFail('发布失败', '请稍后再试')
              }, complete: function (res) { },
            })
          }
        }
      })
    }
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: "新建公告"
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})