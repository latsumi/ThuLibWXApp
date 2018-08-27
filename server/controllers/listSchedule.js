const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require('../qcloud')
	const query = ctx.request.body
  let res = await('Schedule_List').where({id: query.id}).select('title', 'isHoliday')
  var name_table = res[0].title
  var isHoliday = res[0].isHoliday
	var res = await mysql(name_table).select('*').then(res =>{
		ctx.state.data = {res, name_table, isHoliday}
	})
}