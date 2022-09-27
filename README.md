# cordova-plugin-outsystems-configurator

Plugin that allows changing application settings by using a set of [custom preferences defined in the Extensibility Configurations of your module](https://success.outsystems.com/Documentation/11/Delivering_Mobile_Apps/Customize_Your_Mobile_App/Set_the_Preferences_for_Your_Mobile_App).

This plugin runs during the `before_compile` hook that is triggered by Cordova while building the app. This helps mitigate conflicts such as having permission request messages for iOS being overriden by other referenced plugins.

### Preference Names

Name | Platforms | Default | Description
---- | --------- | ------- | -----------
OsApplicationShortName | Android, iOS | - | Defines a short name for the application to be shown on the device's home screen. A maximum of 16 characters is recommended.
OsAppIdentifierDevelopment | Android, iOS | - | Sets the App Identifier for the Development environment (i.e.: "com.mydomain.dev.MyApp"). Setting this parameter might be required for other attributes to work correctly.
OsAppIdentifierTesting | Android, iOS | - | Sets the App Identifier for the Testing environment  (i.e.: "com.mydomain.qa.MyApp"). Setting this parameter might be required for other attributes to work correctly.
OsAppIdentifierPreProduction | Android, iOS | - | Sets the App Identifier for the Pre-Production environment  (i.e.: "com.mydomain.pp.MyApp"). Setting this parameter might be required for other attributes to work correctly.
OsAppIdentifierProduction | Android, iOS | - | Sets the App Identifier for the Production environment  (i.e.: "com.mydomain.MyApp"). Setting this parameter might be required for other attributes to work correctly.
OsAddEnvironmentSuffixToName | Android, iOS | false | Adds an indicator of the environment from which the build originated from to the application name as a suffix. For it to work properly, it is required that the OsAppIdentifier parameters are defined. This does not add a suffix to the Production build.
OsEnvironmentSuffixDevelopment | Android, iOS | Dev | Suffix to be added to the application name originated from the Development environment when the parameter OsAddEnvironmentSuffixToName is enabled.
OsEnvironmentSuffixTesting | Android, iOS | Test | Suffix to be added to the application name originated from the Testing environment when the parameter OsAddEnvironmentSuffixToName is enabled.
OsEnvironmentSuffixPreProduction | Android, iOS | PreProd | Suffix to be added to the application name originated from the Pre-Production environment when the parameter OsAddEnvironmentSuffixToName is enabled.
OsUseTitleFigureSpaces | iOS | false | If enabled, replaces regular application title whitespace characters with Figure Spaces. This can be used for longer application names that seem to have their spaces truncated on the device's home screen. Using this parameter is discouraged: if needed, try defining a shorter application name using the OsApplicationShortName parameter instead.
OsUserInterfaceStyle | iOS | Overrides the app UI preferences for Dark and Light modes. [Apple discourages disabling Dark Mode support](https://developer.apple.com/documentation/uikit/appearance_customization/supporting_dark_mode_in_your_interface/choosing_a_specific_interface_style_for_your_ios_app#3234550), and recommends opting out only temporarily while working on improving the app's Dark Mode support. Possible values are: "automatic", "light" and "dark".

#### Notes

This plugin no longer provides preferences for setting usage descriptions for iOS features, since this is currently supported natively by the platform. For full list of iOS preference names for usage descriptions, see [Cocoa Keys](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW1) and filter by UsageDescription.
