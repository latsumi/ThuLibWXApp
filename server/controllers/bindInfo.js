// 绑定信息，
module.exports = async ctx =>{
	const {mysql} = require('../qcloud')
	var query = ctx.request.body
	// 获取前端信息，输入name, studentNum，在通讯录中查找对应的人的信息。
	var return_value
	var res = await mysql('Address_List').where({name: query.name, studentNum: query.studentNum})
	if(res != 0){
		if (res[0].grade != 4){
			// 如果等级不是4，只更新openId
			await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).update({openId: query.openId})
			let info = await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum }).select('name','library','grade')
			return_value = info
		}else{
			// 如果等级为4，验证密码，再更新openId
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