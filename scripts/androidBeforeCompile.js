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

            if ( preferences[ PreferenceNames.OsApplicationShortName ] ) {
                for ( var i = 0; i < stringsXml.resources.string.length; i++ ) {
                    if ( stringsXml.resources.string[ i ]._attributes.name == "app_name" ) {
                        stringsXml.resources.string[ i ]._text = preferences[ PreferenceNames.OsApplicationShortName ];
                        break;
                    }
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
