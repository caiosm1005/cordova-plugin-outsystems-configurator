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

            // Set application name
            var appName = preferences[ PreferenceNames.OsApplicationShortName ] || Utilities.getApplicationName();
            if ( Utilities.compareStrings( preferences[ PreferenceNames.OsAddEnvironmentSuffixToName ], "true" ) ) {
                appName = Utilities.addEnvironmentSuffix( appName,
                    preferences[ PreferenceNames.OsAppIdentifierDevelopment ],
                    preferences[ PreferenceNames.OsAppIdentifierTesting ],
                    preferences[ PreferenceNames.OsAppIdentifierPreProduction ] );
            }
            appName = Utilities.applyIosImprovedSpaces( appName );
            plistObj.CFBundleDisplayName = appName;
            plistObj.CFBundleName = appName;

            // Check for OS UI Style
            if ( preferences[ PreferenceNames.OsUserInterfaceStyle ] ) {
                var value = preferences[ PreferenceNames.OsUserInterfaceStyle ];
                if ( Utilities.compareStrings( value, "automatic" ) ) {
                    plistObj.UIUserInterfaceStyle = "Automatic";
                }
                else if ( Utilities.compareStrings( value, "light" ) ) {
                    plistObj.UIUserInterfaceStyle = "Light";
                }
                else if ( Utilities.compareStrings( value, "dark" ) ) {
                    plistObj.UIUserInterfaceStyle = "Dark";
                }
            }

            // Save to file
            Utilities.writeIosPlistFileContents( plistObj );
        }
        else {
            throw Error( "Unable to find " + Utilities.getApplicationName() + "-Info.plist file." );
        }

        resolve();
    }
    catch( err ) {
        reject( err );
    }
} );
