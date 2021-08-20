var mysql = require('../connection')

const Find = async (
  card_id,
  license,
  uhf_id,
  mifare_id,
  company_name,
  is_card_number,
  is_expire_card,
  is_accept_mine,
  offset,
  limit 
) => {
  const conn = await mysql.connection()
  try {
    console.log(  card_id,
      license,
      uhf_id,
      mifare_id,
      company_name,
      is_card_number,
      is_expire_card,
      is_accept_mine,
      offset,
      limit )
    const WhereParameter = (
      card_id,
      license,
      uhf_id,
      mifare_id,
      company_name,
    ) => {

      if (
        card_id === undefined &&
        license === undefined &&
        uhf_id === undefined &&
        mifare_id === undefined &&
        company_name === undefined
      ){
        return ``
      }
      
      if (company_name !== undefined){
        if (license !== undefined){
          return `
            vh.license_plate LIKE "%${license}%" AND cm.name LIKE "%${company_name}%" 
          `
        }
        if (card_id !== undefined){
          return `
            card.id LIKE "%${card_id}%" AND cm.name LIKE "%${company_name}%" 
          `
        }
        if (uhf_id !== undefined){
          return `
            card.uhf_id LIKE "%${uhf_id}%" AND cm.name LIKE "%${company_name}%" 
          `
        }
        if (mifare_id !== undefined){
          return `
            card.mifare_id LIKE "%${mifare_id}%" AND cm.name LIKE "%${company_name}%" 
          `
        }
        if (
          license === undefined &&
          card_id === undefined &&
          uhf_id === undefined &&
          mifare_id === undefined
        ){
          return `
            cm.name LIKE "%${company_name}%" 
          `
        }
      } else {
        if (license !== undefined){
          return `
            vh.license_plate LIKE "%${license}%"
          `
        }
        if (card_id !== undefined){
          return `
            card.id LIKE "%${card_id}%"
          `
        }
        if (uhf_id !== undefined){
          return `
            card.uhf_id LIKE "%${uhf_id}%"
          `
        }
        if (mifare_id !== undefined){
          return `
            card.mifare_id LIKE "%${mifare_id}%"
          `
        }
      }
      
      // var query = ``
      // if (card_id !== undefined && license === undefined){
      //   if (company_name !== undefined){
      //     query = `
      //       card.id LIKE "%${card_id}%" AND cm.name LIKE "%${company_name}%" 
      //     `
      //   } else {
      //     query = `
      //       card.id LIKE "%${card_id}%" 
      //     `
      //   }
      // } else if (card_id === undefined && license !== undefined){
      //   if (company_name !== undefined){
      //     query = `
      //       vh.license_plate LIKE "%${license}%" AND cm.name LIKE "%${company_name}%" 
      //     `
      //   } else {
      //     query = `
      //       vh.license_plate LIKE "%${license}%" 
      //     `
      //   }
      // }else {
      //   if (company_name !== undefined){
      //     query = `
      //       cm.name LIKE "%${company_name}%" 
      //     `
      //   } else {
      //     query = ``
      //   }
      // }
      // return query
    }

    const WhereStatus = (
      is_card_number,
      is_expire_card,
      is_accept_mine,
    ) => {
      is_card_number = (is_card_number !== undefined)
      is_expire_card = (is_expire_card !== undefined)
      is_accept_mine = (is_accept_mine !== undefined)
      
      var count = 0
      var q_arr = []
      var query_out = ''
      if (is_card_number) { q_arr.push(`vh.card_id IS NOT NULL`);count++; }
      if (is_expire_card) { q_arr.push(`vh.card_expired < NOW()`);count++; }
      if (is_accept_mine) { q_arr.push(`vh.mine_permit = 1`);count++; }

      for (var i = 0;i < (count);i++){
        query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
      }
      if (!is_card_number && !is_expire_card && !is_accept_mine){
        query_out = ``
      }
      return query_out
    }
    var query_string = `
      SELECT 
        vh.id AS vehicle_id,
        vh.license_plate AS license,
        tpv.name_th AS province,
        vhb.name AS brand,
        vh.model AS model,
        vh.classification AS v_classification, 
        cm.name AS company,
        card.id AS card_id,
        card.uhf_id AS uhf_id,
        card.mifare_id AS mifare_id,
        vh.card_expired AS card_expired,
        vh.remark AS remark,
        vh.mine_permit AS mine_permit,

        vh.egat_plate AS egat_plate,
        vh.faction2_DIV AS faction2_DIV,
        vh.faction2_D_ABBR AS faction2_D_ABBR,

        cm.id AS company_id,
        vhb.id AS vehicle_brand_id,
        tpv.id AS province_id,
        vcfc.id AS vehicle_classification_id

      FROM vehicle AS vh
      
      LEFT JOIN vehicle_classification AS vcfc
        ON vcfc.id = vh.classification
        
      LEFT JOIN vehicle_brand AS vhb
        ON vhb.id = vh.brand_id
      
      LEFT JOIN card AS card
        ON card.id = vh.card_id
      
      LEFT JOIN company AS cm
        ON cm.id = vh.company_id
      
      LEFT JOIN tb_provinces AS tpv
        ON tpv.id = vh.province_id
      
      WHERE ${(WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) === "" && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) === "" ? "1": WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) + (WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) !== '' && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) !== '' ? " AND ": "") + WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ))}
    
      LIMIT ${limit} OFFSET ${offset}
    `
    console.log(query_string)
    const [rows] = await conn.query(query_string)
    var query_string = `
      SELECT 
        COUNT(*) AS length
      FROM vehicle AS vh
        
      LEFT JOIN vehicle_brand AS vhb
        ON vhb.id = vh.brand_id
      
      LEFT JOIN card AS card
        ON card.id = vh.card_id
      
      LEFT JOIN company AS cm
        ON cm.id = vh.company_id
      
      LEFT JOIN tb_provinces AS tpv
        ON tpv.id = vh.province_id
      
      WHERE ${(WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) === "" && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) === "" ? "1": WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) + (WhereParameter(  
        card_id,
        license,
        uhf_id,
        mifare_id,
        company_name,
      ) !== '' && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) !== '' ? " AND ": "") + WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ))}
    `
    const [count] = await conn.query(query_string)
    conn.end();
    return {
      isError: false,
      data: rows,
      count: count
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
  Find
};