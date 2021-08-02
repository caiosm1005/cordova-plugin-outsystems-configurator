"use strict";

var Utilities = require( "./utilities.js" );
var PreferenceNames = require( "./preferenceNames.js" );

module.exports = new Promise( ( resolve, reject ) => {
    try {
        var preferences = Utilities.getPreferences( "ios" );

        // Set Plist values
        if ( Utilities.iosPlistFileExists() ) {
            var plistObj = Utilities.getIosPlistFileContents();
            
            // Clear our extensibility preference names added by OutSystems
            for ( var p in plistObj ) {
                if ( typeof PreferenceNames[ p ] !== "undefined" ) {
                    delete plistObj[ p ];
                }
            }

            // Set variables according to preferences
            if ( preferences[ PreferenceNames.OsApplicationShortName ] ) {
                // Replace spacing characters with a special spacing for improving the name of the app in the homescreen
                // Source: https://stackoverflow.com/a/58393735/1608072
                plistObj.CFBundleDisplayName = preferences[ PreferenceNames.OsApplicationShortName ];
            }
            if ( preferences[ PreferenceNames.OsPhotoLibraryUsageDescription ] ) {
                plistObj.NSPhotoLibraryUsageDescription = preferences[ PreferenceNames.OsPhotoLibraryUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsPhotoLibraryAddUsageDescription ] ) {
                plistObj.NSPhotoLibraryAddUsageDescription = preferences[ PreferenceNames.OsPhotoLibraryAddUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsCameraUsageDescription ] ) {
                plistObj.NSCameraUsageDescription = preferences[ PreferenceNames.OsCameraUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsLocationUsageDescription ] ) {
                plistObj.NSLocationWhenInUseUsageDescription = preferences[ PreferenceNames.OsLocationUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsLocationAlwaysUsageDescription ] ) {
                plistObj.NSLocationAlwaysUsageDescription = preferences[ PreferenceNames.OsLocationAlwaysUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsContactsUsageDescription ] ) {
                plistObj.NSContactsUsageDescription = preferences[ PreferenceNames.OsContactsUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsCalendarUsageDescription ] ) {
                plistObj.NSCalendarsUsageDescription = preferences[ PreferenceNames.OsCalendarUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsNfcUsageDescription ] ) {
                plistObj.NFCReaderUsageDescription = preferences[ PreferenceNames.OsNfcUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsBluetoothUsageDescription ] ) {
                plistObj.NSBluetoothPeripheralUsageDescription = preferences[ PreferenceNames.OsBluetoothUsageDescription ];
            }
            if ( preferences[ PreferenceNames.OsMicrophoneUsageDescription ] ) {
                plistObj.NSMicrophoneUsageDescription = preferences[ PreferenceNames.OsMicrophoneUsageDescription ];
            }

            // Save to file
            Utilities.writeIosPlistFileContents( plistObj );
        }

        resolve();
    }
    catch( err ) {
        reject( err );
    }
} );
