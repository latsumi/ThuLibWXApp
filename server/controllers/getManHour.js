// 根据提交的openid查看工时信息，返回姓名学号、本周上周的签到工时、替班次数、负责班次数
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
	
	let nowres = await DB('signin_fore').select(DB.raw('*')).where(DB.raw(" yearweek(DATE_FORMAT(`update_time`, '%Y-%m-%d'),5) = yearweek(NOW(),5)")).where({name: name, studentNum: studentNum})
	let nownum = nowres.length
	if( nownum != 0){
		for (let i = 0; i < nownum; i++) {
			// 计算本周工时数，替班情况和是否为班负
			nowHour = nowHour + nowres[i].manHour
			nowHelp = nowHelp + nowres[i].isRelief
			nowLeader = nowLeader + nowres[i].isLeader
		}
	}
	let prevres = await DB('signin_fore').select(DB.raw('*')).where(DB.raw(" yearweek(DATE_FORMAT(`update_time`, '%Y-%m-%d'),5) = yearweek(DATE_SUB(NOW(),INTERVAL 7 DAY),5)-1")).where({ name: name, studentNum: studentNum })
	let prevnum = prevres.length
	if (prevnum != 0) {
		for (let i = 0; i < prevnum; i++) {
			// 计算上周工时数，替班情况和是否为班负
			prevHour = prevHour + prevres[i].manHour
			prevHelp = prevHelp + prevres[i].isRelief
			prevLeader = prevLeader + prevres[i].isLeader
		}
	}
	ctx.state.data = {name, studentNum, nowHour, nowHelp, nowLeader, prevHour, prevHelp, prevLeader}
}