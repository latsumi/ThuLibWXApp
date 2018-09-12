// pages/toWork/routines/signIn.js
var util = require('../../../utils/util.js')
var http = require('../../../utils/http')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: '',
    currentMonth: '',
    currentDate: '',
    currentDay: '',
    name: '',
    library: '',
    currentHour: 12,
    currentClass: 0,
    currentManHour: 1,
    currentPeriod: 0,
    classes: ['早班', '午班', '晚一', '晚二', ],
    manHour:['1.5h','2h','2.5h','3h'],
    manHourPost: [1.5, 2, 2.5, 3],
    period: ['晚上', '早上', '上午', '中午', '下午'],
    day: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    remarks:['替班','负责人'],
    radioLibrary: [
      { name: '社科', value: '0' },
      { name: '科技', value: '1' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 500
    }),
    wx.setNavigationBarTitle({
      title: '签到'
    })
  },

  save: function (e) {
    var data = e.detail.value;
    if (data.library === '' || data.workType === '' || data.manHour === '') {
      if (data.library === '')
        util.showFailShort('请选择签到库区！')
      else
      {
        if (data.workType === '')
          util.showFailShort('请选择所上班次！')
        else
          util.showFailShort('请选择签到工时！')
      }
    }
    else {
      data.isRelief = 0
      data.isLeader = 0
      data.name = app.globalData.name
      data.openId = app.globalData.userInfo.openId
      for (var x in data.remarks){
        if (data.remarks[x].indexOf('替班')>-1)
          data.isRelief = 1
        if (data.remarks[x].indexOf('负责人')>-1)
          data.isLeader = 1
      }
      delete data.remarks
      console.log('提交的数据是：', data)
      wx.showModal({
        title: '提示',
        content: '确认提交？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('少女祈祷中')
            http.POST({
              url: "signinTable",
              data: data,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
                util.showSuccess('提交成功！')
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
    var dates = new Date();
    var hour = dates.getHours();
    var year = dates.getFullYear();
    var month = dates.getMonth(); //0~11
    var date = dates.getDate();
    var day = dates.getDay();

    var currentClass;
    var currentManHour;
    var currentPeriod;

    if(hour>=5&&hour<=11){
      currentManHour = 0;
      currentClass = 0;
      if(hour<=7)
        currentPeriod = 1;
      else
        currentPeriod = 2;
    }
    else{
      currentManHour = 1;
      if(hour<=4||hour>=18)
      {
        currentPeriod = 0;
        if(hour>=18&&hour<=20)
          currentClass = 2;
        else
          currentClass = 3;
      }
      else{
        currentClass = 1;
        if(hour==12)
          currentPeriod = 3;
        else
          currentPeriod = 4;
      }
    }
    this.setData({
      name: app.globalData.name === '' ?'匿名用户':app.globalData.name,
      library: app.globalData.library,
      currentHour: hour,
      currentYear: year,
      currentMonth: month+1,
      currentDate: date,
      currentDay: day,
      currentClass: currentClass,
      currentManHour: currentManHour,
      currentPeriod: currentPeriod,
    })
    console.log(hour, ' 当前班次：', currentClass, ' 当前工时：', currentManHour, ' 当前时段：',currentPeriod)
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