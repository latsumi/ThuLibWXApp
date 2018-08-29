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
	//var name_table = query.name

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
			});/*.then(res => {
				process.exit()
				//ctx.state.data = {query,name_table}
			})*/
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
      if((query.library == res.library && res.library != 2) || res.library == 2){
        await mysql(name_table).insert({ name: query.name, studentNum: query.studentNum, library: query.library, status: query.status, isClass: query.isClass, answer: query.answer })
        let num = await mysql('Question_Info').where({ id: query.id }).select('numFilled')
        let n = num[0].numFilled + 1
        await mysql('Question_Info').where({ id: query.id }).update({ numFilled: n })
      }
		}else{
      await mysql(name_table).where({ name: query.name, studentNum: query.studentNum, library: query.library }).update({ status: query.status,  isClass: query.isClass,  answer: query.answer })
		}
    ctx.state.data = res
	}else{
    ctx.state.data = "no this member"
  }
}