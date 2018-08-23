module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	//const query = ctx.query
	let res = await mysql('signin_temp').select('*')
	ctx.state.data = res
}