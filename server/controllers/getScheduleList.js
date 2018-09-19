// 根据isOrigin显示终版排班表或初始排班表列表
module.exports = async ctx => {
  const { mysql } = require('../qcloud')
  if (ctx.method === 'GET') {
    const query = ctx.query
    let res = await mysql('Schedule_List').where({ isOrigin: query.isOrigin }).select('*')
    ctx.state.data = res
  }
  if (ctx.method === 'POST') {
    const query = ctx.request.body
    let res = await mysql('Schedule_List').where({ isOrigin: query.isOrigin }).select('*')
    ctx.state.data = res
  }
}
