// 置顶公告
/* 设置一项为优先级指标top
	按照倒序得到公告的优先级，以最高优先级的top值+1作为要置顶的公告的top值
*/
module.exports  = async ctx =>{
	const {mysql} = require('../qcloud')
	const query = ctx.request.body
	let toppest_res = await mysql('Notice_Info').select('*').orderBy('top','desc')
	let toppest_id = toppest_res[0].id
	let toppest = toppest_res[0].top
	await mysql('Notice_Info').where({id: query.id}).update({top: toppest+1})
	let res = await mysql("Notice_Info").where({id: query.id}).select('*')
	ctx.state.data = res
}