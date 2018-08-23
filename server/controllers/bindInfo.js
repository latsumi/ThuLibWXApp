module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	var query = ctx.request.body
	var return_value
	var res = await mysql('Address_List').where({name: query.name, studentNum: query.studentNum})
	if(res != 0){
		if (res[0].grade != 4){
			await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).update({openId: query.openId})
			let info = await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).select('name','library','grade')
			return_value = info
		}else{
			if(res[0].secretKey == query.secretKey){
				await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).update({ openId: query.openId })
				let info = await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).select('name', 'library', 'grade')
				return_value = info
			}else{
				return_value = "wrong secretKey"
			}
		}
	}else{
		return_value = "no info"
	}
	ctx.state.data = return_value
}