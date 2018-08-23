const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require('../qcloud')
	const query = ctx.query
	var name_table = "Schedule" + query.id.toString()
	var res = await mysql(name_table).select('*').then(res =>{
		ctx.state.data = res
	})
}