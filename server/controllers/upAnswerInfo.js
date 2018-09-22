// 提交对应问卷的答案
const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require ('../qcloud')
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
	var name_table = "QuestionAnswer" + query.id.toString()
	// 建立对应问卷的答卷数据表
	if(query.isClass == 1){
		await DB.schema.hasTable(name_table).then(function (exists) {
			if (!exists) {
				return DB.schema.createTable(name_table, function (table) {
					table.increments('id');
					table.string('name', 30).notNullable();
					table.string('studentNum', 30).notNullable();
					table.string('library', 30).notNullable();
					table.string('status', 30).notNullable();
					table.boolean('isClass').notNullable();
					table.string('answer', 2048);
					table.boolean('hasWork').notNullable();
					table.string('remark', 1024);
				});
			}
		});
		/*
		await DB.schema.hasColumn('Address_List','openId').then(function(exists){
			if(!exists){
				return DB.schema.table('Address_List',function(table){
					table.string('openId',512);
				});
			}
		});
		await DB.schema.hasColumn('Address_List', 'grade').then(function (exists) {
			if (!exists) {
				return DB.schema.table('Address_List', function (table) {
					table.string('grade', 10);
				});
			}
		})*/;
	//do a judge by isClass, for "answer"
		// let res = await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum}).update({ grade: query.status})//pay attention
		let res = await mysql('Address_List').where({name: query.name, studentNum: query.studentNum}).select('*')
		let haveIt = await mysql(name_table).where({ name: query.name, studentNum: query.studentNum, library: query.library })
		if (res.length != 0){
			if(haveIt == 0){
				// 如果对应队员没有填过问卷，插入，匹配问卷提交的队员类型和通讯录中的grade值，匹配成功才可以
				if((query.library == res[0].library && res[0].library != 2) || res[0].library == 2){
					// 库区的限制，问卷填写的库区要匹配队员在通讯录中的库区
					if ((res[0].grade == 2 && query.status > 0) || (res[0].grade > 2 && query.status == 0)){
						await mysql(name_table).insert({ name: query.name, studentNum: query.studentNum, library: query.library, status: query.status, isClass: query.isClass, answer: query.answer, hasWork: query.hasWork, remark: query.remark })
						let num = await mysql('Question_Info').where({ id: query.id }).select('numFilled')
						let n = num[0].numFilled + 1
						// 更新问卷填写数量
						await mysql('Question_Info').where({ id: query.id }).update({ numFilled: n })
						ctx.state.data = "SUCCESS_FILLED"
					}else{
						ctx.state.data = "ERR_WRONG_GRADE"
					}
					
				}else{
					ctx.state.data = "ERR_WRONG_LIBRARY"
				}
			}else{
				// 队员填过问卷，更新
				await mysql(name_table).where({ name: query.name, studentNum: query.studentNum, library: query.library }).update({ status: query.status,  isClass: query.isClass,  answer: query.answer, hasWork: query.hasWork, remark: query.remark })
				ctx.state.data = "SUCCESS_FILLED"
			}
		}else{
			ctx.state.data = "ERR_WRONG_INFO"
		}
	} else{
		await DB.schema.hasTable(name_table).then(function (exists) {
			if (!exists) {
				return DB.schema.createTable(name_table, function (table) {
					table.increments('id');
					table.string('name', 30).notNullable();
					table.string('studentNum', 30).notNullable();
					table.string('library', 30).notNullable();
					table.string('status', 30).notNullable();
					table.boolean('isClass').notNullable();
					table.string('answer', 2048);
					table.string('remark', 1024);
				});
			}
		});
		/*
		await DB.schema.hasColumn('Address_List','openId').then(function(exists){
			if(!exists){
				return DB.schema.table('Address_List',function(table){
					table.string('openId',512);
				});
			}
		});
		await DB.schema.hasColumn('Address_List', 'grade').then(function (exists) {
			if (!exists) {
				return DB.schema.table('Address_List', function (table) {
					table.string('grade', 10);
				});
			}
		})*/;
	//do a judge by isClass, for "answer"
		// let res = await mysql('Address_List').where({ name: query.name, studentNum: query.studentNum}).update({ grade: query.status})//pay attention
		let res = await mysql('Address_List').where({name: query.name, studentNum: query.studentNum}).select('*')
		let haveIt = await mysql(name_table).where({ name: query.name, studentNum: query.studentNum, library: query.library })
		if (res.length != 0){
			if(haveIt == 0){
				// 如果对应队员没有填过问卷，插入，匹配问卷提交的队员类型和通讯录中的grade值，匹配成功才可以
				if((query.library == res[0].library && res[0].library != 2) || res[0].library == 2){
					// 库区的限制，问卷填写的库区要匹配队员在通讯录中的库区
					if ((res[0].grade == 2 && query.status > 0) || (res[0].grade > 2 && query.status == 0)){
						await mysql(name_table).insert({ name: query.name, studentNum: query.studentNum, library: query.library, status: query.status, isClass: query.isClass, answer: query.answer, remark: query.remark })
						let num = await mysql('Question_Info').where({ id: query.id }).select('numFilled')
						let n = num[0].numFilled + 1
						// 更新问卷填写数量
						await mysql('Question_Info').where({ id: query.id }).update({ numFilled: n })
						ctx.state.data = "SUCCESS_FILLED"
					}else{
						ctx.state.data = "ERR_WRONG_GRADE"
					}
				}else{
					ctx.state.data = "ERR_WRONG_LIBRARY"
				}
			}else{
				// 队员填过问卷，更新
				await mysql(name_table).where({ name: query.name, studentNum: query.studentNum, library: query.library }).update({ status: query.status,  isClass: query.isClass,  answer: query.answer, remark: query.remark })
				ctx.state.data = "SUCCESS_FILLED"
			}
			
		}else{
			ctx.state.data = "ERR_WRONG_INFO"
		}
	}
}