var fs = require('fs');
const util = require('util');
const path = require('path');

async function cpFile(pic_file) {
  const copyFilePromise = util.promisify(fs.copyFile);
  function copyFiles(srcDir, destDir, files) {
      return Promise.all(files.map(f => {
        return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
      }));
  }
  let result 
  try {
    await copyFiles(process.env.SRCDIRPERSON, process.env.DESTDIR, pic_file)
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

module.exports = async (pic_file) => {
  var result = await cpFile(pic_file)
}