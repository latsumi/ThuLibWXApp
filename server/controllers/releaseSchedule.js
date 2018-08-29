module.exports = async ctx => {
  const { mysql } = require('../qcloud')
  const query = ctx.request.body

  var res = await mysql('Schedule_List').where({ id: query.id }).select('title')
  var info = "SUCCESS_PUBLISHED"
  if (res.length != 0) {
    title = res[0].title
    var name_table = "duty_" + res[0].title
    let schedule = await mysql(name_table).select('*')
    for (let i = 0; i < schedule.length; i++) {
      let name = new Array()
      let mem_num = 0
      let hasleader
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
            if(info != "ERR_NO_PERSON"){info = "ERR_NO_LEADER"}
            hasleader = 0
            if (schedule[i].hasleader) {
              await mysql(name_table).where({ id: i+1 }).update({ hasleader: hasleader })
            }
            continue
          } else {
            hasleader = 1
            if (!schedule[i].hasleader) {
              await mysql(name_table).where({ id: i+1 }).update({ hasleader: hasleader })
            }
          }
        } else {
          if (name[j] == null) {
            await mysql(name_table).where({ id: i+1 }).update({ mem_num: mem_num + hasleader })
            if (mem_num + hasleader <= 0){
              info = "ERR_NO_PERSON"
            }
            if(mem_num + hasleader > schedule[i].max_num){
              if (info != "ERR_NO_PERSON") { info = "ERR_EXCEED_LIMIT" }
            }
            break
          } else {
            mem_num = mem_num + 1
          }
        }
      }
    }
    if (info == "SUCCESS_PUBLISHED"){
      if (await mysql('Schedule_List').where({ id: query.id }).update({ isOrigin: 0 })){
        ctx.state.data = {info, name_table}
      }else{
        ctx.state.data = "ERR_SQL_UPDATE"
      }    
    }else{
      ctx.state.data = info
    }
  }else{ // no this id
    ctx.state.data = 0
  }
}