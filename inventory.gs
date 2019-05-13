//Takes a tag number and returns the snipe id for the asset.
//(The id is what's used to make changes to an asset)
function getAssetIDByTag(tag) {
  
  var url = serverURL + 'api/v1/hardware?search=' + tag;
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers
  };
  
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var rows = response.rows;
  
  for (var i=0; i<rows.length; i++) {
    var row = rows[i];
    if (row.asset_tag == tag) {
      var id = row.id 
      return id
    }
  }
}


//Takes a snipe device id and status id in form of a number, 
//then updates the device to that status.
function updateAssetStatus(id, status){
  var data = {}
  data["status_id"]=status
  
  
  var url = serverURL + 'api/v1/hardware/' + id
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "PATCH",
    "contentType" : "application/json",
    "headers" : headers,
    "payload" : JSON.stringify(data)
  };
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  
  return response;
}


function checkInAsset(id,location){
  var data = {}
  if ( location ){
        data["location_id"]=location
  }
  var url = serverURL + 'api/v1/hardware/' + id + '/checkin'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "POST",
    "contentType" : "application/json",
    "headers" : headers,
    "payload": JSON.stringify(data)
  };
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  
  return response;
}

function testCheckOutAsset(){
  checkOutAsset("8311","1805")
}
function checkOutAsset(id,location){
  var data = {}
  data["assigned_location"]=location
  data["checkout_to_type"]="location"
  
  var url = serverURL + 'api/v1/hardware/' + id + '/checkout'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "POST",
    "contentType" : "application/json",
    "headers" : headers,
    "payload" : JSON.stringify(data)
  };
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  if ( response.messages == "That asset is not available for checkout!" ){
    checkInAsset(id)
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
  }
  return response;
}

function getStatusIDByName(name){
  var url = serverURL + 'api/v1/statuslabels?search=' + name
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers,
  };
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
   var rows = response.rows
  for (var i=0; i<response.total; i++){
    var row = rows[i]
    if ( row.name == name ){
      var status_id = row.id
      return status_id
    }
  }
  return response;
}

function testGetLocationIDByName(){
  var id = getLocationIDByName("Test Location")
  //Logger.log(id)
}
function getLocationIDByName(name){
  var url = serverURL + 'api/v1/locations?search=' + name
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers,
  };
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
   var rows = response.rows
  for (var i=0; i<response.total; i++){
    var row = rows[i]
    if ( row.name == name ){
      var location_id = row.id
      return location_id
    }
  }
  return response;
}
