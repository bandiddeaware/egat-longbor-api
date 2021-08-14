// const AdmZip = require('adm-zip');
// var fs = require('fs');
// var uploadDir = fs.readdirSync("C:\\Workshop\\EGAT-Longbor-WebAPI\\sand-box"); 
// const util = require('util');
// const path = require('path');

// function cpFile () {
//    const copyFilePromise = util.promisify(fs.copyFile);
 
//    function copyFiles(srcDir, destDir, files) {
//        return Promise.all(files.map(f => {
//          return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
//        }));
//    }
//    // usage
//    copyFiles('C:\\xampp\\htdocs\\pimage\\', 'C:\\Workshop\\EGAT-Longbor-WebAPI\\sand-box\\', ['1123334222450.jpg', '12345678912341.jpg', '1361001331368.jpg', '1529900228191.jpg']).then(() => {
//      console.log("done");
//    }).catch(err => {
//      console.log(err);
//    });
//  }

//  cpFile()

var fs = require('fs');
var person_image = [
  '11448765894659.jpg',
  '11448765894658.jpg',
  '114487653223658.jpg',
  '11448765894663.jpg',
  '1234567893210.jpg',
  '1234567893147.jpg'
]

const findPicture = (person_image) => {
  var uploadDir = fs.readdirSync('C:\\xampp\\htdocs\\pimage\\'); 
  var match = []
  person_image.forEach((item1) => {
    var find = ""
    uploadDir.forEach((item2) => {
      if (item1 === item2){
        find = item2
      }
    })
    if (find === ''){
      match.push('person_defualt_image.jpg')
    }else {
      match.push(find)
    }
  })
  return match
}


console.log(findPicture(person_image))