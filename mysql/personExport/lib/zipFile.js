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

module.exports = async (pic_file, csv) => {
  const zip = new AdmZip();
  var content = `employee_id,employee_idcard,employee_name_title,employee_name,employee_lastname,employee_picture,card_id,company_id,company_name\n`
  csv.forEach((item) => {
    var csv_out = item.employee_id + ","
    csv_out += item.employee_idcard + ","
    csv_out += item.employee_name_title + ","
    csv_out += item.employee_name + ","
    csv_out += item.employee_lastname + ","
    csv_out += item.employee_picture + ","
    csv_out += map_type_card((item.card_id).toString()) + ","
    csv_out += item.company_id + ","
    csv_out += item.company_name + "\n"
    content = content.concat(csv_out)
  })
  pic_file = findPicture(pic_file)
  zip.addFile("export.csv", Buffer.from(content), "egat export .csv");
  for(var i = 0; i < pic_file.length;i++){
    if (!pic_file[i].result){
      var fs_data = fs.readFileSync(process.env.DEFAULTIMAGE + 'person_defualt_image.jpg')
      zip.addFile(pic_file[i].picture_name , Buffer.from(fs_data), "egat export image");
    } else {
      zip.addLocalFile(process.env.SRCDIRPERSON + pic_file[i].picture_name);
    }
  }
  const data = zip.toBuffer();
  return data
}