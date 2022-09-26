"use strict";

var Utilities = require( "./utilities.js" );
var PreferenceNames = require( "./preferenceNames.js" );

module.exports = new Promise( ( resolve, reject ) => {
    try {
    	var preferences = Utilities.getPreferences( "android" );

        // Set values to strings.xml
        if ( Utilities.androidStringsXmlFileExists() ) {
            var stringsXml = Utilities.getAndroidStringsXmlFileContents();
            stringsXml.resources.string = Utilities.normalizeXmlNode( stringsXml.resources.string );

            // Set application name
            var appName = preferences[ PreferenceNames.OsApplicationShortName ] || Utilities.getApplicationName();
            if ( Utilities.compareStrings( preferences[ PreferenceNames.OsAddEnvironmentSuffixToName ], "true" ) ) {
                appName = Utilities.addEnvironmentSuffix( appName,
                    preferences[ PreferenceNames.OsAppIdentifierDevelopment ],
                    preferences[ PreferenceNames.OsAppIdentifierTesting ],
                    preferences[ PreferenceNames.OsAppIdentifierPreProduction ] );
            }
            for ( var i = 0; i < stringsXml.resources.string.length; i++ ) {
                if ( stringsXml.resources.string[ i ]._attributes.name == "app_name" ) {
                    stringsXml.resources.string[ i ]._text = appName;
                    break;
                }
            }

            // Save to file
            Utilities.writeAndroidStringsXmlFileContents( stringsXml );
        }
        else {
            throw Error( "Unable to find strings.xml file." );
        }
        
    	resolve();
	}
    catch( err ) {
        reject( err );
    }
} );
