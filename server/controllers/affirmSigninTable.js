// 班负确认队员的签到
module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	const query = ctx.request.body
	// 获取前端信息：对应临时签到表(signin_temp)中需要确认项的一串id
	var arr_id = query.id.split(',')
	// 将id分开
	var num = arr_id.length
	if (num == query.personNum){
		for (var i = 0; i < num; i++) {
			let id = parseInt(arr_id[i])
			let res = await mysql('signin_temp').where({ id: id }).select('*')
			await mysql('signin_fore').insert({ name: res[0].name, studentNum: res[0].studentNum, library: res[0].library, manHour: res[0].manHour, hasExtraWork: query.hasExtraWork, workType: res[0].workType, isLeader: res[0].isLeader, isRelief: res[0].isRelief, whichWeek: query.whichWeek, whatDay: query.whatDay, name_affirm: query.name })
			await mysql('signin_temp').where({ id: id }).del()
			// 插入永久表，在临时表中删除
		}
		ctx.state.data = "success"
	}else{
		ctx.state.data = "person num not match, please rechoose"
	}
}