var http = require("http");
var https = require('https');
var fs  = require('fs');

const login = async (user, pass) => {
  try {


    var options = {
      hostname: 'https://edms.egat.co.th',
      port: 80,
      path: '/itpservice/authapi/authapi.php',
      method: 'GET',
      cert: fs.readFileSync('C:\\Workshop\\EGAT-Longbor-WebAPI\\pem\\cacert.pem'),  
    };
    
    var req = https.request(options, function(res) {
    res.on('data', function(d) {
      process.stdout.write(d);
      });
    });
    
    req.end()


    return {
      isError: false,
      data: rows
    }
  }catch(e) {
    return {
      isError: true,
      data: e
    }
  }
}

module.exports = {
  login
};


// <?php
// function CallAPI($url, $param_arr){
// 	$param_arr = http_build_query($param_arr,'','&');
// 	//echo $param_arr;
// 	$ch = curl_init($url);
// 	curl_setopt($ch, CURLOPT_HEADER,0);
// 	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
// 	curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
// 	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,"false");
// 	curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__)."/cacert.pem");
// 	curl_setopt($ch, CURLOPT_POSTFIELDS, $param_arr);
// 	$response = curl_exec($ch);
// 	echo curl_error($ch);
// 	curl_close($ch);
// 	return $response;
// }
// $url = "https://edms.egat.co.th/itpservice/authapi/authapi.php";
// $param_arr['action'] = "Login";
// $param_arr['akey'] = "9670db0eb2a07bed157f6fba61974e15";
// $param_arr['eno'] = "admin";
// $param_arr['pwd'] = "admin";
// $param_arr['ip'] = "127.0.0.1";
// $param_arr['type'] = "json";

// //print_r($param_arr);

// $data = CallAPI($url, $param_arr);
// $arr_data = json_decode($data,true);
// print_r($arr_data);
// ?>