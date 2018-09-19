// 删除签到信息，根据对应的以逗号隔开的一串id，在临时签到表中删除之，一般在签到错误时进行这项操作
module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	const query= ctx.request.body
	var arr_id = query.id.split(',')
	for(var i=0;i<arr_id.length;i++){
		await mysql('signin_temp').where({id: arr_id[i]}).del()
	}
	ctx.state.data = "success"
}