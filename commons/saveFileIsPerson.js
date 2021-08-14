var fs = require('fs')

module.exports = async (buffer_data, name) => {
  try {
    await fs.writeFileSync((process.env.PRODUCTIONAPI === 'false' ? 'C:\\xampp\\htdocs\\pimage\\': "/var/www/html/pimage/") + name +  ".jpg", buffer_data, 'binary')
    return {
      result: true
    }
  }catch (e) {
    return {
      result: false,
      errors: e
    }
  }
}