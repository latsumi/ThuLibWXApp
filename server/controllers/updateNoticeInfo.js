// 修改公告
/*	公告修改之后应该是仅次于被置顶的公告而显示出来的
	原有置顶公告的top值加一
	修改的公告设置为该top
*/
module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET'){
		const query = ctx.query
		let toppest_res = await mysql('Notice_Info').select('*').orderBy('top', 'desc')
		let toppest = toppest_res[0].top
		let toppest_id = toppest_res[0].id
		await mysql('Notice_Info').where({ id: toppest_id }).update({ top: toppest + 1 })
		let res = await mysql('Notice_Info').where({ id: query.id }).update({ title: query.title, detail: query.detail, top: toppest })
		ctx.state.data = query
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
		let toppest_res = await mysql('Notice_Info').select('*').orderBy('top', 'desc')
		let toppest = toppest_res[0].top
		let toppest_id = toppest_res[0].id
		await mysql('Notice_Info').where({ id: toppest_id }).update({ top: toppest + 1 })
		let res = await mysql('Notice_Info').where({ id: query.id }).update({ title: query.title, detail: query.detail, top: toppest })
		ctx.state.data = query
	}
}
