// 编写公告信息， 新编写的公告应该为置顶公告的次优先
module.exports = async ctx  => {
	const { mysql } = require('../qcloud')
	if (ctx.method === 'POST'){
		const query = ctx.request.body
		let res = await mysql('Notice_Info').select('*').orderBy('top','desc')
		if(res.length != 0){
			// 如果之前公告列表就有数据
				let toppest = res[0].top
				let toppest_id = res[0].id
				await mysql('Notice_Info').where({id: toppest_id}).update({top: toppest+1})
				await mysql('Notice_Info').insert({ title: query.title, detail: query.detail, top: toppest })
				ctx.state.data = { toppest, toppest_id }
			}
			else{
				// 如果没有，则top值取1
				toppest = 1
				await mysql('Notice_Info').insert({ title: query.title, detail: query.detail, top: toppest })
				let res2 = await mysql('Notice_Info').select('*').orderBy('top', 'desc')
				let toppest_id = res2[0].id
				ctx.state.data = { toppest, toppest_id }
			}
	}
}
