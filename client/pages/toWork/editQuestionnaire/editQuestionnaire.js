// pages/toWork/editQuestionnaire/editQuestionnaire.js
var http = require('../../../utils/http')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    id: "",
    descript: "",//标题下的描述
    detail: "",//第5题对于班次细节的描述,或者是信息收集问卷的问题
    isClass: true,//是否是排班问卷
    hasMinLimit: false,
    selectAll: false,
    canIChoose: [],
    canIChooseDefault: [{ name: "1A"}, { name: "1B" }, { name: "1C"}, { name: "1D" }, { name: "2A" }, { name: "2B" }, { name: "2C" }, { name: "2D" }, { name: "3A" }, { name: "3B" }, { name: "3C" }, { name: "3D" }, { name: "4A" }, { name: "4B" }, { name: "4C" }, { name: "4D" }, { name: "5A" }, { name: "5B" }, { name: "5C" }, { name: "5D" }, { name: "6A" }, { name: "6B" }, { name: "6C" }, { name: "6D" }, { name: "7A" }, { name: "7B" }, { name: "7C" }, { name: "7D" },],
    radioType: [
      { name: '信息收集', value: '0' },
      { name: '报班/调班/补选问卷', value: '1' },
    ],
    radioLimit: [
      { name: '是', value: '1' },
      { name: '否', value: '0' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 500
    }),
    wx.setNavigationBarTitle({//动态设置当行栏标题
      title: "编辑问卷"
    }),
      console.log(JSON.parse(res.hasMinLimit))
    this.setData({//取值并更新数据和UI
      title: res.title,
      id: res.id,
      descript: res.descript,//标题下的描述
      detail: res.detail,//第5题对于班次细节的描述,或者是信息收集问卷的问题
      isClass: JSON.parse(res.isClass),//是否是排班问卷
      hasMinLimit: JSON.parse(res.hasMinLimit),
    })
    if (!(res.canIChoose == null) && this.data.isClass)
    {
      this.setData({
        canIChoose: JSON.parse(res.canIChoose),
      })
      for (var i = 0; i < this.data.canIChoose.length; i++) {
        for (var j = 0; j < 28; j++) {
          if (this.data.canIChoose[i] == this.data.canIChooseDefault[j].name) {
            var str = 'canIChooseDefault[' + j + '].checked'
            this.setData({
              [str]: true,
            })
            break;
          }
        }
      }    
    }
  },
  bindIsClassChange: function (e) {
    console.log("选择项的value是： ", e.detail.value)
    this.setData({
      isClass: (e.detail.value > 0) ? true : false,//是否是排班问卷
    })
  },
  bindLimitChange: function (e) {
    console.log("hasMinLimit的value是： ", e.detail.value)
    this.setData({
      hasMinLimit: (e.detail.value > 0) ? true : false,//是否有最低报班限制
    })
  },
  save: function (e) {
    var data = e.detail.value;
    var id = this.data.id;
    console.log(data)
    if (data.title === '' || data.isClass === '' || (data.canIChoose == false && data.isClass == 1)) {
      if (data.title === '')
        util.showFailShort('标题不能为空！')
      else {
        if (data.isClass === '')
          util.showFailShort('请选择问卷类型！')
        else
          util.showFailShort('请勾选可选班次！')
      }
    }
    else {
      if (!data.canIChoose == false && data.isClass == 1) {
        if (data.canIChoose.length < 4 && this.data.hasMinLimit == true) {
          util.showFailShort('可选班次不足四个！')
          return
        }
      }
      data.id = id
      console.log('提交的数据为：', data)
      wx.showModal({
        title: '提示',
        content: '确定修改问卷吗？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('正在提交')
            http.POST({
              url: "updateQues",
              data: data,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
                util.showSuccess('修改成功！')
              },
              fail: function (res) {
                util.showFail('修改失败', '请稍后再试')
              }, complete: function (res) { },
            })
          }
        }
      })
    }

  },
  delQues: function (e) {
    var that = this;
    var id = that.data.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？(无法撤销)',
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在删除')
          http.POST({
            url: "delQues",
            data: { id: id },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
              util.showSuccess('已删除')
            },
            fail: function (res) {
              util.showFail('删除失败', '请稍后再试')
            }, complete: function (res) { },
          })
        }
      },
      fail: function (res) { }, complete: function (res) { },
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