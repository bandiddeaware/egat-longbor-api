var router = require('express').Router();

const AdmZip = require('adm-zip');
var fs = require('fs');
var uploadDir = fs.readdirSync(process.env.DESTDIR); 
var auth = require("./../auth")
const util = require('util');
const path = require('path');

async function cpFile() {
  const copyFilePromise = util.promisify(fs.copyFile);

  function copyFiles(srcDir, destDir, files) {
      return Promise.all(files.map(f => {
        return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
      }));
  }

  // usage
  // copyFiles(process.env.SRCDIRPERSON, process.env.DESTDIR, ['1123334222450.jpg', '12345678912341.jpg']).then(() => {
  //   console.log("done");
  // }).catch(err => {
  //   console.log(err);
  // });
  let result 
  try {
    await copyFiles(process.env.SRCDIRPERSON, process.env.DESTDIR, ['1123334222450.jpg', '12345678912341.jpg'])
    result = {
      success: true,
      mes: '',
    }
  }catch (e) {
    result = {
      success: true,
      mes: e
    }
  }
  return result
  
}

router.get('/zip', auth.required, async function(req, res, next) {

  const aaaaaa = await cpFile()
  console.log(aaaaaa)
  
  console.log(req.query.person)
  const zip = new AdmZip();
  console.log(uploadDir)
  for(var i = 0; i < uploadDir.length;i++){
    zip.addLocalFile(process.env.DESTDIR + uploadDir[i]);
  }
  const downloadName = `export.zip`;
  const data = zip.toBuffer();
  // zip.writeZip("C:\\Workshop\\EGAT-Longbor-WebAPI\\sand-box\\"+downloadName);
  res.set('Content-Type','application/octet-stream');
  res.set('Content-Disposition',`attachment; filename=${downloadName}`);
  res.set('Content-Length',data.length);
  return res.status(200).send(data);
})
module.exports = router;