const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

module.exports = async ctx => {
	const { mysql } = require('../qcloud')

	const query = ctx.request.body
  var res
  if(!query.id){
    res = await mysql('Schedule_List').where({ library: query.library }).select('title', 'isHoliday').orderBy('updated_at', 'desc')
  }else{
    res = await mysql('Schedule_List').where({ id: query.id, library: query.library }).select('title', 'isHoliday')
  }
  if (res.length != 0) {
    title = res[0].title
    var name_table = "duty_" + res[0].title
    let schedule = await mysql(name_table).select('*')
    var isHoliday = res[0].isHoliday
    let person = Array(schedule.length)
    let mem_num
    let hasleader
    for(let i = 0; i<schedule.length; i++){
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
      for (let j = 0; j<name.length; j++){
        if(j == 0){
          if(name[j] == "lack"){
            hasleader = 0
            if(schedule[i].hasleader){
              await mysql(name_table).where({ id: i+1 }).update({ hasleader: hasleader })
            }
            continue
          }else{
            hasleader = 1
            if (!schedule[i].hasleader) {
              await mysql(name_table).where({ id: i+1 }).update({ hasleader: hasleader })
            }
            person[i] = person[i] + name[j] + " "
          }
        }else{
          if (name[j] == null) {
            await mysql(name_table).where({ id: i+1 }).update({ mem_num: mem_num+hasleader })
            break
          } else {
            mem_num = mem_num + 1
            person[i] = person[i] + name[j] + " "
          }
        }
      }
    }
    ctx.state.data = { person, title, isHoliday }
  }else{
    ctx.state.data = 0
  }
}