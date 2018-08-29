// pages/toWork/editDutyForm/publishDutyForm.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    hasChoose: '点击选择排班表',
    listData0: [],  //社科的列表
    listData1: [],  //科技的列表
    library: 0,
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
    var data = (this.data.library == 0) ? this.data.listData0 : this.data.listData1
    console.log(this.data.listData0)
    var hasChoose = data[id].title;
    console.log('现在选择的是：' + hasChoose)
    this.setData({
      hasChoose: hasChoose
    })
  },
  save: function (e) {
    var data = e.detail.value;
    if (data.id === '' || data.library === '') {
      if (data.id === '')
        util.showFailShort('请选择排班表！')
      else
        util.showFailShort('请选择发布库区！')
    }
    else {
      var listData = []
      if(data.library==0)
        listData = this.data.listData0
      else
        listData = this.data.listData1
      data.id = listData[data.id].id
      delete data.library
      console.log('提交的数据是：', data)
      wx.showModal({
        title: '提示',
        content: '确认发布？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('少女祈祷中')
            http.POST({
              url: "releaseSchedule",
              data: data,
              success: function (res) {
                console.log("返回值为 ", res.data.data);
                switch (res.data.data) {
                  case 'ERR_EXCEED_LIMIT':
                    {
                      util.showFailShort('人数超出上限!')
                      break;
                    }
                  case 'ERR_NO_PERSON':
                    {
                      util.showFailShort('排班表某格人数为0!')
                      break;
                    }
                  case 'ERR_NO_LEADER':
                    {
                      util.showFailShort('排班表某格无班负!')
                      break;
                    }
                  case 'SUCCESS_PUBLISHED':
                    {
                      util.showSuccess('发布成功！')
                      break;
                    }
                  default:
                    {
                      util.showFail('发布失败', '请稍后再试')
                      break;
                    }
                }
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
      url: 'getScheduleList',
      data: { isOrigin: 1 },
      success: function (res) {
        var listData0 = res.data.data 
        var listData1 = []
        //将排班表列表按库区组装
        for (var i = 0; i < listData0.length; i++) {
          if (!listData0[i].library == 0) {
            if (listData1.length){
              var temp = listData0.splice(i, 1)
              listData1.push(temp[0])
            }
            else
            {
              listData1 = listData0.splice(i, 1)
            }
            i--
          }
        }
        console.log('社科的列表为：', listData0)
        console.log('科技的列表为：', listData1)
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