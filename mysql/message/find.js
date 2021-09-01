var mysql = require('../connection')

module.exports = async () => {
  const conn = await mysql.connection()
  try {
    var file_msg = ` SELECT * FROM message WHERE 1 ORDER BY id DESC `
    const [message] = await conn.query(file_msg)
    var group_msg = `
    SELECT 
      gm.group as group_,
      gm.assambly_id AS assambly_id,
      st.name AS assambly_name
    FROM group_message AS gm 
    LEFT JOIN station AS st 
      ON st.id = gm.assambly_id
    `
    const [group] = await conn.query(group_msg)
    var assambly_not_use = `
      SELECT 
        gm.assambly_id AS assambly_id,
        st.name AS assambly_name
      FROM group_message AS gm 
      LEFT JOIN station AS st 
        ON st.id = gm.assambly_id
      WHERE gm.group IS NULL
    `
    const [ass_not_use] = await conn.query(assambly_not_use)
    var assambly_use = `
      SELECT 
        gm.assambly_id AS assambly_id,
        st.name AS assambly_name
      FROM group_message AS gm 
      LEFT JOIN station AS st 
        ON st.id = gm.assambly_id
      WHERE gm.group IS NOT NULL
    `
    const [ass_use] = await conn.query(assambly_use)

    var out_list = []
    message.forEach((item) => {
      var assambly = []
      group.forEach((gitem) => {
        if (gitem.group_ === item.id){
          assambly.push({
            "assambly_id": gitem.assambly_id,
            "assambly_name": gitem.assambly_name,
          })
        }
      })
      out_list.push({
        id: item.id,
        massage: item.message,
        assambly: assambly
      })
    })
    var group_msg = {
      group_msg: out_list,
      assambly_used: ass_use,
      assambly_not_use: ass_not_use
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