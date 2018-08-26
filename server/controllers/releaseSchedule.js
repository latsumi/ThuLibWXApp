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
  let info
  // name_table = "Schedule" + query.id.toString + "_" + query.library.toString
  var name_table_old = query.title
  var name_table_new = query.title
  await DB.schema.hasTable(name_table).then(function (exists) {
    if (!exists) { 
      info = 0
    }else{
      DB.schema.renameTable(name_table, name_table+"_1")
      info = 1
    }
  })
}