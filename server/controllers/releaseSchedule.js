module.exports = async ctx => {
  const { mysql } = require('../qcloud')
  const query = ctx.request.body
  if(await('Schedule_List').where({id: query.id}).update({isOrigin: 0})){
    ctx.state.data = 1
  }else{
    ctx.state.data = 0
  }
}