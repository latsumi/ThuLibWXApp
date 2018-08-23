module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	const query= ctx.request.body
	var arr_id = query.id.split(',')
	for(var i=0;i<arr_id.length;i++){
		await mysql('signin_temp').where({id: arr_id[i]}).del()
	}
	ctx.state.data = "success"
}