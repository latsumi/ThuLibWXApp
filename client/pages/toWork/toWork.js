//toWork.js
var util = require('../../utils/util.js')

var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority: '',
    menu: [
      { menuImage: "../../image/leave.png", descs: "请假", x: 300, y: 625 },//下
      { menuImage: "../../image/wanted.png", descs: "求替", x: 75, y: 400 },//左
      { menuImage: "../../image/signIn.png", descs: "签到", x: 300, y: 400 },//中
      { menuImage: "../../image/viewTask.png", descs: "查看排架",x:525,y:400},//右 
      { menuImage: "../../image/helpWanted.png", descs: "去替班",x:300,y:175 },//上 
    ],
    func: [
      {
        topic: "负责人",
        color: '#F6F6F6',
        option:[{ descs: "检查签到", url: "leaderWork/checkSignIn" },
          { descs: "去排架", url: "" },
          { descs: "填写备注", url: "" },
          { descs: "查看替班", url: "" }],
      },
      {
        topic: "队委-公告",
        color: 'hsl(270, 40%, 95%)',
        option: [{ descs: "新建公告", url: "editBull/addBull" },
          { descs: "编辑公告", url: "editBull/bullList" }],
      }, 
      {
        topic: "队委-问卷",
        color: 'hsl(270, 40%, 95%)',
        option: [{ descs: "新建问卷", url: "editQuestionnaire/addQuestionnaire" },
        { descs: "编辑问卷", url: "editQuestionnaire/questionnaireView?urlFrom=admin"}],
      },
      {
        topic: "队委-排班",
        color: 'hsl(270, 40%, 95%)',
        option: [{ descs: "初版排班", url: "editDutyForm/makeDutyForm" },
          { descs: "发布排班", url: "editDutyForm/publishDutyForm" }],
      },
      {
        topic: "队委-工时",
        color: 'hsl(270, 40%, 95%)',
        option: [{ descs: "统计工时", url: "editManHour/countManHour" },]
      },
      ],

  },
  bindMenuTap: function(e){
    var index = e.target.dataset.index
    switch(index){
      case 2:
      {
        wx.navigateTo({
          url: 'routines/signIn',
        })
        break;
      }
      default:
      {
        wx.showModal({
          title: '施工中',
          content: '敬请期待',
          showCancel: false
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

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
    if (app.globalData.authority < 2) {
      if (app.globalData.authority < 1){
        util.jumpToLogin('../me/me', false)
      }
      else{
        util.jumpToLogin('../me/me', true)
      }
    }
    else{
      this.setData({
        authority: app.globalData.authority
      })
    }
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