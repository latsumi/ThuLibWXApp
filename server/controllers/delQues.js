//delete question
module.exports = async ctx  => {
//	if (ctx.state.$wxInfo.loginState === 1) {
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

		
//	} else {
//		ctx.state.code = -1
//	}
}