// 修改问卷
module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'GET'){
		const query = ctx.query
		let res = await mysql('Question_Info').where({ id: query.id }).update({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose, numFilled: 0, hasMinLimit: query.hasMinLimit })	
		ctx.state.data = query
	}
	if (ctx.method === 'POST'){
		const query = ctx.request.body
		let res = await mysql('Question_Info').where({ id: query.id }).update({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose, numFilled: 0, hasMinLimit: query.hasMinLimit })
		ctx.state.data = query
	}
}