module.exports = async ctx => {
	//	if (ctx.state.$wxInfo.loginState === 1) {
	const { mysql } = require('../qcloud')
	var query
	/*
	if (ctx.method === 'GET') {
		const query = ctx.query
		await mysql('Notice_Info').insert({ title: query.title, detail: query.detail })
		ctx.state.data = query
	}*/
	if (ctx.method === 'POST') {
		query = ctx.request.body
	}
	let res = await mysql('Address_List').where({openId: query.openId}).select('*')
	let haveIt = await mysql('signin_temp').where({ name: res[0].name, studentNum: res[0].studentNum, workType: query.workType})
	if(haveIt == 0){
		await mysql('signin_temp').insert({ name: res[0].name, studentNum: res[0].studentNum, library: query.library, workType: query.workType, manHour: query.manHour, isLeader: query.isLeader, isRelief: query.isRelief })//use infomation in address list
		ctx.state.data = "insert"
	}else{
		await mysql('signin_temp').where({ name: res[0].name, studentNum: res[0].studentNum, workType:query.workType}).update({ library: query.library, manHour: query.manHour, isLeader: query.isLeader, isRelief: query.isRelief })
		ctx.state.data = "update"
	}
	//	} else {
	//		ctx.state.code = -1
	//	}
}
