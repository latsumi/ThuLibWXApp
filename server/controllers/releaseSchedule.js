// 发布排班表为终版，针对数据库的操作是修改排班表列表中对应的排班表那一行中isOrigin值为0
/* 检查是否各项均符合标准，通过才能发布
  1. 有班负
  2. 队员数量非0
  3. 队员数量不超过最高限制
  优先级：2 > 1&3 > 成功
*/
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
      // 发布排班表时校验是否有班负、队员数量是否合标准
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
            // 如果没有班负，则发布错误信息
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
              // 如果没有队员（包括班负）
              info = "ERR_NO_PERSON"
            }
            if(mem_num + hasleader > schedule[i].max_num){
              // 超过人数限制
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
      // 成功发布，并修改数据库
      if (await mysql('Schedule_List').where({ id: query.id }).update({ isOrigin: 0 })){
        ctx.state.data = info
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