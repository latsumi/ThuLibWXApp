// pages/toWork/editBull.js

var config = require('../../../config')
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    publisher: '',
    detail: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    util.showBusy('加载中...')
    wx.setNavigationBarTitle({//动态设置当行栏标题
        title: "公告编辑"
      })
    this.setData({//取值并更新数据和UI
      title: res.title,
      detail: res.detail,
      id: res.id
    })
    wx.hideToast()
  },
  delBull: function(e) {
    var that = this;
    var id = that.data.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在删除')
          http.POST({
            url: "delNoticeInfo",
            data: { id: id },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
              util.showSuccess('已删除')
            },
            fail: function (res) {
                util.showFail('删除失败', '请稍后再试')
            }, complete: function (res) { },
            })
          }
        },
      fail: function (res) { }, complete: function (res) { },
    })
  },
  save: function(e){
    var that = this;
    var data = e.detail.value;
    var id = that.data.id;
    wx.showModal({
      title: '提示',
      content: '确定修改吗？',
      success: function (res) {
        if (res.confirm) {
          util.showBusy('提交中...')
          http.POST({
            url: "updateNoticeInfo",
            data: {
              title: data.title,
              detail: data.detail,
              id: id,
            },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
              util.showSuccess('修改成功')
            },
            fail: function (res) {
              util.showFail('提交失败', '请稍后再试')
            }, complete: function (res) { },
          })
        }
      },
      fail: function (res) { }, complete: function (res) { },
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