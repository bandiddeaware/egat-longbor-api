var router = require('express').Router();
var auth = require("../../auth")

var mangerfid = require("../../../mysql/MangeRFID/Find")
// const check_request = (
//   id_card,
//   license,
//   card_type,
// ) => {
//   if (id_card !== undefined){
//     if (card_type === 'person_all' || card_type === "1" || card_type === "2" || card_type === "3" || card_type === "4" || card_type === "5"){
//       return {
//         status: true, 
//         error: ""
//       }
//     } else {
//       return {
//         status: false, 
//         error: "card_type invalid value (person_all, 1, 2, 3, 4, 5)"
//       }
//     }
//   } else if (license !== undefined){
//     if (card_type === 'vehicle_all' || card_type === "101" || card_type === "102" || card_type === "103"){
//       return {
//         status: true, 
//         error: ""
//       }
//     } else {
//       return {
//         status: false, 
//         error: "card_type invalid value (vehicle_all, 101, 102, 103)"
//       }
//     }
//   } else {
//     return {
//       status: true, 
//       error: ""
//     }
//   }
// }

const check_request = (
  card_type,
) => {
  if (card_type !== undefined){
    if (card_type === 'person_all' || card_type === "1" || card_type === "2" || card_type === "3" || card_type === "4" || card_type === "5" || card_type === 'vehicle_all' || card_type === "101" || card_type === "102" || card_type === "103"){
      return {
        status: true, 
        error: ""
      }
    } else {
      return {
        status: false, 
        error: "card_type invalid value (person_all, 1, 2, 3, 4, 5, vehicle_all, 101, 102, 103)"
      }
    }
  }else {
    return {
      status: true, 
      error: ""
    }
  }
}

router.post('/', auth.required, async function(req, res, next) {
  if (!req.body.offset){
    return res.status(400).json({errors: {message: "offset can't be blank"}});
  }
  if (!req.body.limit){
    return res.status(400).json({errors: {message: "limit can't be blank"}});
  }
  const check_rq = check_request(
    req.body.card_type,
  )

  if (check_rq.status){
    const result = await mangerfid.Find(
      req.body.id_card,
      req.body.license,
      req.body.uhf_id,
      req.body.mifare_id,
      req.body.card_type,
      req.body.status_active,
      req.body.status_loss,
      req.body.status_idle,
      req.body.offset,
      req.body.limit,
    )
    if (result.isError === false){
      return res.status(200).json({ data: result.data, length: result.count[0].length, status: true })
    } else {
      return res.status(500).json( {data: result.data, status: false} )
    }
  } else {
    return res.status(400).json({errors: {message: check_rq.error}});
  }
})

module.exports = router;