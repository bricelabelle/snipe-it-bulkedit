# snipe-it-bulkedit
Google Script files to use Google Sheets as a bulk checkout/checkin/edit tool for Snipe-it.

1. Create a new Google Sheet
2. Within your sheet, create another sheet called "Errors".
3. Under the Extensions menu choose Apps Script.
4. Under the File menu for the apps script, create new script files and html files with the same names as the files in this repo.
5. Copy the contents of the repo files to their corresponding google script/html files.
6. Enter your Snipe-it server URL and API key on the Setup.gs script.
7. Save, then close and reopen your sheet. You should now see a "Run Command" option in the menu bar.
8. From the Run Command menu, choose "Sync Snipe Locations". This will pull in all your location names to make check-in/check-out more reliable.
9. Go back to your main tab and scan or enter asset tags in any single column. I use the Barcode to PC app. https://barcodetopc.com/
10. Highlight the tags you just entered and then choose an option from the Run Command menu.

NOTE: You may need to first run one of the test functions manually (in the script editor) so Google will have you authorize the script's permissions.
