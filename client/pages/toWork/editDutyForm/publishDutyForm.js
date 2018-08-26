// pages/toWork/editDutyForm/publishDutyForm.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  hasChoose: '',
  listData0: [],  //社科的列表
  listData1: [],  //科技的列表
  library: 0,
  data: {
    radioLibrary: [
      { name: '社科', value: '0' },
      { name: '科技', value: '1' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: "发布排班"
    })
  },

  bindRadioChange: function (e) {
    console.log("选择项的value是： ", e.detail.value)
    this.setData({
      library: e.detail.value,
    })
  },
  bindPickerChange: function (e) {
    var id = e.detail.value;
    var data = (library == 0) ? this.data.listData0 : this.data.listData1
    var hasChoose = data[id].title;
    console.log('现在选择的是：' + hasChoose)
    this.setData({
      hasChoose: hasChoose
    })
  },
  save: function (e) {
    var data = e.detail.value;
    console.log('提交的数据是：', data)
    if (data.title === '' || data.library === '') {
      if (data.title === '')
        util.showFailShort('请填写标题！')
      else
        util.showFailShort('请选择发布库区！')
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认发布？(将覆盖正式排班表',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('少女祈祷中')
            http.POST({
              url: "",  //待填
              data: data,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
                util.showSuccess('发布成功！')
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取所有初版排班表列表
    http.POST({
      url: '', //待填
      data: { isOrigin: true },
      success: function (res) {
        var listData0 = res.data.data 
        var listData1 = []
        //将排班表列表按库区组装
        for (var i = 0; i < listData0.length; i++) {
          if (!listData0[i].library == 0) {
            listData1.push(listData0.splice(i, 1))
            i--
          }
        }
        console.log('社科的列表为：', listData0)
        console.log('科技的列表为：', listData0)
        that.setData({
          listData0: listData0,
          listData1: listData1,
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