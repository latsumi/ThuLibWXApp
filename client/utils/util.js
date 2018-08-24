const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

//跳转到登录页面
function jumpToLogin(url) {
  wx.hideToast();
  wx.showModal({
    title: '请先登录',
    content: '小图不认识你~(＞_＜)~',
    confirmText: '去登录',
    showCancel: false,
    success(res) {
      wx.switchTab({
        url: url,
      })
    }
  })
}
// 显示失败提示 自定义提示内容
var showFail = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: content,
    showCancel: false
  })
}
// 用于操作错误的提示
var showFailShort = text => wx.showToast({
  title: text,
  icon: 'none',
})
// 用于网络连接失败的提示
var showNetworkFail = () => {
  wx.hideToast();
  wx.showModal({
    title: '加载失败',
    content: '请检查网络连接！',
    showCancel: false,
    success: function (res) {
      wx.navigateBack({
        delta: 1
      })
    }
  })
}
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}


module.exports = { formatTime, showBusy, showSuccess, showModel, jumpToLogin: jumpToLogin, showFail, showFailShort, showNetworkFail, wxPromisify }
