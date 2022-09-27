"use strict";

var fs = require( "fs" );
var plist = require( "plist" );
var convert = require( "xml-js" );
var PreferenceNames = require( "./preferenceNames.js" );

// Array forEach polyfill
if ( ! Array.prototype.forEach ) {
    Array.prototype.forEach = function( fn, scope ) {
        for ( var i = 0, len = this.length; i < len; ++i ) {
            fn.call( scope, this[ i ], i, this );
        }
    }
}

// Config object cache
var cachedConfig = null;

// Utilities object
module.exports = {

    /**
     * Get plugin ID
     */
    getPluginId: function() {
        return "cordova-plugin-outsystems-configurator";
    },

    /**
     * Get application name
     */
    getApplicationName: function() {
        var configObj = this.getConfigXmlContents();
        return this.trimString( configObj.name._text );
    },

    /**
     * Get application ID (package name)
     */
    getApplicationId: function() {
        var configObj = this.getConfigXmlContents();
        return this.trimString( configObj._attributes.id );
    },

    /**
     * Get preference value
     */
    getPreference: function( name, platform ) {
        var configObj = this.getConfigXmlContents();
        var parentNode = configObj;
        if ( platform && configObj.platform ) {
            var platformNode = this.normalizeXmlNode( configObj.platform );
            for ( var i = 0; i < platformNode.length; i++ ) {
                if ( platformNode[ i ]._attributes.name.toLowerCase() == platform.toLowerCase() ) {
                    parentNode = platformNode[ i ];
                    break;
                }
            }
        }
        if ( parentNode.preference ) {
            var preferenceNode = this.normalizeXmlNode( parentNode.preference );
            for ( var i = 0; i < preferenceNode.length; i++ ) {
                if ( preferenceNode[ i ]._attributes.name.toLowerCase() == name.toLowerCase() ) {
                    return preferenceNode[ i ]._attributes.value;
                }
            }
        }
        if ( parentNode !== configObj ) {
            return this.getPreference( name, null );
        }
        return null;
    },

    /**
     * Get all preference values
     */
    getPreferences: function( platform ) {
        var preferences = {};
        var configObj = this.getConfigXmlContents();
        var parentNode = configObj;
        if ( platform && configObj.platform ) {
            var platformNode = this.normalizeXmlNode( configObj.platform );
            for ( var i = 0; i < platformNode.length; i++ ) {
                if ( platformNode[ i ]._attributes.name.toLowerCase() == platform.toLowerCase() ) {
                    parentNode = platformNode[ i ];
                    break;
                }
            }
        }
        if ( parentNode.preference ) {
            var preferenceNode = this.normalizeXmlNode( parentNode.preference );
            for ( var i = 0; i < preferenceNode.length; i++ ) {
                var preferenceName = preferenceNode[ i ]._attributes.name.toLowerCase();
                var preferenceValue = preferenceNode[ i ]._attributes.value;
                preferences[ preferenceName ] = preferenceValue;
            }
        }
        if ( parentNode !== configObj ) {
            var rootPreferences = this.getPreferences( null );
            for ( var p in rootPreferences ) {
                if ( typeof preferences[ p ] === "undefined" ) {
                    preferences[ p ] = rootPreferences[ p ];
                }
            }
        }
        return preferences;
    },

    /**
     * Get application configuration object
     */
    getConfigXmlContents: function() {
        if ( cachedConfig === null ) {
            cachedConfig = this.getXmlFileContents( "config.xml" );
            cachedConfig = cachedConfig.widget;
        }
        return cachedConfig;
    },

    /**
     * Get XML file contents
     */
    getXmlFileContents: function( filepath, parseOpts ) {
        if ( ! fs.existsSync( filepath ) ) {
            throw new Error( "Cannot find XML file at \"" + filepath + "\"." );
        }
        parseOpts = parseOpts || { compact: true };
        return JSON.parse( convert.xml2json( fs.readFileSync( filepath, "utf-8" ), parseOpts ) );
    },

    /**
     * Write XML file contents
     */
    writeXmlFileContents: function( jsonObj, filepath, parseOpts ) {
        parseOpts = parseOpts || { compact: true, spaces: 4 };
        var xmlStr = convert.json2xml( JSON.stringify( jsonObj ), parseOpts );
        fs.writeFileSync( filepath, xmlStr );
    },

    /**
     * Normalize XML node
     */
    normalizeXmlNode: function( xmlNode ) {
        return Array.isArray( xmlNode ) ? xmlNode : [ xmlNode ];
    },

    /**
     * Get JSON file contents
     */
    getJsonFileContents: function( filepath ) {
        return JSON.parse( fs.readFileSync( filepath ) );
    },

    /**
     * Get Android strings.xml file contents
     */
    getAndroidStringsXmlFileContents: function() {
        var filepath = "platforms/android/app/src/main/res/values/strings.xml";
        return this.getXmlFileContents( filepath );
    },

    /**
     * Write Android strings.xml file contents
     */
    writeAndroidStringsXmlFileContents: function( stringsXml ) {
        var filepath = "platforms/android/app/src/main/res/values/strings.xml";
        this.writeXmlFileContents( stringsXml, filepath );
    },

    /**
     * Check if Android strings.xml file exists
     */
    androidStringsXmlFileExists: function() {
        var filepath = "platforms/android/app/src/main/res/values/strings.xml";
        return fs.existsSync( filepath );
    },

    /**
     * Get iOS Plist file contents
     */
    getIosPlistFileContents: function() {
        var appName = this.getApplicationName();
        var filepath = "platforms/ios/" + appName + "/" + appName + "-Info.plist";
        if ( ! fs.existsSync( filepath ) ) {
            throw new Error( "Cannot find Plist file at \"" + filepath + "\"." );
        }
        var xml = fs.readFileSync( filepath, "utf8" );
        var plistObj = plist.parse( xml );
        return plistObj;
    },

    /**
     * Write iOS Plist file contents
     */
    writeIosPlistFileContents: function( plistObj ) {
        var appName = this.getApplicationName();
        var filepath = "platforms/ios/" + appName + "/" + appName + "-Info.plist";
        var xml = plist.build( plistObj );
        fs.writeFileSync( filepath, xml, { encoding: "utf8" } );
    },

    /**
     * Check if iOS Plist file exists
     */
    iosPlistFileExists: function() {
        var appName = this.getApplicationName();
        var filepath = "platforms/ios/" + appName + "/" + appName + "-Info.plist";
        return fs.existsSync( filepath );
    },

    /**
     * Get plugin variables
     */
    getPluginVariables: function() {
        var variables = {};

        // Parse plugin.xml
        var pluginPath = "plugins/" + this.getPluginId() + "/plugin.xml";

        if ( fs.existsSync( pluginPath ) ) {
            var plugin = this.getXmlFileContents( pluginPath );
            var prefs = [];
            if ( plugin.plugin.preference ) {
                prefs = prefs.concat( plugin.plugin.preference );
            }
            plugin.plugin.platform.forEach( function( platform ) {
                if ( platform.preference ) {
                    prefs = prefs.concat( platform.preference );
                }
            } );
            prefs.forEach( function( pref ) {
                variables[ pref._attributes.name ] = pref._attributes.default;
            } );
        }

        // Parse config.xml
        var configPath = "config.xml";

        if ( fs.existsSync( configPath ) ) {
            var config = this.getXmlFileContents( configPath );
            var configPlugins = config.widget.plugin ? [].concat( config.widget.plugin ) : [];
            configPlugins.forEach( function( plugin ) {
                var configVariables = plugin.variable ? [].concat( plugin.variable ) : [];
                configVariables.forEach( function( variable ) {
                    if( ( plugin._attributes.name === this.getPluginId() ||
                        plugin._attributes.id === this.getPluginId() ) &&
                        variable._attributes.name && variable._attributes.value ) {
                        variables[ variable._attributes.name ] = variable._attributes.value;
                    }
                } );
            } );
        }

        // Parse package.json
        var pkgPath = "package.json";

        if ( fs.existsSync( pkgPath ) ) {
            var pkg = this.getJsonFileContents( pkgPath );
            if ( pkg.cordova && pkg.cordova.plugins ) {
                var pkgVariables = pkg.cordova.plugins[ this.getPluginId() ];
                if ( pkgVariables ) {
                    for ( var variableName in pkgVariables ) {
                        variables[ variableName ] = pkgVariables[ variableName ];
                    }
                }
            }
        }

        return variables;
    },

    /**
     * Get Formatted App Name
     */
    getFormattedAppName: function( preferences ) {
        var appName = preferences[ PreferenceNames.OsApplicationShortName ] || this.getApplicationName();
        if ( Utilities.compareStrings( preferences[ PreferenceNames.OsAddEnvironmentSuffixToName ], "true" ) ) {
            var suffix = "";
            var appIdentifier = this.getApplicationId();
            if ( this.compareStrings( preferences[ PreferenceNames.OsAppIdentifierDevelopment ], appIdentifier ) ) {
                suffix = preferences[ PreferenceNames.OsEnvironmentSuffixDevelopment ] || "Dev";
            }
            else if ( this.compareStrings( preferences[ PreferenceNames.OsAppIdentifierTesting ], appIdentifier ) ) {
                suffix = preferences[ PreferenceNames.OsEnvironmentSuffixTesting ] || "Test";
            }
            else if ( this.compareStrings( preferences[ PreferenceNames.OsAppIdentifierPreProduction ], appIdentifier ) ) {
                suffix = preferences[ PreferenceNames.OsEnvironmentSuffixPreProduction ] || "PreProd";
            }
            if ( suffix ) {
                appName += " (" + suffix + ")";
            }
        }
        return appName;
    },

    /**
     * Apply String Figure Spaces
     */
    applyStringFigureSpaces: function( str ) {
        // Replace spacing characters with a special spacing for improving the name of the app in the homescreen
        // Source: https://stackoverflow.com/a/58393735/1608072
        return str.replace( /\s/g, "\u2007" );
    },

    /**
     * Trim string
     */
    trimString: function( str ) {
        return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );
    },

    /**
     * Compare strings (after trimming and case-insensitive)
     */ 
    compareStrings: function( strA, strB ) {
        strA = this.trimString( strA || "" ).toLowerCase();
        strB = this.trimString( strB || "" ).toLowerCase();
        return strA == strB;
    }
};
