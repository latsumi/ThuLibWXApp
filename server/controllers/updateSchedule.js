//update question
module.exports = async ctx => {
	//	if (ctx.state.$wxInfo.loginState === 1) {
	const { mysql } = require('../qcloud')

	if (ctx.method === 'GET') {
		const query = ctx.query
		
	}
	if (ctx.method === 'POST') {
		const query = ctx.request.body
  }
  let res_list = await ('Schedule_List').where({ id: query.id }).select('title')
  var name_table = res_list[0].title
  var num;
  var res;
  //--------------------------
  if (query.operator == '0') {// delete
    if(query.status == '1') {// del leader
      await mysql(name_table).where({ theClass: query.theClass }).update({ leader_name: null, leader_studentNum: null, hasleader: 0 });
    }
    else {
      res = await mysql(name_table).where({ theClass: query.theClass }).select('*')
      num = res[0].num
      var name = new Array()
      var studentNum = new Array()
      name[0] = res[0].member1_name
      studentNum[0] = res[0].member1_studentNum
      name[1] = res[0].member2_name
      studentNum[1] = res[0].member2_studentNum
      name[2] = res[0].member3_name
      studentNum[2] = res[0].member3_studentNum
      name[3] = res[0].member4_name
      studentNum[3] = res[0].member4_studentNum
      name[4] = res[0].member5_name
      studentNum[4] = res[0].member5_studentNum
      name[5] = res[0].member6_name
      studentNum[5] = res[0].member6_studentNum
      name[6] = res[0].member7_name
      studentNum[6] = res[0].member7_studentNum
      name[7] = res[0].member8_name
      studentNum[7] = res[0].member8_studentNum
      name[8] = res[0].member9_name
      studentNum[8] = res[0].member9_studentNum
      name[9] = res[0].member10_name
      studentNum[9] = res[0].member10_studentNum
      name[10] = null
      studentNum[10] = null
      for (var i = 0; i < num; i++) {
        if (name[i] == query.name && studentNum[i] == query.studentNum) {
          for (var j = i; j < num; i++) {
            name[j] = name[j + 1];
            studentNum[j] = studentNum[j + 1];
          }
          break;
        }
      }
      num = num - 1;
      await mysql(name_table).where({ theClass: query.theClass }).update({
        num: num,
        member1_name: name[0], member1_studentNum: studentNum[0],
        member2_name: name[1], member2_studentNum: studentNum[1],
        member3_name: name[2], member3_studentNum: studentNum[2],
        member4_name: name[3], member4_studentNum: studentNum[3],
        member5_name: name[4], member5_studentNum: studentNum[4],
        member6_name: name[5], member6_studentNum: studentNum[5],
        member7_name: name[6], member7_studentNum: studentNum[6],
        member8_name: name[7], member8_studentNum: studentNum[7],
        member9_name: name[8], member9_studentNum: studentNum[8],
        member10_name: name[9], member10_studentNum: studentNum[9]
      });
    }
  }
  else { //add
    if (query.status == '1'){
      await mysql(name_table).where({ theClass: query.theClass }).update({ leader_name: query.name, leader_studentNum: query.studentNum, hasleader: 1 });
    }
    else {
      let n = await mysql(name_table).where({ theClass: query.theClass }).select('num')
      switch (n[0].num) {
        case 0: await mysql(name_table).where({ theClass: query.theClass }).update({ member1_name: query.name, member1_studentNum: query.studentNum }); break;
        case 1: await mysql(name_table).where({ theClass: query.theClass }).update({ member2_name: query.name, member2_studentNum: query.studentNum }); break;
        case 2: await mysql(name_table).where({ theClass: query.theClass }).update({ member3_name: query.name, member3_studentNum: query.studentNum }); break;
        case 3: await mysql(name_table).where({ theClass: query.theClass }).update({ member4_name: query.name, member4_studentNum: query.studentNum }); break;
        case 4: await mysql(name_table).where({ theClass: query.theClass }).update({ member5_name: query.name, member5_studentNum: query.studentNum }); break;
        case 5: await mysql(name_table).where({ theClass: query.theClass }).update({ member6_name: query.name, member6_studentNum: query.studentNum }); break;
        case 6: await mysql(name_table).where({ theClass: query.theClass }).update({ member7_name: query.name, member7_studentNum: query.studentNum }); break;
        case 7: await mysql(name_table).where({ theClass: query.theClass }).update({ member8_name: query.name, member8_studentNum: query.studentNum }); break;
        case 8: await mysql(name_table).where({ theClass: query.theClass }).update({ member9_name: query.name, member9_studentNum: query.studentNum }); break;
        case 9: await mysql(name_table).where({ theClass: query.theClass }).update({ member10_name: query.name, member10_studentNum: query.studentNum }); break;
        default: break;
      }
      num = n[0].num + 1;
      await mysql(name_table).where({ theClass: query.theClass }).update({ num: num });
    }
  }
  ctx.state.data = {res, num};

	//	} else {
	//		ctx.state.code = -1
	//	}*/
	// ctx.state.data = "why break?"
}