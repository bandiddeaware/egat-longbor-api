var mysql = require('../connection')

const Find = async (
  id_card,
  license,
  uhf_id,
  mifare_id,
  card_type,
  status_active,
  status_loss,
  status_idle,
  offset,
  limit
) => {
  const conn = await mysql.connection()

  const WherebyIDcardAndLicense = (
    id_card,
    license,
    uhf_id,
    mifare_id,
    card_type,
  ) => {

    var query = ``

    if (
      id_card === undefined &&
      license === undefined &&
      uhf_id === undefined &&
      mifare_id === undefined &&
      card_type === undefined
    ){
      return ``
    }

    if (card_type !== undefined){

      if (card_type === "person_all"){
        query = `
          (
            card.type = 1 OR  
            card.type = 2 OR  
            card.type = 3 OR  
            card.type = 4 OR  
            card.type = 5
          ) AND 
        `
      } else if (card_type === "vehicle_all") {
        query = `
          (
            card.type = 101 OR  
            card.type = 102 OR  
            card.type = 103 
          ) AND 
        `
      } else {
        query = `
          card.type = ${card_type} 
        `
      }

      if (id_card !== undefined){
        query += `
          ps.idcard LIKE "%${id_card}%"
        `
      }
      if (license !== undefined){
        query += `
          vh.license_plate LIKE "%${license}%"
        `
      }
      if (uhf_id !== undefined){
        query += `
          card.uhf_id  LIKE "%${uhf_id}%"
        `
      }
      if (mifare_id !== undefined){
        query += `
          card.mifare_id  LIKE "%${mifare_id}%"
        `
      }
    } else {
      if (id_card !== undefined){
        query += `
          ps.idcard LIKE "%${id_card}%"
        `
      }
      if (license !== undefined){
        query += `
          vh.license_plate LIKE "%${license}%"
        `
      }
      if (uhf_id !== undefined){
        query += `
          card.uhf_id  LIKE "%${uhf_id}%"
        `
      }
      if (mifare_id !== undefined){
        query += `
          card.mifare_id  LIKE "%${mifare_id}%"
        `
      }
    }


    // var query = ``
    // if (id_card !== undefined && license === undefined){
    //   if (card_type === "person_all"){
    //     query = `
    //       ps.idcard LIKE "%${id_card}%" AND

    //       (
    //         card.type = 1 OR  
    //         card.type = 2 OR  
    //         card.type = 3 OR  
    //         card.type = 4 OR  
    //         card.type = 5
    //       ) AND 
    //     `
    //   }else {
    //     query = `
    //       ps.idcard LIKE "%${id_card}%" AND

    //       card.type = ${card_type} AND 
    //     `
    //   }
    // } else if (license !== undefined && id_card === undefined){
    //   if (card_type === "vehicle_all"){
    //     query = `
    //       vh.license_plate LIKE "%${license}%" AND

    //       (
    //         card.type = 101 OR  
    //         card.type = 102 OR  
    //         card.type = 103 
    //       ) AND 
    //     `
    //   }else {
    //     query = `
    //       vh.license_plate LIKE "%${license}%" AND

    //       card.type = ${card_type} AND 
    //     `
    //   }
    // }else {
    //   query = `1`
    // }
    return query
  }
  const WhereStatus = (
    status_active,
    status_loss,
    status_idle
  ) => {
    status_active = (status_active !== undefined)
    status_loss = (status_loss !== undefined)
    status_idle = (status_idle !== undefined)
    var count = 0
    var q_arr = []
    var query_out = ''
    if (status_active) { q_arr.push(`card.status = 1`);count++; }
    if (status_loss) { q_arr.push(`card.status = -1`);count++; }
    if (status_idle) { q_arr.push(`card.status = 0`);count++; }
  
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
    }
    if (!status_active && !status_loss && !status_idle){
      query_out = ``
    }
    return query_out
  }

  const SearchBy = () => {
    var query = ``
    if (id_card !== undefined){
      query = `
        SELECT
          card.id AS card_id,
          ps.idcard AS idcard_license,
          card.mifare_id AS mifare,
          card.uhf_id AS uhf,
          ct.description AS card_type,
          cs.description AS card_status
        FROM card AS card
        
        LEFT JOIN person AS ps
          ON ps.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else if (license !== undefined){
      query = `
        SELECT
          card.id AS card_id,
          vh.license_plate AS idcard_license,
          card.mifare_id AS mifare,
          card.uhf_id AS uhf,
          ct.description AS card_type,
          cs.description AS card_status
        FROM card AS card
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else if (uhf_id !== undefined) {
      query = `
        SELECT
          card.id AS card_id,
          vh.license_plate AS idcard_license,
          card.mifare_id AS mifare,
          card.uhf_id AS uhf,
          ct.description AS card_type,
          cs.description AS card_status
        FROM card AS card
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else if (mifare_id !== undefined) {
      query = `
        SELECT
          card.id AS card_id,
          vh.license_plate AS idcard_license,
          card.mifare_id AS mifare,
          card.uhf_id AS uhf,
          ct.description AS card_type,
          cs.description AS card_status
        FROM card AS card
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else {
      query = `
        SELECT
          card.id AS card_id,
          vh.license_plate AS idcard_license,
          card.mifare_id AS mifare,
          card.uhf_id AS uhf,
          ct.description AS card_type,
          cs.description AS card_status
        FROM card AS card
        
        LEFT JOIN person AS ps
          ON ps.card_id = card.id
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id

        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE 1 
      `
    }
    return query
  }
  const SearchCount = () => {
    var query = ``
    if (id_card !== undefined && license === undefined){
      query = `
        SELECT
          COUNT(*) AS length
        FROM card AS card
        
        LEFT JOIN person AS ps
          ON ps.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else if (license !== undefined && id_card === undefined){
      query = `
        SELECT
          COUNT(*) AS length
        FROM card AS card
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id
        
        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE ${WherebyIDcardAndLicense(id_card,license,uhf_id,mifare_id,card_type,)}

        ${(WhereStatus(status_active, status_loss, status_idle) !== '' ? " AND " + WhereStatus(status_active, status_loss, status_idle): "")}
      `
    } else {
      query = `
        SELECT
          COUNT(*) as length
        FROM card AS card
        
        LEFT JOIN person AS ps
          ON ps.card_id = card.id
        
        LEFT JOIN vehicle AS vh
          ON vh.card_id = card.id

        LEFT JOIN card_type AS ct
          ON ct.id = card.type
        
        LEFT JOIN card_status AS cs
          ON cs.id = card.status
        
        WHERE 1 
      `
    }
    return query
  }
  try {

    const find_count = (SearchCount())
    const find_rows = (SearchBy() + ` LIMIT ${limit} OFFSET ${offset} `)
    const [count] = await conn.query(find_count)
    const [rows] = await conn.query(find_rows)
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