// pages/toWork/editManHour/countManHour.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioLibrary: [
      { name: '社科', value: '0' },
      { name: '科技', value: '1' },
    ],
    chooseBegin: '点击选择开始日期',
    beginValue: '',
    chooseEnd: '点击选择结束日期',
    endValue: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: "统计工时"
    })
  },
  bindPickerBeginChange: function (e) {
    var id = e.detail.value;
    var hasChoose = '起始日期：' + id;
    console.log('现在选择的是：' + hasChoose)
    this.setData({
      beginValue: id,
      chooseBegin: hasChoose
    })
  },
  bindPickerEndChange: function (e) {
    var id = e.detail.value;
    var hasChoose = '结束日期：' + id;
    console.log('现在选择的是：' + hasChoose)
    this.setData({
      endValue: id,
      chooseEnd: hasChoose
    })
  },
  save: function (e) {
    var data = e.detail.value;
    console.log('提交的数据是：', data)
    if (data.library === '' || data.begin === '' || data.end === '') {
      if (data.library === '')
        util.showFailShort('请选择库区！')
      else{
        if (data.begin === '')
          util.showFailShort('请选择起始日期！')
        else
          util.showFailShort('请选择结束日期！')
      }    
    }
    else {
      var begin = data.begin.split('-')
      var end = data.end.split('-')
      if (begin[0] > end[0] || ((begin[0] <= end[0]) && begin[1] > end[1]) || ((begin[0] <= end[0]) && begin[1] <= end[1] && begin[2] > end[2]))
        util.showFailShort('请选择正确的起止日期！')
      else{
        wx.showModal({
          title: '提示',
          content: '开始统计？',
          success: function (res) {
            if (res.confirm) {
              util.showBusy('少女祈祷中')
              http.POST({
                url: "calcmanHour",
                data: data,
                success: function (res) {
                  wx.hideToast()
                  wx.showModal({
                    title: '提示',
                    content: '统计完成!',
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
                  util.showFail('提交失败', '请稍后再试')
                }, complete: function (res) { },
              })
            }
          }
        })
      }
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
    var dates = new Date();
    var date = dates.getDate();
    var month = dates.getMonth() + 1;
    var year = dates.getFullYear();
    if (date < 10) date = '0' + date;
    if (month < 10) month = '0' + month;

    var currentDate = year + '-' + month + '-' + date;
    this.setData({
      currentDate: currentDate,
    })
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