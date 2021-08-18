// config.js 
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;











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

// var fs = require('fs');
// var person_image = [
//   '11448765894659.jpg',
//   '11448765894658.jpg',
//   '114487653223658.jpg',
//   '11448765894663.jpg',
//   '1234567893210.jpg',
//   '1234567893147.jpg'
// ]

// const findPicture = (person_image) => {
//   var uploadDir = fs.readdirSync('C:\\xampp\\htdocs\\pimage\\'); 
//   var match = []
//   person_image.forEach((item1) => {
//     var find = ""
//     uploadDir.forEach((item2) => {
//       if (item1 === item2){
//         find = item2
//       }
//     })
//     if (find === ''){
//       match.push('person_defualt_image.jpg')
//     }else {
//       match.push(find)
//     }
//   })
//   return match
// }


// console.log(findPicture(person_image))

















// var mysql = require('./mysql/connection')

// async function find_assambly_point(conn, query) {
//   return Promise.all(query.map(q => {
//     return conn.query(q)
//   }));
// }

// async function test() {
//   const conn = await mysql.connection()
//   const [result_person] = await conn.query(`
//     SELECT 
      
//       ps.id AS person_id,
//       ps.idcard,
//       ps.firstname ,
//       ps.lastname,
//       cp.id AS company_id,
//       cp.name AS company_name,
//       card_st.description AS card_status_desc,
//       card_t.description AS card_type_desc,
//       card.id AS card_id,

//       IF(ps.asbp_checked_at > ps.check_in_at, TRUE, FALSE) AS is_in_assambly_point,
//       ps.check_in_at,
//       ps.check_out_at,
//       ps.asbp_checked_at

//     FROM person AS ps 

//     LEFT JOIN card AS card
//       ON ps.card_id = card.id

//     LEFT JOIN card_type AS card_t
//       ON card.type = card_t.id

//     LEFT JOIN card_status AS card_st
//       ON card.status = card_st.id

//     LEFT JOIN company AS cp
//       ON cp.id = ps.company_id

//     WHERE 
//       ps.check_in_at > ps.check_out_at AND 

//       ps.check_in_at IS NOT NULL AND 
//       ps.check_out_at IS NOT NULL AND
//       ps.asbp_checked_at IS NOT NULL AND 

//       ps.card_id IS NOT NULL
//   `)
//   var this_person = []
//   result_person.forEach((item, index) => {
//     this_person.push(`SELECT aspl.station_id as station_id FROM assembly_point_log AS aspl WHERE aspl.person_id = "${item.person_id}" ORDER BY aspl.access_time DESC LIMIT 1 OFFSET 0`)
//   })
//   console.log(this_person)
//   const result = await find_assambly_point(conn, this_person)
//   // console.log("station_id: ",result[0][0][0].station_id)
//   // console.log("station_id: ",result[1][0][0].station_id)
//   // console.log("station_id: ",result[2][0][0].station_id)
//   result.forEach(i => console.log("station_id: ", i[0][0].station_id))
// }

// test()





var mysql = require('./mysql/connection')

async function test() {
  const conn = await mysql.connection()
  const [result_person] = await conn.query(`
    select id from person where 1    
  `)
  var csv = ''
  result_person.forEach((item) => {
    csv += item.id + ","
  })
  console.log(csv)
  // var this_person = []
  // result_person.forEach((item, index) => {
  //   this_person.push(`SELECT aspl.station_id as station_id FROM assembly_point_log AS aspl WHERE aspl.person_id = "${item.person_id}" ORDER BY aspl.access_time DESC LIMIT 1 OFFSET 0`)
  // })
  // console.log(this_person)
  // const result = await find_assambly_point(conn, this_person)
  // // console.log("station_id: ",result[0][0][0].station_id)
  // // console.log("station_id: ",result[1][0][0].station_id)
  // // console.log("station_id: ",result[2][0][0].station_id)
  // result.forEach(i => console.log("station_id: ", i[0][0].station_id))
}

test()