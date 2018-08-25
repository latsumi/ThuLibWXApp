//write notice
module.exports = async ctx  => {
//	if (ctx.state.$wxInfo.loginState === 1) {
		const { mysql } = require('../qcloud')
		if (ctx.method === 'POST'){
			const query = ctx.request.body
			if(res = await mysql('Notice_Info').select('*').orderBy('top','desc')){
        let toppest = res[0].top
        let toppest_id = res[0].id
        await mysql('Notice_Info').where({id: toppest_id}).update({top: toppest+1})
        await mysql('Notice_Info').insert({ title: query.title, detail: query.detail, top: toppest })
        ctx.state.data = { toppest, toppest_id }
      }
      else{
        toppest = 1
        await mysql('Notice_Info').insert({ title: query.title, detail: query.detail, top: toppest })
        res = await mysql('Notice_Info').select('*').orderBy('top', 'desc')
        let toppest_id = res[0].id
        ctx.state.data = { toppest, toppest_id }
      }
		}
		
		
//	} else {
//		ctx.state.code = -1
//	}
}
