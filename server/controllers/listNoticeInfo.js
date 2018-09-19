// 显示公告信息，使用GET方式，按照优先级的高低显示
module.exports = async (ctx, next) => {
	const { mysql } = require('../qcloud')
	await mysql("Notice_Info").select('*').orderBy('top', 'desc').then(res=> {
		ctx.state.data = res
	})
}

