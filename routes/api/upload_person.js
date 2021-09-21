var router = require('express').Router();
var passport = require('passport');
const csv = require('neat-csv');

var parseDateTime = require("./../../commons/parseDateTime")
var auth = require("../auth")

var { find, insert}  = require('../../mysql/UploadPerson')

const check_null = (data) => {
  var new_ = []
  data.forEach(element => {
    new_.push({
      "id": element.id,
      "idcard": (element.idcard === "NULL" ? null : element.idcard),
      "name_title": (element.name_title === "NULL" ? null : element.name_title),
      "firstname": (element.firstname === "NULL" ? null : element.firstname),
      "lastname": (element.lastname === "NULL" ? null : element.lastname),
      "birthday": (element.birthday === "NULL" ? null : element.birthday),
      "sex": (element.sex === "NULL" ? null : element.sex),
      "religion": (element.religion === "NULL" ? null : element.religion),
      "house_no": (element.house_no === "NULL" ? null : element.house_no),
      "village_no": (element.village_no === "NULL" ? null : element.village_no),
      "alley": (element.alley === "NULL" ? null : element.alley),
      "lane": (element.lane === "NULL" ? null : element.lane),
      "road": (element.road === "NULL" ? null : element.road),
      "sub_district": (element.sub_district === "NULL" ? null : element.sub_district),
      "district": (element.district === "NULL" ? null : element.district),
      "provinces": (element.provinces === "NULL" ? null : element.provinces),
      "idcard_expired": (element.idcard_expired === "NULL" ? null : element.idcard_expired),
      "picture": (element.picture === "NULL" ? null : element.picture),
      "company_id": (element.company_id === "NULL" ? null : element.company_id),
      "type": (element.type === "NULL" ? null : element.type),
      "egat_person_code":  (element.egat_person_code === "NULL" ? null : element.egat_person_code),
      "created_at": parseDateTime(new Date()),
      "modified_at": parseDateTime(new Date()),
      "mine_permit": 0,
      "card_id": null,
      "card_expired": (element.card_expired === "NULL" ? null : element.card_expired),
      "contract_num": (element.contract_num === "NULL" ? null : element.contract_num),
    })
  });
  return new_
}

const gen_data_insert = (data) => {
  var new_ = []
  data.forEach(element => {
    new_.push({
      "idcard": (element.idcard === "NULL" ? null : element.idcard),
      "name_title": (element.name_title === "NULL" ? null : element.name_title),
      "firstname": (element.firstname === "NULL" ? null : element.firstname),
      "lastname": (element.lastname === "NULL" ? null : element.lastname),
      "birthday": (element.birthday === "NULL" ? null : element.birthday),
      "sex": (element.sex === "NULL" ? null : element.sex),
      "religion": (element.religion === "NULL" ? null : element.religion),
      "house_no": (element.house_no === "NULL" ? null : element.house_no),
      "village_no": (element.village_no === "NULL" ? null : element.village_no),
      "alley": (element.alley === "NULL" ? null : element.alley),
      "lane": (element.lane === "NULL" ? null : element.lane),
      "road": (element.road === "NULL" ? null : element.road),
      "sub_district": (element.sub_district === "NULL" ? null : element.sub_district),
      "district": (element.district === "NULL" ? null : element.district),
      "provinces": (element.provinces === "NULL" ? null : element.provinces),
      "idcard_expired": (element.idcard_expired === "NULL" ? null : element.idcard_expired),
      "picture": (element.picture === "NULL" ? null : element.picture),
      "company_id": (element.company_id === "NULL" ? null : element.company_id),
      "type": (element.type === "NULL" ? null : element.type),
      "egat_person_code":  (element.egat_person_code === "NULL" ? null : element.egat_person_code),
      "created_at": parseDateTime(new Date()),
      "modified_at": parseDateTime(new Date()),
      "mine_permit": 0,
      "card_id": null,
      "card_expired": (element.card_expired === "NULL" ? null : element.card_expired),
      "contract_num": (element.contract_num === "NULL" ? null : element.contract_num),
    })
  });
  return new_
}

router.post('/upload_person', auth.required, async function(req, res, next) {
  var raw = req.file
  if (raw === undefined){
    return res.status(400).json({ msg: "ไม่พบไฟล์ .csv", status: false})
  }
  if (raw.originalname.split(".")[1] !== "csv"){
    return res.status(400).json({ msg: "กรุณาเลือกใช้ไฟล์ .csv", status: false, type: raw.mimetype})
  }
  var string_csv = raw.buffer.toString()
  const result_csv = await csv(string_csv);
  var result_csv_new = check_null(result_csv)
  const result = await find(result_csv_new)
  if (result.isError === false){
    return res.status(200).json({ data: result.data, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

router.put('/upload_person', auth.required, async function(req, res, next) {
  var data = req.body.data
  if (data.length === 0){
    return res.status(400).json({ msg: "ไม่พบข้อมูลที่ต้องการเพิ่ม", status: false})
  }
  const result = await insert(gen_data_insert(data))
  return res.status(200).json({ data: result.data, status: true })
})

module.exports = router;