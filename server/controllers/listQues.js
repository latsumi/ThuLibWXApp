// 显示问卷列表
module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	await mysql("Question_Info").select('*').then(res=> {
		ctx.state.data = res
	})
}