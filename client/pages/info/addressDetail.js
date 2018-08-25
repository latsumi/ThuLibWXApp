// pages/info/addressDetail.js
var http = require('../../utils/http')
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    studentNum: '',
    listData: [
      { name: 'name', key: '姓名', value: '' },
      { name: 'studentNum', key: '学号', value: '' },
      { name: 'sex', key: '性别', value: '' },
      { name: 'department', key: '院系', value: '' },
      { name: 'tel', key: '手机', value: '' },
      { name: 'mail', key: '邮箱', value: '' },
      { name: 'address', key: '住址', value: '' },
      { name: 'status', key: '备注', value: '' },],
    descs: '↓点击手机号拨打电话↓',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 800
    }),
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: '详细信息'
    })
    this.setData({
      name: res.name,
      studentNum: res.studentNum,
    })
    var that = this;
    http.POST({
      url: 'getStudentInfo',
      data: { name: that.data.name, studentNum: that.data.studentNum },
      success: function (res) {
        console.log(res.data.data)
        //待修改，先组装listData再setData
        for (var x in res.data.data[0]) {
          for(var j=0;j<that.data.listData.length;j++){
            if (that.data.listData[j].name==x)
            {
              var str1 = 'listData[' + j + '].value'
              that.setData({
                [str1]: res.data.data[0][x]
              })
              break;
            }
          }
        }
      },
      fail: function (res) {
        util.showNetworkFail()
      }, complete: function (res) { },
    })

  },

  bindPhoneTap: function(e){
    var tel = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel,
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