var mysql = require('../connection')

module.exports = async (data) => {
  const conn = await mysql.connection()
  try {

    // find assambly and set item
    var query = `SELECT assambly_id FROM group_message WHERE group_message.group = ${data.msg_id}`
    const [find] = await conn.query(query)
    var ass_item = []
    console.log(query)
    find.forEach((item) => {
      ass_item.push(item.assambly_id)
    })

    if (ass_item.length > 0){
      var where = ass_item.join()
      var when = ``
      ass_item.forEach(element => {
        when += ` WHEN ${element} THEN NULL
        `
      });
      var query = `
        UPDATE group_message AS gm SET gm.group = CASE assambly_id
          ${when}
        ELSE assambly_id END
        WHERE assambly_id IN(${where});
      `
      const [update] = await conn.query(query)

      // delete item
      var query = `DELETE FROM message WHERE id = ${data.msg_id}`
      const [result] = await conn.query(query)

      return {
        isError: false,
        data: result,
      } 
    }

    conn.end();
    return {
      isError: false,
      data: group_msg,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
};