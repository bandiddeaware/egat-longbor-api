// 0 ไม่มีบัตร          person.card_id == undefined
// 1 กำลังพิมพ์บัตร      person.card_id != undefined &&  card.uhf_id == undefined && card.mifare == undefined &&  card.status == inactive
// 2 บัตรพร้อมใช้       person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && !is_expired
// 3 คืนบัตรแล้ว        person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == inactive
// 4 บัตรหมดอายุ       person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && is_expired
// 5 ไม่อนุญาตทำงาน    person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && !person.mine_permit

var Gencard = require('./lib/GenCard')
var InsertCard = require("./lib/InsertCard")
var Zip = require("./lib/zip")

module.exports = async (
  card_value
) => {
  try{
    const result = await Gencard(card_value)
    const result_insert = await InsertCard(result)
    
    const result_zip = await Zip(result)

    return {
      isError: false,
      data: result_zip,
    }
  }catch(e) {
    return {
      isError: true,
      data: e
    }
  }
}