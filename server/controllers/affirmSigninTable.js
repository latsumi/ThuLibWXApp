module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	const query = ctx.request.body
	var arr_id = query.id.split(',')
	var num = arr_id.length
	if (num == query.personNum){
		for (var i = 0; i < num; i++) {
			let id = parseInt(arr_id[i])
			let res = await mysql('signin_temp').where({ id: id }).select('*')
			await mysql('signin_fore').insert({ name: res[0].name, studentNum: res[0].studentNum, library: res[0].library, manHour: res[0].manHour, hasExtraWork: query.hasExtraWork, workType: res[0].workType, isLeader: res[0].isLeader, isRelief: res[0].isRelief, whichWeek: query.whichWeek, whatDay: query.whatDay, name_affirm: query.name })
			await mysql('signin_temp').where({ id: id }).del()
		}
		ctx.state.data = "success"
	}else{
		ctx.state.data = "person num not match, please rechoose"
	}
}