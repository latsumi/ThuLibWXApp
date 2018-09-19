// 根据姓名和学号，获得通讯录的信息
module.exports = async ctx => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET') {
		const query = ctx.query
		let res = await mysql('Address_List').whereIn( 'library', [query.library, 2] ).select('name', 'studentNum')
		ctx.state.data = res
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
		let res = await mysql('Address_List').whereIn( 'library', [query.library, 2] ).select('name', 'studentNum')
		ctx.state.data = res
	}
}
