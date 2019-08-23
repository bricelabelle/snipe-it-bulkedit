# snipe-it-bulkedit
Google Script files to use Google Sheets as a bulk checkout/checkin/edit tool for Snipe-it.

1. Create a new Google Sheet
2. Under the tools menu choose Script Editor
3. Under the File menu, create new script files and html files with the same names as the files in this repo.
4. Copy the contents of the repo files to their corresponding google script/html files.
5. Enter your Snipe-it server URL and API key on the Setup.gs script.
6. Save, then close and reopen your sheet. You should now see a "Run Command" option in the menu bar.
7. Create a tab in your sheet called "Errors". Any assets that cannot be checked in or out for some reason will show up there each time you run the command.
8. Create another tab in your sheet called "Locations" (You can hide this tab after you create it if you want).
9. Go back to your main tab and scan or enter asset tags in any single column. I use the Barcode to PC app. https://barcodetopc.com/
10. Highlight the tags you just entered and then choose an option from the Run Command menu.

NOTE: You may need to first run one of the test functions manually (in the script editor) so Google will have you authorize the script's permissions.
