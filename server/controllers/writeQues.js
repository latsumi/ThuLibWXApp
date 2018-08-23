//write notice
module.exports = async ctx  => {
	//	if (ctx.state.$wxInfo.loginState === 1) {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET') {
		const query = ctx.query
		await mysql('Question_Info').insert({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose })
		ctx.state.data = query
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
		await mysql('Question_Info').insert({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose })
		ctx.state.data = query
	}
	//	} else {
	//		ctx.state.code = -1
	//	}
}
