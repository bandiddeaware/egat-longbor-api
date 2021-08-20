const AdmZip = require('adm-zip');
var fs = require('fs');

const map_type_card = (card_id) => {
  if (card_id.length === 9){
    return `${card_id.substring(0,4)}${card_id.substring(4)}`
  }
  return card_id
}

const findPicture = (person_image) => {
  var uploadDir = fs.readdirSync(process.env.SRCDIRVEHICLE); 
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
  var content = `vehicle_id,model,license_plate,egat_plate,remark,picture,faction2_DIV,faction2_D_ABBR,name,type,card_id\n`
  csv.forEach((item) => {
    var csv_out = item.vehicle_id + ","
    csv_out += item.model + ","
    csv_out += item.license_plate + ","
    csv_out += item.egat_plate + ","
    csv_out += (item.remark === null ? "": item.remark) + ","
    csv_out += item.picture + ","
    csv_out += item.faction2_DIV + ","
    csv_out += item.faction2_D_ABBR + ","
    csv_out += item.name + ","
    csv_out += item.type + ","
    csv_out += map_type_card((item.card_id).toString()) + "\n"
    content = content.concat(csv_out)
  })
  pic_file = findPicture(pic_file)
  zip.addFile("export.csv", Buffer.from(content), "egat export .csv");
  for(var i = 0; i < pic_file.length;i++){
    if (!pic_file[i].result){
      // no user image default vehicle
      // var fs_data = fs.readFileSync(process.env.DEFAULTIMAGE + 'vehecle_defualt_image.jpg')
      // zip.addFile(pic_file[i].picture_name , Buffer.from(fs_data), "egat export image");
    } else {
      zip.addLocalFile(process.env.SRCDIRVEHICLE + pic_file[i].picture_name);
    }
  }
  const data = zip.toBuffer();
  return data
}