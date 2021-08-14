var mysql = require('../connection')

const FindMultipleID = async (
  multiple_id
) => {
  const conn = await mysql.connection()
  try {
    var query = `
      SELECT 

        ps.*, 
        pcs.*, 
        card.*, 
        card_st.*
      
      FROM person as ps
    

      LEFT JOIN person_card_status as pcs
        ON ps.card_status = pcs.id
      
      LEFT JOIN company as cp
        ON ps.company_id = cp.id
      
      LEFT JOIN card as card
        ON ps.card_id = card.id
      
      LEFT JOIN card_status AS card_st
        ON card.status = card_st.id
      
      LEFT JOIN card_type AS card_t
        ON card.type = card_t.id
    
      WHERE ps.id IN ${multiple_id}
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