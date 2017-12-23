var cfg = require('../config/api-config');
var ActiveCampaign = require("activecampaign");
const ac = new ActiveCampaign(cfg.url, cfg.api_key);
var axios = require("axios");
const xhttp = axios.create({  
  headers: {
    'api_key': cfg.api_key,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
//ac.debug = true;

function jsonToURLEncoded (element, key, list) {
  let pList = list || []
  if (typeof (element) === 'object') {
    for (var idx in element) {
      jsonToURLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, pList)
    }
  } else {
    list.push(key + '=' + encodeURIComponent(element))
  }
  return pList.join('&')
}

module.exports = function(app, db) {
  /*
  * Gets status of api account access
  */
  app.get(cfg.test_url, (req, res) => {
    ac.credentials_test().then((result) => {
      // successful request
      if (result.success) {
        res.send("Your account access is valid!!");
      } else {
        res.send("Your account access is invalid!!");
      }
    }, function(result) {
      res.send(result);
    });
  });

  /*
  * Gets status of this server
  */
  app.get(cfg.health_url, (req, res) => {    
    res.send("Yeah we're good!!");
  });
  
  /* 
  * Adds new contact
  * request.body:  {
  *  "first_name": "First",
  *  "last_name": "Last",
  *  "email": "test@test.com",
  *  "\"p": [ active list ids comma separated
  *      "\"1\""
  *  ]
  */
  app.post(cfg.new_contact_url, (req, res) => {
    // *This does not work ** 
    xhttp.post(cfg.url + cfg.api_path, jsonToURLEncoded(req.body)).then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    // *This works** 
    // ac.api('contact/add', req.body).then( (response) => {      
    //   if (response.success) {        
    //     res.send(response);
    //   }
    //   else {        
    //     res.send(response.error);
    //   }
    // });    
  });  
}