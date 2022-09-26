# cordova-plugin-outsystems-configurator

Plugin that allows changing application settings by using a set of [custom preferences defined in the Extensibility Configurations of your module](https://success.outsystems.com/Documentation/11/Delivering_Mobile_Apps/Customize_Your_Mobile_App/Set_the_Preferences_for_Your_Mobile_App).

This plugin runs during the `before_compile` hook that is triggered by Cordova while building the app. This helps mitigate conflicts such as having permission request messages for iOS being overriden by other referenced plugins.

### Preference Names

Name | Platforms | Description
---- | --------- | -----------
OsApplicationShortName | Android, iOS | Defines a short name for the application to be shown on the device's home screen. A maximum of 16 characters is recommended.
OsUserInterfaceStyle | iOS | Overrides the app UI preferences for Dark and Light modes. Possible values are: "automatic", "light" and "dark". [Apple discourages disabling Dark Mode support](https://developer.apple.com/documentation/uikit/appearance_customization/supporting_dark_mode_in_your_interface/choosing_a_specific_interface_style_for_your_ios_app#3234550), and recommends opting out only temporarily while working on improving the app's Dark Mode support.

#### Notes

This plugin no longer provides preferences for setting usage descriptions for iOS features, since this is currently supported natively by the platform. For full list of iOS preference names for usage descriptions, see [Cocoa Keys](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW1) and filter by UsageDescription.
