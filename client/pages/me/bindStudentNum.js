// pages/me/bindStudentNum.js
var http = require('../../utils/http')
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    name: '',
    library: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: '绑定学号'
    })
  },
  save: function (e) {
    var data = e.detail.value;
    data.openId = app.globalData.userInfo.openId;
    console.log("所提交的值为 ", data);

    if (data.name === '' || data.studentNum === '') {
      if (data.name === '')
        util.showFailShort('请填写姓名！')
      else 
        util.showFailShort('请填写学号！')
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('正在提交……')
            console.log(data)
            http.POST({
              url: "bindInfo",
              data: data,
              success: function (res) {
                console.log("返回值为 ", res.data.data);
                if (res.data.data=='no info')
                {
                  util.showFailShort('信息输入错误！')
                }
                else
                {
                  if (res.data.data == 'wrong secretKey')
                    util.showFailShort('密钥错误！')
                  else{
                    app.globalData.authority = res.data.data[0].grade
                    app.globalData.name = res.data.data[0].name
                    app.globalData.library = res.data.data[0].library
                    wx.navigateBack({
                      delta: 1
                    })
                    util.showSuccess('绑定成功！')
                  }
                }  
              },
              fail: function (res) {
                util.showFail('提交失败', '请稍后再试')
              }, complete: function (res) { },
            })
          }
        }
      })
    }

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