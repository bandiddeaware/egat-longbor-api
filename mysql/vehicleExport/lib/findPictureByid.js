var mysql = require('../../connection')

const FindMultipleID = async (
  multiple_id
) => {
  const conn = await mysql.connection()
  try {
    var query = `
      SELECT
        vh.id AS vehicle_id,
        vh.*,
        card.*,
        vhb.*,
        vct.*,
        vh.card_id as card_id,
        IF(vh.image IS NULL OR vh.image = "", CONCAT(vh.id, ".jpg"), vh.image) as picture,
        cp.id AS company_id,
        cp.name AS company_name
      FROM vehicle AS vh
      
      LEFT JOIN company AS cp
        ON vh.company_id = cp.id
      
      LEFT JOIN card as card
        ON vh.card_id = card.id
      
      LEFT JOIN vehicle_brand AS vhb
        ON vh.brand_id = vhb.id
      
      LEFT JOIN vehicle_classification AS vct
        ON vh.classification = vct.id
      
      WHERE vh.id IN ${multiple_id}
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