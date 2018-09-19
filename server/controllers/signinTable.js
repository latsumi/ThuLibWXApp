// 建立签到表
module.exports = async ctx => {
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
		// 如果临时签到表中没有对应成员（同一姓名学号班次）的签到信息，则插入
		await mysql('signin_temp').insert({ name: res[0].name, studentNum: res[0].studentNum, library: query.library, workType: query.workType, manHour: query.manHour, isLeader: query.isLeader, isRelief: query.isRelief })//use infomation in address list
		ctx.state.data = "insert"
	}else{
		// 如果有重复信息，则覆盖，防止重复签到，要求一个班次结束后班负立刻确认签到，否则有信息丢失的风险
		await mysql('signin_temp').where({ name: res[0].name, studentNum: res[0].studentNum, workType:query.workType}).update({ library: query.library, manHour: query.manHour, isLeader: query.isLeader, isRelief: query.isRelief })
		ctx.state.data = "update"
	}
	//	} else {
	//		ctx.state.code = -1
	//	}
}
