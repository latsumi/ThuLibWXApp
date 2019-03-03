// pages/me/questionnaireFill.js
var http = require('../../utils/http')
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    id: "",
    descript: "",//标题下的描述
    detail: "",//第5题对于班次细节的描述,或是信息收集问卷的问题
    isClass: false,//是否是排班问卷
    hasWork: true,
    hasMinLimit: '',
    canIChoose: [],
    checkboxValue: [],
    radioLibrary: [
      { name: '社科', value: '0' },
      { name: '科技', value: '1' },
    ],
    radioStatus: [
      { name: '负责人', value: '0' },
      { name: '老队员', value: '1' },
      { name: '新队员', value: '2' },
    ],
    radioHasWork: [
      { name: '是', value: '1' },
      { name: '否', value: '0' },
    ],
    
  },
  
  bindHasWorkChange: function (e) {
    console.log("选择项的value是： ", e.detail.value)
    this.setData({
      hasWork: (e.detail.value > 0) ? true : false,//是否选择上班
    })
  },
  onChange(field, e) {
    const { value } = e.detail
    const data = this.data[field]
    const index = data.indexOf(value)
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    this.setData({
      [field]: current,
    })
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  bindOnChange: function (e) {
    this.onChange('checkboxValue', e)
  },
  save: function (e) {
    var data = e.detail.value;
    data.openId = app.globalData.userInfo.openId;
    data.id = this.data.id;
    data.isClass = this.data.isClass;
    console.log("所提交的值为 ", data);

    if (data.name === '' || data.studentNum === '' || data.library === '' || data.status === '' || (data.answer == false && data.isClass == 1)) {
      if (data.name === '')
        util.showFailShort('请填写姓名！')
      else {
        if (data.studentNum === '')
          util.showFailShort('请填写学号！')
        else {
          if (data.library === '')
            util.showFailShort('请选择库区！')
          else
          {
            if(data.status =='')
              util.showFailShort('请选择队员类型！')
            else
              util.showFailShort('请勾选可选班次！')
          }
        }
      }
    }
    else {
      if (!data.answer == false && data.isClass == 1) {
        if (data.answer.length < 4 && this.data.hasMinLimit == true) {
          util.showFailShort('选择班次不足四个！')
          return
        }
      }
      wx.showModal({
        title: '提示',
        content: '确定提交问卷吗？',
        success: function (res) {
          if (res.confirm) {
            util.showBusy('正在提交')
            http.POST({
              url: "upAnswerInfo",
              data: data,
              success: function (res) {
                console.log("提交问卷的返回值为 ", res.data);
                switch (res.data.data) {
                  case 'SUCCESS_FILLED':
                    {
                      wx.hideToast()
                      wx.showModal({
                        title: '提示',
                        content: '提交成功!',
                        confirmText: '确认',
                        showCancel: false,
                        success(res) {
                          wx.navigateBack({
                            delta: 1
                          })
                        }
                      })
                      break;
                    }
                  case 'ERR_WRONG_INFO':
                    {
                      util.showFailShort('姓名学号有误!')
                      break;
                    }
                  case 'ERR_WRONG_LIBRARY':
                    {
                      util.showFailShort('库区信息有误!')
                      break;
                    }
                  case 'ERR_WRONG_GRADE':
                    {
                      util.showFailShort('队员类型有误!')
                      break;
                    }
                  default:
                    {
                      util.showFail('提交失败', '请稍后再试')
                      break;
                    }
                }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 500
    }),
      wx.setNavigationBarTitle({//动态设置当行栏标题
        title: res.title
      })
    this.setData({//取值并更新数据和UI
      title: res.title,
      id: res.id,
      descript: res.descript,//标题下的描述
      detail: res.detail,//第5题对于班次细节的描述,或是信息收集问卷的问题
      isClass: JSON.parse(res.isClass),//是否是排班问卷
      hasMinLimit: JSON.parse(res.hasMinLimit),//是否有最低报班限制
    })
    if ((!(res.canIChoose == null)) && this.data.isClass) {
      this.setData({
        canIChoose: JSON.parse(res.canIChoose),
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