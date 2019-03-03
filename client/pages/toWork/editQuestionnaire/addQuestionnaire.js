// pages/toWork/editQuestionnaire/addQuestionnaire.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClass: true,
    selectAll: true,
    hasMinLimit: false,
    detail: "1.第一位数字表示星期，第二位字母A、B、C、D依次表示早班、午班、晚一、晚二。例如7C表示周日晚一\n2.早班：周一至周五8:00-9:30，周六及周日9:00-11:00\n午班：13: 00 - 15:00\n晚一：18: 00 - 20:00\n晚二：20: 10 - 22:10\n",
    radioType: [
      { name: '信息收集', value: '0' },
      { name: '报班/调班/补选问卷', value: '1' },
    ],
    radioLimit: [
      { name: '是', value: '1' },
      { name: '否', value: '0' },
    ],
    canIChoose: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", 
    "3A", "3B", "3C", "3D", "4A", "4B", "4C", "4D",
      "5A", "5B", "5C", "5D", "6A", "6B", "6C", "6D", "7A", "7B", "7C", "7D",],

  },

  bindIsClassChange: function(e) {
    console.log("选择项的value是： ",e.detail.value)
    this.setData({
      isClass: (e.detail.value>0)?true:false,//是否是排班问卷
    })
 },
  bindLimitChange: function (e) {
    console.log("hasMinLimit的value是： ", e.detail.value)
    this.setData({
      hasMinLimit: (e.detail.value > 0) ? true : false,//是否有最低报班限制
    })
  },
  bindSelectAll: function(e) {
    let that = this;
    that.setData({
      selectAll: !that.data.selectAll,
    })
    console.log("是否全选： ", that.data.selectAll)
  },

  save: function (e) {
    var data = e.detail.value;
    console.log(data)
    if (data.title === '' || data.isClass === '' || data.descript === '' || (data.canIChoose == false && data.isClass == 1)) {
      if (data.title === '')  
        util.showFailShort('标题不能为空！')
      else {
        if (data.isClass === '')
          util.showFailShort('请选择问卷类型！')
        else
        {
          if (data.descript === '')
            util.showFailShort('请填写问卷描述！')
          else
          {
              util.showFailShort('请勾选可选班次！')
          }
        } 
      }
    }
    else {
      if (!data.canIChoose == false && data.isClass == 1) {
        if (data.canIChoose.length < 5 && this.data.hasMinLimit == true){
          util.showFailShort('可选班次不足五个！')
          return
        }
      }
      wx.showModal({
        title: '提示',
        content: '确定发布问卷吗？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('正在提交')
            http.POST({
              url: "writeQues",
              data: data,
              success: function (res) {
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
      title: "创建问卷"
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