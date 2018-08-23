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

	const query = ctx.request.body
	let info = await mysql('Address_List').where({ openId: query.openId }).select('name', 'studentNum')
	let name = info[0].name
	let studentNum = info[0].studentNum
	let nowHour = 0
	let nowHelp = 0
	let nowLeader = 0
	let prevHour = 0
	let prevHelp = 0
	let prevLeader = 0
	//let res = await mysql('signin_fore').whereRaw('yearweek(DATE_FORMAT(\'update_time\', \'%Y-%m-%d\')) = yearweek(NOW()) - 1').select('*')
	
	let nowres = await DB('signin_fore').select(DB.raw('*')).where(DB.raw(" yearweek(DATE_FORMAT(`update_time`, '%Y-%m-%d')) = yearweek(NOW())")).where({name: name, studentNum: studentNum})
	let nownum = nowres.length
	if( nownum != 0){
		for (let i = 0; i < nownum; i++) {
			nowHour = nowHour + nowres[i].manHour
			nowHelp = nowHelp + nowres[i].isRelief
			nowLeader = nowLeader + nowres[i].isLeader
		}
	}
	let prevres = await DB('signin_fore').select(DB.raw('*')).where(DB.raw(" yearweek(DATE_FORMAT(`update_time`, '%Y-%m-%d')) = yearweek(NOW())-1")).where({ name: name, studentNum: studentNum })
	let prevnum = prevres.length
	if (prevnum != 0) {
		for (let i = 0; i < prevnum; i++) {
			prevHour = prevHour + prevres[i].manHour
			prevHelp = prevHelp + prevres[i].isRelief
			prevLeader = prevLeader + prevres[i].isLeader
		}
	}
	ctx.state.data = {name, studentNum, nowHour, nowHelp, nowLeader, prevHour, prevHelp, prevLeader}
}