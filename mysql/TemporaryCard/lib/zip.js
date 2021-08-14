const AdmZip = require('adm-zip');
var fs = require('fs');

const map_type_card = (card_id) => {
  if (card_id.length === 9){
    return `${card_id.substring(0,4)}${card_id.substring(4)}`
  }
  return card_id
}

const findPicture = (person_image) => {
  var uploadDir = fs.readdirSync(process.env.SRCDIRPERSON); 
  var match = []
  person_image.forEach((item1) => {
    var find = ""
    uploadDir.forEach((item2) => {
      if (item1 === item2){
        find = item2
      }
    })
    if (find === ''){
      match.push({
        result: false,
        picture_name: item1
      })
    }else {
      match.push({
        result: true,
        picture_name: find
      })
    }
  })
  return match
}

module.exports = async (card_id) => {
  const zip = new AdmZip();
  var content = `employee_id,employee_idcard,employee_name_title,employee_name,employee_lastname,employee_picture,card_id,company_id,company_name\n`
  card_id.forEach((item) => {
    var csv_out = ","
    csv_out += ","
    csv_out += ","
    csv_out += ","
    csv_out += ","
    csv_out += ","
    csv_out += map_type_card((item.card_id).toString()) + ","
    csv_out += ","
    csv_out += "\n"
    content = content.concat(csv_out)
  })
  zip.addFile("export.csv", Buffer.from(content), "egat export .csv");
  const data = zip.toBuffer();
  return data
}