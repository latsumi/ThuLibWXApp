// pages/toWork/editQuestionnaire/questionnaireView.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    urlTo: '',
    urlFrom: '',
    authority: '',
  },

  bindViewTap: function (event) {
    var index = event.target.dataset.index
    var item = this.data.listData[index]
    if (item.canIChoose != null){
      var canIChoose = new Array()
      canIChoose = item.canIChoose.split(',')
    }
    wx.navigateTo({
      url: this.data.urlTo + '?title=' + item.title + '&id=' + item.id + '&descript=' + item.descript + '&detail=' + item.detail + '&isClass=' + JSON.stringify(item.isClass) + '&canIChoose=' + JSON.stringify(canIChoose),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: "问卷列表"
    })
    var that = this;
    var urlTo = '';
    this.data.urlFrom = res.urlFrom; 

    //为了实时刷新页面，onLoad函数使用了两遍！！！
    if (res.urlFrom =='admin')
      urlTo = 'editQuestionnaire'
    else
      urlTo = '../../me/questionnaireFill'
    that.setData({
      urlTo: urlTo,
      authority: app.globalData.authority,
    })
    http.GET({
      url: "listQues",
      data: '',
      success: function (res) {
        that.setData({
          listData: res.data.data
        })
      },
      fail: function (res) {
        util.showNetworkFail()
      }, complete: function (res) { },
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
    var temp = {urlFrom: this.data.urlFrom}
    this.onLoad(temp)
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