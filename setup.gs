serverURL = 'https://yourserver.yourdomain.com/';
apiKey = 'yourapikey';

function onOpen(e) {
  createCommandsMenu();
  syncLocations();
}

function createCommandsMenu() {
  var ui = SpreadsheetApp.getUi();
      ui.createMenu('Run Command')
      .addItem('Bulk Checkin', 'bulkCheckin')
      .addItem('Bulk Checkout', 'bulkCheckout')
      .addItem('Bulk Update Status', 'bulkUpdateStatus')
      .addItem('Sync Snipe Locations','syncLocations')
      .addToUi();
}