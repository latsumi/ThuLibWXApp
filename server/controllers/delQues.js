// 删除问卷，根据对应的问卷id，要注意对于排班问卷，删除问卷意味着不能够获取对应问卷的可选班次信息，会出现错误
module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET'){
		const query = ctx.query
		await mysql('Question_Info').where({ id: query.id }).del()
		ctx.state.data = query
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
		await mysql('Question_Info').where({ id: query.id }).del()
		ctx.state.data = query
	}
}