// 根据openid得到对应成员的status信息，包括队员种类和姓名学号库区
module.exports = async ctx => {
	//	if (ctx.state.$wxInfo.loginState === 1) {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET') {
		const query = ctx.query
		let res = await mysql('Address_List').where({openId: query.openId}).select('grade','name','studentNum','library')
		ctx.state.data = res
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
		let res = await mysql('Address_List').where({ openId: query.openId }).select('grade', 'name', 'studentNum', 'library')
		ctx.state.data = res
	}

}
