const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require('../qcloud')
	const DB = require('knex')({
		client: 'mysql',
		connection: {
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.pass,
			database: config.db,
			charset: config.char,
			multipleStatements: true
		}
	})

	var query;
	if (ctx.method === 'GET') {
		query = ctx.query
	}
	if (ctx.method === 'POST') {
		query = ctx.request.body
	}

	var name_table = "Schedule" + query.id.toString()
	//var name_table = query.name
	let classes_to_choose = await mysql('Question_Info').where({id: query.id}).select('canIChoose')
	
	//must exist the question info
	//The formatting requirements of the parse are too high
	if (classes_to_choose == 0){
		ctx.state.data = "不存在该问卷"
	}
	else {
		var a = JSON.stringify(classes_to_choose)
		var arr = a.toString().split("\"")
		if (arr[2] == ":null}]"){
			ctx.state.data = "该问卷不存在可选班次"
		} else {
			var array = arr[3].split(",")
			
			await DB.schema.hasTable(name_table).then(function (exists) {
				if (!exists) {
					return DB.schema.createTable(name_table, function (table) {
						table.increments('id');
						table.string('theClass',100).notNullable();
						table.integer('mem_num', 11);//the number of teammember
						table.boolean('hasleader');
						table.string('leader_name',30);
						table.string('leader_studentNum', 30);
						table.string('member1_name', 30);
						table.string('member1_studentNum', 30);
						table.string('member2_name', 30);
						table.string('member2_studentNum', 30);
						table.string('member3_name', 30);
						table.string('member3_studentNum', 30);
						table.string('member4_name', 30);
						table.string('member4_studentNum', 30);
						table.string('member5_name', 30);
						table.string('member5_studentNum', 30);
						table.string('member6_name', 30);
						table.string('member6_studentNum', 30);
						table.string('member7_name', 30);
						table.string('member7_studentNum', 30);
						table.string('member8_name', 30);
						table.string('member8_studentNum', 30);
						table.string('member9_name', 30);
						table.string('member9_studentNum', 30);
						table.string('member10_name', 30);
						table.string('member10_studentNum', 30);
					});
				}
			});
			for (var i=0; i<array.length;i++){
				await mysql(name_table).insert({ theClass: array[i] });
			}

			var answer_table = "QuestionAnswer" + query.id.toString()
			let res = await mysql(answer_table).where({library: query.library}).select('*')
			

			//根据res解析出同学姓名&学号&status&classes调用排班算法进行排班
			//------------------------------------------------------------------
			//待补充
			//------------------------------------------------------------------

			//将排班结果按班次&leader&member存入schedule中
			//------------------------------------------------------------------
			//await mysql(name_table).where({ theClass: theclass }).update()	//待补充
			//------------------------------------------------------------------
			ctx.state.data = { query, classes_to_choose, a, arr, array, res }
		}
	}
}