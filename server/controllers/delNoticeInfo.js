// 删除公告，根据对应的id删除掉

module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET'){
		const query = ctx.query
		await mysql('Notice_Info').where({ id: query.id }).del()	
		ctx.state.data = query
	}
	if(ctx.method === 'POST'){
		const query = ctx.request.body
		await mysql('Notice_Info').where({ id: query.id }).del()
		ctx.state.data = query
	}
}