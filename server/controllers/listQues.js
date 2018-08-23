//list question
//method only GET
module.exports = async ctx  => {
//	if (ctx.state.$wxInfo.loginState === 1) {
		const { mysql } = require('../qcloud')
		await mysql("Question_Info").select('*').then(res=> {
			ctx.state.data = res
		})
//  } else {
//	ctx.state.code = -1
//}
}