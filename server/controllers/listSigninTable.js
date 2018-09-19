// 显示临时签到表列表
module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	let res = await mysql('signin_temp').select('*')
	ctx.state.data = res
}