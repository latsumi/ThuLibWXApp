const fs = require('fs')
const path = require('path')
const { mysql: config } = require('../config')

var res
var info = " "
var mem = new Array();
var class_s_info = new Array(29);
var schedule = new Array(29);
var class_ = new Array(29);
/*排班逻辑
		将队员、班负根据不用的库区分开，先其num存到不同的数组当中
		先安排班负，在排队员
		优先老队员、女队员、选着余地小的
		排序 根据参考数有小到大排序
		参考数 （可选的班/需要的班） + 队员类型 + 性别
		排序时间
		排班每一个班前、每个队员排完所有班后
*/
class member {
	constructor(name, num, studentNum, status, signup_class, signup_class_num,CanBeChoose) {
		this.name = name;
		this.num = num;
		this.studentNum = studentNum;
		this.status = status; //0：班负1：老队员2：新队员
		this.signup_class = signup_class;//用signup_class[0]记录报班个数
		this.signup_class_num = signup_class_num;
		this.class_choice = signup_class;//用class_choice[0]记录可选班的个数
		this.class_choice_num = signup_class_num;
		this.need_class_num = 3;
		this.pow = (signup_class_num / 3) + status;//排序的选择优先的参考数
		this.CanBeChoose = CanBeChoose;
	}
}

class classes {
	constructor(class_name, class_num) {
		this.class_name = class_name;
		this.class_mem = new Array();
		this.mem_num = 0;
		this.leader = 0;
		this.class_num = class_num;
		this.hasLeader = 0;
		this.finish = 0;
	}
}

class class_signup_info {
	constructor(class_name, class_num, need_mem) {
		this.class_name = class_name;
		this.class_num = class_num;
		this.signup_mem = new Array();
		this.signup_mem_num = 0;
		this.mem_choice = new Array();
		this.mem_choice_num = 0;
		this.leader_choice = new Array();
		this.leader_choice_num = 0;
		this.need_mem = need_mem;
		this.pow = 0;
	}
}

class for_show{
	constructor(class_name, class_mem)
	{
		this.class_name = class_name;
		this.class_mem = class_mem;
	}
}

//var leader = new Array(11);
//var team_mem = new Array( );

function get_info_and_schedule() {
	for (var i = 1; i < 29; i++) {
		var need_mem;
		class_[i] = i;
		switch (i) {
			case 2:
			case 6:
			case 7:
			case 10:
			case 11:
			case 14:
			case 15:
			case 18:
			case 19:
			case 21:
			case 22:
			case 23:
			case 25:
			case 26:
			case 27:
				need_mem = 6;
				break;
			case 4:
			case 8:
			case 12:
			case 16:
			case 20:
			case 24:
			case 28:
				need_mem = 7;
				break;
			case 1:
			case 5:
			case 9:
			case 13:
			case 17:
				need_mem = 4;
				break;
		}
		var class_name;
		switch (i)
		{
			case 1:
				class_name = '1A';
				break;
			case 2:
				class_name = '1B';
				break;
			case 3:
				class_name = '1C';
				break;
			case 4:
				class_name = '1D';
				break;
			case 5:
				class_name = '2A';
				break;
			case 6:
				class_name = '2B';
				break;
			case 7:
				class_name = '2C';
				break;
			case 8:
				class_name = '2D';
				break;
			case 9:
				class_name = '3A';
				break;
			case 10:
				class_name = '3B';
				break;
			case 11:
				class_name = '3C';
				break;
			case 12:
				class_name = '3D';
				break;
			case 13:
				class_name = '4A';
				break;
			case 14:
				class_name = '4B';
				break;
			case 15:
				class_name = '4C';
				break;
			case 16:
				class_name = '4D';
				break;
			case 17:
				class_name = '5A';
				break;
			case 18:
				class_name = '5B';
				break;
			case 19:
				class_name = '5C';
				break;
			case 20:
				class_name = '5D';
				break;
			case 21:
				class_name = '6A';
				break;
			case 22:
				class_name = '6B';
				break;
			case 23:
				class_name = '6C';
				break;
			case 24:
				class_name = '6D';
				break;
			case 25:
				class_name = '7A';
				break;
			case 26:
				class_name = '7B';
				break;
			case 27:
				class_name = '7C';
				break;
			case 28:
				class_name = '7D';
				break;
		}
		class_s_info[i] = new class_signup_info(class_name, i, need_mem);
		//(class_num, signup_mem, signup_mem_num, mem_choice, mem_choice_num, need_mem)
		schedule[i] = new classes(class_name, i);
	}
	mem[0] = new member('', 0, '', 3, '', 0);
	// for (var i = 0; i < res.status.length; i++) {
	for (var i = 0; i < res.length; i++) {

		var studentNum = res[i].studentNum;
		var signup_class = new Array();
		var name = res[i].name;
		var status = res[i].status;
		var k = 1;
		var t = 0;
		var CanBeChoose = new Array(29);
		for(var j = 1; j < 29; j++)
			CanBeChoose[j] = 0;
		var clas = res[i].answer.split(",");
		for (var j = 0; j <clas.length; j++) {
			switch (clas[j][1]) {
				case 'A':
					t = 1;
					break;
				case 'B':
					t = 2;
					break;
				case 'C':
					t = 3;
					break;
				case 'D':
					t = 4;
					break;
			}
			var  class_num = (clas[j][0] - 1) * 4 + t;
			CanBeChoose[class_num] = 1;
			signup_class[k] = class_num;
			k++;
			t = 0;
		}
		mem[i+1] = new member(name, i+1, studentNum,status, signup_class, k, CanBeChoose);
		//(name, num, studentNum, status, signup_class, signup_class_num)
	}

	for (var i = 1; i < mem.length; i++) {
		if(mem[i].status != 0) {
			for (var j = 1; j < mem[i].signup_class_num; j++) {
				var c = mem[i].signup_class[j];
				class_s_info[c].signup_mem_num++;
				class_s_info[c].mem_choice_num++;
				class_s_info[c].signup_mem[class_s_info[c].signup_mem_num] = i;
				class_s_info[c].mem_choice[class_s_info[c].mem_choice_num] = i;
			}
		}
		else
		{
			for (var j = 1; j < mem[i].signup_class_num; j++) {
				var c = mem[i].signup_class[j];
				class_s_info[c].leader_choice_num++;
				class_s_info[c].leader_choice[class_s_info[c].leader_choice_num] = i;
				class_s_info[c].signup_mem_num++;
				class_s_info[c].mem_choice_num++;
				class_s_info[c].signup_mem[class_s_info[c].signup_mem_num] = i;
				class_s_info[c].mem_choice[class_s_info[c].mem_choice_num] = i;
			}
		}
	}

	sort_class_by_leader(class_, 1);
	arrange_leader();
	//arrange_leader_as_mem();
	sort_class_by_mem(class_, 1);
	arrange_member();

	// console.log(schedule);

	for(var i = 1; i < 29; i++)
	{
		if(class_s_info[i].need_mem == 0)
		{
			if(class_s_info[i].mem_choice_num > 0)
			{
				info = info + class_s_info[i].class_name + "已满，还报了这个班但没被排上的人有"
				// console.log(class_s_info[i].class_name + "已满，还报了这个班但没被排上的人有");
				for (var j = 1; j < class_s_info[i].mem_choice.length; j++)
					if (mem[class_s_info[i].mem_choice[j]].CanBeChoose[i] == 2)
						info = info + mem[class_s_info[i].mem_choice[j]].name
						// console.log(mem[class_s_info[i].mem_choice[j]].name);
			}
		}
		else
		{
			if(class_s_info[class_[i]].mem_choice_num > 0)
			{
				info = info + class_s_info[i].class_name + "未满，报了这个班但没排上的人有"
				// console.log(class_s_info[i].class_name + "未满，报了这个班但没排上的人有");
				for (var j = 1; j < class_s_info[i].mem_choice.length; j++)
					if (mem[class_s_info[i].mem_choice[j]].CanBeChoose[i] == 2)
						info = info + mem[class_s_info[i].mem_choice[j]].name
						// console.log(mem[class_s_info[i].mem_choice[j]].name);
			}
		}
	}
}

function sort_leader(arr) {
  for(var i = 1; i < arr.length; i++)
    if(mem[arr[i]].class_choice_num != 0)
      mem[arr[i]].pow  = mem[arr[i]].class_choice_num - mem[arr[i]].need_class_num;
    else
      mem[arr[i]].pow = 0;
  for (var i = 1; i < arr.length; i++)
	for (var j = i + 1; j < arr.length; j++) {
		if (mem[arr[i]].pow > mem[arr[j]].pow) {
			var temp;
			temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
	}
}

function sort_mem(arr) {
  for (var i = 1; i < arr.length; i++) {
    if (mem[arr[i]].need_class_num == 0)
      mem[arr[i]].pow = 0;
    else
      mem[arr[i]].poew =
        mem[arr[i]].class_choice_num - mem[arr[i]].need_class_num
        + mem[arr[i]].status;
  }
  for (var i = 1; i < arr.length; i++)
    for (var j = i + 1; j < arr.length; j++)
      if (mem[arr[i]].pow > mem[arr[j]].pow) {
        var temp;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
}

function sort_class_by_mem(arr,s) {
  for (var i = s; i < arr.length; i++)
    class_s_info[arr[i]].pow
      = class_s_info[arr[i]].mem_choice_num - class_s_info[arr[i]].need_mem;
  for (var i = s; i < arr.length; i++)
    for (var j = i + 1; j < arr.length; j++)
      if (class_s_info[arr[i]].pow > class_s_info[arr[j]].pow) {
        var temp;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
}

function sort_class_by_leader(arr, s) {
  for (var i = s; i < arr.length; i++)
    for (var j = i + 1; j < arr.length; j++)
      if (class_s_info[arr[i]].leader_choice_num >
        class_s_info[arr[j]].leader_choice_num) {
        var temp;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
}

function arrange_leader( ) {
  for (var i = 1; i < class_.length; i++) {
    if (class_s_info[class_[i]].leader_choice_num == 0 || schedule[class_[i]].hasLeader == 1) {
      if (class_s_info[class_[i]].leader_choice_num == 0)
        schedule[class_[i]].leader = "lack";
      //console.log(class_s_info[class_[i]].name + "没有班负");
      continue;
    }
    else {
      sort_leader(class_s_info[class_[i]].leader_choice);
      for (var j = 1; j < class_s_info[class_[i]].leader_choice.length; j++) {
        var leader = class_s_info[class_[i]].leader_choice[j];
        if (mem[leader].CanBeChoose[class_[i]] == 1) {
          schedule[class_[i]].leader
            = mem[class_s_info[class_[i]].leader_choice[j]].name;
          schedule[class_[i]].hasLeader = 1;
          mem[leader].need_class_num--;
          mem[leader].class_choice_num--;
          mem[leader].CanBeChoose[class_[i]] = 0;
          class_s_info[class_[i]].mem_choice_num--;
          if (mem[leader].need_class_num == 0) {
            for (j = 0; j < mem[leader].signup_class.length; j++) {
              if (mem[leader].CanBeChoose[mem[leader].signup_class[j]] == 1) {
                class_s_info[mem[leader].signup_class[j]].leader_choice_num--;
                class_s_info[mem[leader].signup_class[j]].mem_choice_num--;
                mem[leader].CanBeChoose[mem[leader].signup_class[j]] = 0;
              }
            }
            sort_class_by_leader(class_, i + 1);
          }
          break;
        }
      }
    }
  }
}

function arrange_member() {
  for (var i = 1; i < class_.length; i++) {
    sort_mem(class_s_info[class_[i]].mem_choice);
    var choose = class_s_info[class_[i]].mem_choice.length;
    for (var j = 1; j < choose && j < 5; j++) {
      var mem_ = class_s_info[class_[i]].mem_choice[j];
      if (mem[mem_].CanBeChoose[class_[i]] == 1) {
        schedule[class_[i]].mem_num++;
        var t = schedule[class_[i]].mem_num;
        schedule[class_[i]].class_mem[t] = mem[mem_].name;
        mem[mem_].class_choice_num--;
        mem[mem_].need_class_num--;
        mem[mem_].CanBeChoose[class_[i]] = 0;
        class_s_info[class_[i]].need_mem--;
        class_s_info[class_[i]].mem_choice_num--;
        if (mem[mem_].class_choice_num == mem[mem_].need_class_num) {
          for (var k = 1; k < mem[mem_].signup_class.length; k++) {
            var c = mem[mem_].signup_class[k];
            if (mem[mem_].CanBeChoose[c] == 1) {
              if (class_s_info[c].need_mem > 0) {
                schedule[c].mem_num++;
                t = schedule[c].mem_num;
                schedule[c].class_mem[t] = mem[mem_].name;
                class_s_info[c].mem_choice_num--;
                class_s_info[c].need_mem--;
                mem[mem_].need_class_num--;
                mem[mem_].class_choice_num--;
              }
              mem[mem_].CanBeChoose[c] = 0;
            }
          }
          mem[mem_].pow = 0;
        }
        if (mem[mem_].need_class_num == 0) {
          for (var k = 1; k < mem[mem_].signup_class.length; k++) {
            var c = mem[mem_].signup_class[k];
            if (mem[mem_].CanBeChoose[c] == 1) {
              if (class_s_info[c].need_mem > 0)
                class_s_info[c].mem_choice_num--;
              mem[mem_].CanBeChoose[c] = 2;
            }
          }
        }
      }
    }
    sort_class_by_mem(class_, i + 1);
  }
  for (var i = 1; i < class_.length; i++) {
    sort_mem(class_s_info[class_[i]].mem_choice);
    j = 1;
    var choose = class_s_info[class_[i]].mem_choice.length;
    while (class_s_info[class_[i]].need_mem > 0 && j < choose) {
      var mem_ = class_s_info[class_[i]].mem_choice[j];
      if (mem[mem_].CanBeChoose[class_[i]] == 1) {
        var mem_ = class_s_info[class_[i]].mem_choice[j];
        schedule[class_[i]].mem_num++;
        var t = schedule[class_[i]].mem_num;
        schedule[class_[i]].class_mem[t] = mem[mem_].name;
        mem[mem_].class_choice_num--;
        mem[mem_].need_class_num--;
        mem[mem_].CanBeChoose[class_[i]] = 0;
        class_s_info[class_[i]].need_mem--;
        class_s_info[class_[i]].mem_choice_num--;
        if (mem[mem_].class_choice_num == mem[mem_].need_class_num) {
          for (var k = 1; k < mem[mem_].signup_class.length; k++) {
            var c = mem[mem_].signup_class[k];
            if (mem[mem_].CanBeChoose[c] == 1) {
              if (class_s_info[c].need_mem > 0) {
                schedule[c].mem_num++;
                t = schedule[c].mem_num;
                schedule[c].class_mem[t] = mem[mem_].name;
                class_s_info[c].mem_choice_num--;
                class_s_info[c].need_mem--;
                mem[mem_].need_class_num--;
                mem[mem_].class_choice_num--;
              }
              mem[mem_].CanBeChoose[c] = 0;
            }
          }
          mem[mem_].pow = 0;
        }
        if (mem[mem_].need_class_num == 0) {
          for (var k = 1; k < mem[mem_].signup_class.length; k++) {
            var c = mem[mem_].signup_class[k];
            if (mem[mem_].CanBeChoose[c] == 1) {
              if (class_s_info[c].need_mem > 0)
                class_s_info[c].mem_choice_num--;
              mem[mem_].CanBeChoose[c] = 2;
            }
          }
          mem[mem_].pow = 0;
        }
      }
      j++;
    }
    sort_class_by_mem(class_, i + 1);
    schedule[class_[i]].mem_num = schedule[class_[i]].mem_num + schedule[class_[i]].hasLeader;
  }
}

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

	var query;
	if (ctx.method === 'GET') {
		query = ctx.query
	}
	if (ctx.method === 'POST') {
		query = ctx.request.body
	}

	// var name_table = "Schedule" + query.id.toString() + "_" + query.library.toString()
  var name_table = query.title
	//var name_table = query.name
	let classes_to_choose = await mysql('Question_Info').where({id: query.id}).select('canIChoose')
	
	//must exist the question info
	//The formatting requirements of the parse are too high
	if (classes_to_choose == 0){
		ctx.state.data = "不存在该问卷"
	}
	else {
		var a = JSON.stringify(classes_to_choose)
		var arr = a.toString().split("\"")
		if (arr[2] == ":null}]"){
			ctx.state.data = "该问卷不存在可选班次"
		} else {
			var array = arr[3].split(",")
			
			await DB.schema.hasTable(name_table).then(function (exists) {
				if (!exists) {
					return DB.schema.createTable(name_table, function (table) {
						table.increments('id');
						table.string('theClass',100).notNullable();
						table.integer('mem_num', 11);//the number of teammember
						table.boolean('hasleader');
						table.string('leader_name',30);
						table.string('leader_studentNum', 30);
						table.string('member1_name', 30);
						table.string('member1_studentNum', 30);
						table.string('member2_name', 30);
						table.string('member2_studentNum', 30);
						table.string('member3_name', 30);
						table.string('member3_studentNum', 30);
						table.string('member4_name', 30);
						table.string('member4_studentNum', 30);
						table.string('member5_name', 30);
						table.string('member5_studentNum', 30);
						table.string('member6_name', 30);
						table.string('member6_studentNum', 30);
						table.string('member7_name', 30);
						table.string('member7_studentNum', 30);
						table.string('member8_name', 30);
						table.string('member8_studentNum', 30);
						table.string('member9_name', 30);
						table.string('member9_studentNum', 30);
						table.string('member10_name', 30);
						table.string('member10_studentNum', 30);
					});
				}
			});
			for (var i=0; i<array.length;i++){
				await mysql(name_table).insert({ theClass: array[i] });
			}

			var answer_table = "QuestionAnswer" + query.id.toString()
			res = await mysql(answer_table).where({library: query.library}).select('*')
			

			//根据res解析出同学姓名&学号&status&classes调用排班算法进行排班
			//------------------------------------------------------------------
			get_info_and_schedule();
			//------------------------------------------------------------------

			//将排班结果按班次&leader&member存入schedule中
			//------------------------------------------------------------------
			for(var i=1; i<schedule.length; i++){
				var class_info = schedule[i]
        var mem_list = new Array(10)
        for (var j = 0; j < 10; j++) {
          mem_list[j] = null;
        }
        for (var j = 0; j < class_info.mem_num - 1; j++) {
          mem_list[j] = class_info.class_mem[j+1];
        }
				await mysql(name_table).where({theClass: class_info.class_name})
					.update({
						mem_num: class_info.mem_num - 1, 
						leader_name: class_info.leader,
						hasleader: class_info.hasLeader,
            member1_name: mem_list[0],
            member2_name: mem_list[1],
            member3_name: mem_list[2],
            member4_name: mem_list[3],
            member5_name: mem_list[4],
            member6_name: mem_list[5],
            member7_name: mem_list[6],
            member8_name: mem_list[7],
            member9_name: mem_list[8],
            member10_name: mem_list[9]
						// leader_studentNum:, 
					})
      }
			// await mysql(name_table).where({ theClass: theclass }).update()	//待补充
			//------------------------------------------------------------------
			ctx.state.data = { res, schedule, info }
		}
	}
}