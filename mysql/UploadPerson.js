var mysql = require('./connection')

const find_personcsv_available = async (list_, conn) => {
  var person_all = await conn.query(`SELECT * FROM person WHERE 1`)

  for (const [list_index, list_element] of list_.entries()) {
    list_element.check_available = false
    for (const [person_index, person_element] of person_all[0].entries()) {
      if (list_element.firstname === person_element.firstname && list_element.lastname === person_element.lastname){
        list_element.check_available = true
        break;
      }
    }
  }
  return list_
}

const find = async (data) => {
  try{
    const conn = await mysql.connection()

    // check person available in db
    var result_file_available = await find_personcsv_available(data, conn)
    var return_data = []
    result_file_available.forEach(element => {
      if (element.check_available === false){
        return_data.push(element)
      }
    });
    return {
      isError: false,
      data: return_data
    }
  }catch(e){
    return {
      isError: true,
      data: e
    }
  }
}

const gen_field = (data) => {
  return Object.keys(data[0]).map(e => {
    return `${e}`
  })
}
const gen_value = (data) => {
  return data.map(e => {
    return "(" + Object.values(e).map(v => {
      return (v === null ? `null`: `"${v}"`)
    }).join() +  ")"
  })
}

const insert = async (data) => {
  try{
    const conn = await mysql.connection()

    var query = `
    INSERT INTO 
      person(
        ${gen_field(data).join()}
      )
    VALUES
      ${gen_value(data).join()}
    `
    var person = await conn.query(query)
    return {
      isError: false,
      data: person
    }
  }catch(e){
    return {
      isError: true,
      data: e
    }
  }
}

module.exports = {
  find,
  insert
}