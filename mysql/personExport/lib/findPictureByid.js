var mysql = require('../../connection')

const FindMultipleID = async (
  multiple_id
) => {
  const conn = await mysql.connection()
  try {
    var query = `
      SELECT 
        ps.id AS employee_id, 
        ps.idcard AS employee_idcard,
        ps.name_title AS employee_name_title,
        ps.firstname AS employee_name,
        ps.lastname AS employee_lastname,
        ps.picture AS employee_picture,
        ps.card_id AS card_id, 
        ps.company_id AS company_id, 
        cp.name AS company_name,
        ps.picture AS picture    
      FROM person as ps
      
      LEFT JOIN company AS cp
        ON ps.company_id = cp.id
      
      LEFT JOIN card as card
        ON ps.card_id = card.id

      WHERE ps.id IN  ${multiple_id} AND card.type = 0 AND card.status = 0
    `
    const [rows] = await conn.query(query)
    conn.end();
    return {
      isError: false,
      data: rows,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}

module.exports = {
  FindMultipleID
};