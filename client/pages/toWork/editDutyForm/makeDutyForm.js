// pages/toWork/editDutyForm/makeDutyForm.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasChoose: '',
    listData: [],
    radioLibrary: [
      { name: '社科', value: '0' },
      { name: '科技', value: '1' },
    ],
  },

  bindPickerChange: function(e){
    var id = e.detail.value;
    var hasChoose = this.data.listData[id].title;
    console.log('现在选择的是：' + hasChoose)

    this.setData({
      hasChoose: hasChoose
    })
  },
  save: function(e){
    var data = e.detail.value;

    if (data.id == null || data.library === '') {
      if (data.id == null)
        util.showFailShort('请选择问卷！')
      else
        util.showFailShort('请选择排班库区！')
    }
    else {
      data.id = this.data.listData[data.id].id
      console.log('提交的数据是：', data)
      wx.showModal({
        title: '提示',
        content: '开始排班？(将覆盖该库区初版排班表',
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
                util.showSuccess('排班成功！')
              },
              fail: function (res) {
                util.showFail('排班失败', '请稍后再试')
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
      title: "初版排班"
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
    this.setData({
      hasChoose: '点击选择问卷'
    })
    var that = this;
    http.GET({
      url: "listQues",  //待填
      success: function (res) {
        var data = res.data.data
        for(var i=0;i<data.length;i++){
          if(!data[i].isClass)
          {
            data.splice(i, 1)
            i--
          }
        }
        console.log(res.data.data)
        that.setData({
          listData: data
        })
      },
      fail: function (res) {
        util.showNetworkFail()
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