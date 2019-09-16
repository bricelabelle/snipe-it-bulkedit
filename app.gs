//called by bulk_checkin.html
function runBulkCheckin(form){
  var status_name = form.status_name
  var status = getStatusIDByName(status_name)
  var location = form.location
  Logger.log(location)
  if ( location != "" ){
    var location = getLocationIDByName(location)
    }else{
    var location = null
    }
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var range = ss.getActiveRange()
  var tags = range.getValues()
  for (var i=0; i<tags.length; i++){
    var tag = tags[i]
    var id = getAssetIDByTag(tag)
    var checkin = checkInAsset(id,location)
    if (checkin == "Error"){
       var message = "Could not check in " + tag + ". Try a manual check-in in Snipe."
       reportErrors(message);
       return
    }
    updateAssetStatus(id,status)
  }
}

//called by bulk_checkout.html
function runBulkCheckout(form){
  var status_name = form.status_name
  var status = getStatusIDByName(status_name)
  if (form.location){
    var location = form.location
    var location = getLocationIDByName(location)
  }
  if (form.username) {
    var username = form.username
    var user = getUserIDByUsername(username)
  }
  
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var range = ss.getActiveRange()
  var tags = range.getValues()
  if (location){
    for (var i=0; i<tags.length; i++){
      var tag = tags[i]
      var id = getAssetIDByTag(tag)
      updateAssetStatus(id,status)
      var checkout = checkOutAsset(id,location)
      if (checkout == "Error"){
        var message = "Could not check out " + tag + ". Try a manual check-out in Snipe."
        reportErrors(message);
        return
      }
    }
  }
  if (user){
    for (var i=0; i<tags.length; i++){
      var tag = tags[i]
      var id = getAssetIDByTag(tag)
      updateAssetStatus(id,status)
      var checkout = checkOutAsset(id,null,user)
      if (checkout == "Error"){
       var message = "Could not check out " + tag + ". Try a manual check-out in Snipe."
       reportErrors(message);
       return
      } 
    }
  }
}

//called by bulk_update.html
function runBulkUpdate(form){
  var status_name = form.status_name
  var status = getStatusIDByName(status_name)
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var range = ss.getActiveRange()
  var tags = range.getValues()
  for (var i=0; i<tags.length; i++){
    var tag = tags[i]
    var id = getAssetIDByTag(tag)
    updateAssetStatus(id,status)
  }
}

//evaluates the specified template.
function bulkChanges(template){
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getActiveSheet();
  var range = ss.getActiveRange().getValues()
  var tags = range
  var template = HtmlService.createTemplateFromFile(template);
      template.tags = tags
  var html = template.evaluate()
        .setWidth(500)
        .setHeight(400)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

//called by menu buttons on sheet
function bulkCheckin(){
  bulkChanges('bulk_checkin.html')
}

function bulkCheckout(){
  bulkChanges('bulk_checkout.html')
}

function bulkUpdateStatus(){
  bulkChanges('bulk_update.html')
}

function reportErrors(message){
    var template = HtmlService.createTemplateFromFile('errors.html');
        template.message = message
    var html = template.evaluate()
        .setWidth(500)
        .setHeight(400)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        SpreadsheetApp.getUi().showModalDialog(html, ' ');
}