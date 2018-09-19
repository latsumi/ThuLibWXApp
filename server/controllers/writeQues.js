// 编写问卷
const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')
module.exports = async ctx  => {
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
	// 创建问卷列表
	await DB.schema.hasTable('Question_Info').then(function (exists) {
		if (!exists) {
			return DB.schema.createTable('Question_Info', function (table) {
				table.increments('id');
				table.string('title', 512).notNullable();
				table.string('descript', 1024);
				table.string('detail', 1024);
				table.integer('isClass').notNullable();
				table.string('canIChoose', 2048);
				table.integer('numFilled', 11).defaultTo(0);
				table.boolean('hasMinLimit');
			});
		}
	});
	if (ctx.method === 'GET') {
		const query = ctx.query
		await mysql('Question_Info').insert({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose, numFilled: 0, hasMinLimit: query.hasMinLimit })
		ctx.state.data = query
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
    await mysql('Question_Info').insert({ title: query.title, descript: query.descript, detail: query.detail, isClass: query.isClass, canIChoose: query.canIChoose, numFilled: 0, hasMinLimit: query.hasMinLimit })
		ctx.state.data = query
	}
}
