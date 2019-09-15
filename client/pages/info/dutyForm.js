// pages/info/dutyForm.js
var http = require('../../utils/http')
var util = require('../../utils/util.js');  
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    urlFrom: '',
    hasChoose: '',
    listData: [],
    // formTitle:'2018年春季学期社科库第2-8周排班表',
    // persons: [
    //   "吴智光 邵宗义 于洋懿 张雨萌 李焕星",
    //   "萧霭静 盛忠凯 李颖柯 郭一橙 俞发磊 耿耀君 孙立猛",
    //   "陈九成 王杰 马晓辉 郑在文 张丁月 杨哲 王玉 冉林鑫",
    //   "周杰伦 林俊杰 潘玮柏 陈奕迅 一定要 凑够了 八个人 有时候 九个人",

    //   "周磊 次仁曲吉 葛书源 涂俊 李璐效",
    //   "2",
    //   "3",
    //   "4",
    // ],
    persons: [],
    isTwoClass: '',

    week: ["周一","周二","周三","周四","周五","周六","周日"],
    classes: ["早班   8:00-9:30", "午班 13:30-15:00", "晚一 18:00-20:00", "晚二 20:10-22:10",],
    classesHoliday: ["早班  9:00-11:00", "午班 15:00-17:00",],
    currentDay: '', //当天星期
    descs1: '*每个班的第一位队员是班次的负责人，请假替班请私信负责人',
    descs2: '*左右滑动查看其他时间排班，点击排班表标题查看历史排班表',
    descs3: '*学期中每天四个班次的人数上限分别为5、5、7、8人，假期上限另行通知',
  },

  bindPickerChange: function (e) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 800
    })
    var that = this
    var id = e.detail.value;
    var hasChoose = this.data.listData[id].title;
    var formId = this.data.listData[id].id;
    console.log('现在选择的是：' + hasChoose)
    console.log('现在选择的id是：' + formId)
    this.setData({
      hasChoose: hasChoose
    })
    //根据选择的排班表展示
    http.POST({
      url: "listSchedule",
      data: {
        id: formId,
        library: this.data.urlFrom
      },
      success: function (res) {
        console.log("返回值为 ", res.data);
        that.setData({
          persons: res.data.data.person,
          isTwoClass: res.data.data.isTwoClass,
        })
      },
      fail: function (res) {
        util.showFail('网络错误', '请稍后再试')
      }, complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    var date = new Date();
    var day = date.getDay();
    if(day==0) day = 7;
    this.setData({
      currentDay: day,
      urlFrom: res.urlFrom
    })
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: this.data.urlFrom==0?'社科排班表':'科技排班表'
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
    var that = this;
    var library = that.data.urlFrom;
    console.log(library);

    //获取最新的该库区排班表
    http.POST({
      url: "listSchedule",
      data: { 
        id: '',
        library: library
      },
      success: function (res) {
        console.log("返回值为 ", res.data);
        that.setData({
          hasChoose: res.data.data.title,
          persons: res.data.data.person,
          isTwoClass: res.data.data.isTwoClass,
        })
      },
      fail: function (res) {
        util.showFail('网络错误', '请稍后再试')
      }, complete: function (res) { },
    })
    //获取该库区排班表列表
    http.POST({
      url: 'getScheduleList',
      data: { isOrigin: 0 },
      success: function (res) {
        var data = res.data.data
        //只保留该库区的排班表
        for (var i = 0; i < data.length; i++) {
          if (!(data[i].library==that.data.urlFrom)) {
            data.splice(i, 1)
            i--
          }
        }
        console.log('返回值为：', data)
        that.setData({
          listData: data,
        })
      },
      fail: function (res) {
        util.showFail('网络错误', '请稍后再试')
      }, complete: function (res) { },
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