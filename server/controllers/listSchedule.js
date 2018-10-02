// 显示排班表，根据排班表在排班表列表中的id信息，如果没有指定id，则显示指定库区的最新的初始排班表
const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require('../qcloud')
	const query = ctx.request.body
  var res
  if(!query.id){
    // 如果没有指定id的话
    res = await mysql('Schedule_List').where({ library: query.library, isOrigin: 0 }).select('title', 'isTwoClass').orderBy('updated_at', 'desc')
  }else{
    res = await mysql('Schedule_List').where({ id: query.id, library: query.library }).select('title', 'isTwoClass')
  }
  if (res.length != 0) {
    title = res[0].title
    var name_table = "duty_" + res[0].title
    let schedule = await mysql(name_table).select('*').orderBy('theClass')
    var isTwoClass = res[0].isTwoClass
    if (isTwoClass) {
      var person = Array(14)
      var classNum = 2
    }else{
      var person = Array(28)
      var classNum = 4
    }
    for (let i = 0; i < person.length; i++) {
      person[i] = ""
    }
    // let person = Array(schedule.length)
    let mem_num
    let hasleader
    var classId
    if(query.id > 8 || !query.id){
      for(let i = 0; i<schedule.length; i++){
        // 在将获得的排班表信息输出时，顺便校正一下排班表中“是否有班负”和“队员数量”等信息
        classId = (schedule[i].theClass[0].charCodeAt(0) - 49) * classNum + (schedule[i].theClass[1].charCodeAt(0) - 65)
        // person[i] = ""
        mem_num = 0
        let leader_name = schedule[i].leader_name
        var member_name = schedule[i].member.split(" ")
        if (leader_name == "lack") {
          hasleader = 0
          if (schedule[i].hasleader) {
            await mysql(name_table).where({ id: schedule[i].id }).update({ hasleader: hasleader })
          }
        } else {
          hasleader = 1
          if (!schedule[i].hasleader) {
            await mysql(name_table).where({ id: schedule[i].id }).update({ hasleader: hasleader })
          }
          person[classId] = person[classId] + leader_name + " "
        }
        for (let j = 0; j < member_name.length; j++) {
          if (member_name[j] == "") {
            continue
          } else {
            mem_num = mem_num + 1
            person[classId] = person[classId] + member_name[j] + " "
          }
        }
        await mysql(name_table).where({ id: schedule[i].id }).update({ mem_num: mem_num + hasleader })
      }
    }else{
      for (let i = 0; i < schedule.length; i++) {
        // 在将获得的排班表信息输出时，顺便校正一下排班表中“是否有班负”和“队员数量”等信息
        person[i] = ""
        mem_num = 0
        let name = new Array()
        name[0] = schedule[i].leader_name
        name[1] = schedule[i].member1_name
        name[2] = schedule[i].member2_name
        name[3] = schedule[i].member3_name
        name[4] = schedule[i].member4_name
        name[5] = schedule[i].member5_name
        name[6] = schedule[i].member6_name
        name[7] = schedule[i].member7_name
        name[8] = schedule[i].member8_name
        name[9] = schedule[i].member9_name
        name[10] = schedule[i].member10_name
        for (let j = 0; j < name.length; j++) {
          if (j == 0) {
            if (name[j] == "lack") {
              hasleader = 0
              if (schedule[i].hasleader) {
                await mysql(name_table).where({ id: i + 1 }).update({ hasleader: hasleader })
              }
              continue
            } else {
              hasleader = 1
              if (!schedule[i].hasleader) {
                await mysql(name_table).where({ id: i + 1 }).update({ hasleader: hasleader })
              }
              person[i] = person[i] + name[j] + " "
            }
          } else {
            if (name[j] == null) {
              await mysql(name_table).where({ id: i + 1 }).update({ mem_num: mem_num + hasleader })
              break
            } else {
              mem_num = mem_num + 1
              person[i] = person[i] + name[j] + " "
            }
          }
        }
      }
    }
    ctx.state.data = { person, title, isTwoClass, classId }
  }else{
    ctx.state.data = 0
  }
}