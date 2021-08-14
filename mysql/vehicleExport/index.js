// 0 ไม่มีบัตร          person.card_id == undefined
// 1 กำลังพิมพ์บัตร      person.card_id != undefined &&  card.uhf_id == undefined && card.mifare == undefined &&  card.status == inactive
// 2 บัตรพร้อมใช้       person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && !is_expired
// 3 คืนบัตรแล้ว        person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == inactive
// 4 บัตรหมดอายุ       person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && is_expired
// 5 ไม่อนุญาตทำงาน    person.card_id != undefined && (card.uhf_id != undefined || card.mifare != undefined) && card.status == active   && !person.mine_permit



var fs = require('fs')

var genCard = require("./lib/genCardid")
var insertCard = require("./lib/insertCard")
var updateVehicle = require("./lib/updateVehicle")
var findPicture = require("./lib/findPictureByid")
var ZipCsvPicture = require("./lib/zipFile")

module.exports = async (
  vehicle_id,
  value_vehicle
) => {
  console.log("vehicle_id: ", vehicle_id)
  // =============== get card id ================================
  var card_id = await genCard(vehicle_id, value_vehicle.length)
  console.log("card_id: ", card_id)
  // =============== insert card id =============================
  if (card_id.length > 0){
    var insert_card = await insertCard(card_id)
    if (insert_card.data.affectedRows !== card_id.length){
      return {
        isError: true, 
        data: "ไม่สามารถเพิ่มข้อมูลการ์ดได้โปรดตรวจสอบ"
      }
    }
  }
  // =============== update vehicle ==============================
  if (card_id.length > 0){
    var update_vehicle = await updateVehicle(card_id)
    if (update_vehicle.data.affectedRows !== card_id.length){
      return {
        isError: true, 
        data: "มีปัญหาในการอัพเดทข้อมูลบุคคลโปรดตรวจสอบ"
      }
    }
  }

  // =============== fine picture person by id ==================
  const result = await findPicture.FindMultipleID(vehicle_id)
  if (result.data.length === 0){
    return {
      isError: true, 
      data: 'ไม่พบรูปภาพในฐานข้อมูลโปรตรวจสอบ'
    }
  }
  var data = result.data
  // =============== create zip file=============================
  var zip = await ZipCsvPicture(data.map(f => f.picture), data)
  return {
    isError: false, 
    data: zip
  }
}


// var fs = require('fs')

// var findPicture = require("./lib/findPictureByid")
// var ZipCsvPicture = require("./lib/zipFile")
// var genCard = require("./lib/genCardid")
// var insertCard = require("./lib/insertCard")
// var updatePerson = require("./lib/updatePerson")

// module.exports = async (
//   person_id,
//   value_person
// ) => {
//   // // =============== check person card  =========================
//   // var result_checkNull = await checkNull(person_id)
//   // if (Number(result_checkNull.data[0].CheckNull) !== 0){
//   //   return {
//   //     isError: true, 
//   //     data: "มีบุคคลที่ได้ลงทะเบียนบัตรแล้วโปรดตรวจสอบบุคคลที่จะพิมพ์บัตร"
//   //   }
//   // }

//   // // =============== check person match ================================
//   // var result_checkMatch = await checkValPerson(person_id)
//   // if (result_checkMatch.data[0].COUNT_P !== value_person.length){
//   //   return {
//   //     isError: true, 
//   //     data: "ไม่พบบุคคลที่ส่งมาโปรดตรวจสอบ"
//   //   }
//   // }
  
//   // =============== get card id ================================
//   var card_id = await genCard(person_id, value_person.length)

//   // =============== insert card id =============================
//   if (card_id.length > 0){
//     var insert_card = await insertCard(card_id)
//     if (insert_card.data.affectedRows !== card_id.length){
//       return {
//         isError: true, 
//         data: "ไม่สามารถเพิ่มข้อมูลการ์ดได้โปรดตรวจสอบ"
//       }
//     }
//   }

//   // =============== update person ==============================
//   if (card_id.length > 0){
//     var update_person = await updatePerson(card_id)
//     if (update_person.data.affectedRows !== card_id.length){
//       return {
//         isError: true, 
//         data: "มีปัญหาในการอัพเดทข้อมูลบุคคลโปรดตรวจสอบ"
//       }
//     }
//   }

//   // =============== fine picture person by id ==================
//   const result = await findPicture.FindMultipleID(person_id)
//   if (result.data.length === 0){
//     return {
//       isError: true, 
//       data: 'ไม่พบรูปภาพในฐานข้อมูลโปรตรวจสอบ'
//     }
//   }
//   var data = result.data
//   // =============== create zip file=============================
//   var zip = await ZipCsvPicture(data.map(f => f.picture), data)
//   return {
//     isError: false, 
//     data: zip
//   }
// }