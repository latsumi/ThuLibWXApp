/*封装的网络请求 */
const app = getApp()
var config = require('../config')

var host = config.service.host + '/weapp/'
var requestHandler = {
  url: '',
  data: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
  complete: function () {
    //complete
  },
}
//GET请求
function GET(requestHandler) {
  var header = { 'content-type': 'application/json' };
  request('GET', header, requestHandler)
}
//POST请求
function POST(requestHandler) {
  var header = { 'content-type': 'application/x-www-form-urlencoded' };
  request('POST', header, requestHandler)
}
function request(method, header, requestHandler) {
  var url = host + requestHandler.url;
  var data = requestHandler.data;
  wx.request({
    url: url,
    data: data,
    method: method,
    header: header,
    success: function (res) {
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      requestHandler.complete()
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
}