//Takes a tag number and returns the snipe id for the asset.
//The id is what's used to make changes to an asset.
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

function testCheckInAsset(){
  checkInAsset("72","1863")
}
function checkInAsset(id,location){
  //clear any outstanding errors
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors")
      sheet.clear()
      
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
   try {
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  }
  catch(e){
    return "Error"
  }
}

function testCheckOutAsset(){
  checkOutAsset("72",null)
}
function checkOutAsset(id,location,user){
  //clear any outstanding errors
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors")
      sheet.clear()
      
  var data = {}
  if (location) {
    data["assigned_location"]=location
    data["checkout_to_type"]="location"
  }
  if (user) {
    data["assigned_user"]=user
    data["checkout_to_type"]="user"
  }
      
  var url = serverURL + 'api/v1/hardware/' + id + '/checkout'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "POST",
    "contentType" : "application/json",
    "headers" : headers,
    "payload" : JSON.stringify(data),
  };
  try {
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  }
  catch(e){
    return "Error"
  }
  if ( response.messages == "That asset is not available for checkout!" ){
    checkInAsset(id)
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
  }
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
  var id = getLocationIDByName("CC 325")
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
    try {
   var response = JSON.parse(UrlFetchApp.fetch(url, options));
  }
  catch(e){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Errors")
    sheet.appendRow(["LOCATION ERROR: ",e])
    return
  }
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

function getUserIDByUsername(username){
  var url = serverURL + 'api/v1/users?search=' + username
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
    if ( row.username == username ){
      var user = row.id
      return user
    }
  }
  return response;
}


function syncLocations(){
  var locations = []
  var url = serverURL + 'api/v1/locations'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers,
  };
  
  //run once to get the total to use for the limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var limit = response.total
  
  //run again with the limit so Google actually returns all the results.
  var url = serverURL + 'api/v1/locations?limit=' + limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var rows = response.rows
  
  for (var i=0; i<response.total; i++){
    var row = rows[i]
    locations.push(row.name)
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Locations")
  //create the sheet if it doesn't exist
  if ( ! ss ){
   var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet()
   newSheet.setName("Locations")
   var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Locations")
   ss.hideSheet()
  }
  var range = ss.getRange(1,1)
      range.setValue(JSON.stringify(locations))
  return locations
}

function getLocations(){
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Locations")
 var locations = JSON.parse(ss.getRange(1,1).getValues()[0])
 Logger.log(locations)
 return locations
}

function syncStatusLabels(){
  var statuslabels = []
  var url = serverURL + 'api/v1/statuslabels'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers,
  };
  
  //run once to get the total to use for the limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var limit = response.total
  
  //run again with the limit so Google actually returns all the results.
  var url = serverURL + 'api/v1/statuslabels?limit=' + limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var rows = response.rows
  
  for (var i=0; i<response.total; i++){
    var row = rows[i]
    statuslabels.push(row.name)
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Status Labels")
  //create the sheet if it doesn't exist
  if ( ! ss ){
   var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet()
   newSheet.setName("Status Labels")
   var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Status Labels")
   ss.hideSheet()
  }
  var range = ss.getRange(1,1)
      range.setValue(JSON.stringify(statuslabels))
  return statuslabels
}

function getStatusLabels(){
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Status Labels")
 var statuslabels = JSON.parse(ss.getRange(1,1).getValues()[0])
 Logger.log(statuslabels)
 return statuslabels
}

function syncUsers(){
  var users = []
  var url = serverURL + 'api/v1/users'
  var headers = {
    "Authorization" : "Bearer " + apiKey
  };
  
  var options = {
    "method" : "GET",
    "contentType" : "application/json",
    "headers" : headers,
  };
  
  //run once to get the total to use for the limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var limit = response.total
  
  //run again with the limit so Google actually returns all the results.
  var url = serverURL + 'api/v1/users?limit=' + limit
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var rows = response.rows
  
  for (var i=0; i<response.total; i++){
    var row = rows[i]
    users.push(row.username)
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users")
  //create the sheet if it doesn't exist
  if ( ! ss ){
   var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet()
   newSheet.setName("Users")
   var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users")
   ss.hideSheet()
  }
  var range = ss.getRange(1,1)
      range.setValue(JSON.stringify(users))
  return users
}

function getUsers(){
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users")
 var users = JSON.parse(ss.getRange(1,1).getValues()[0])
 Logger.log(users)
 return users
}