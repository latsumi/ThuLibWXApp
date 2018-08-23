//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData: {
    name: '',
    library: '',
    authority: 0,
    userInfo: [],
  },

  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  }
})