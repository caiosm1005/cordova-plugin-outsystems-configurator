# cordova-plugin-outsystems-configurator

Plugin that allows changing application settings by using a set of [custom preferences defined in the Extensibility Configurations of your module](https://success.outsystems.com/Documentation/11/Delivering_Mobile_Apps/Customize_Your_Mobile_App/Set_the_Preferences_for_Your_Mobile_App).

This plugin runs during the `before_compile` hook that is triggered by Cordova while building the app. This helps mitigate conflicts such as having permission request messages for iOS being overriden by other referenced plugins.

### Preference Names

Name | Platforms | Description
---- | --------- | -----------
OsApplicationShortName | Android, iOS | Defines a short name for the application to be shown on the device's home screen.
OsPhotoLibraryUsageDescription | iOS | A message that tells the user why the app is requesting access to the user's photo library.
OsPhotoLibraryAddUsageDescription | iOS | A message that tells the user why the app is requesting add-only access to the user’s photo library.
OsCameraUsageDescription | iOS | A message that tells the user why the app is requesting access to the device's camera.
OsLocationUsageDescription | iOS | A message that tells the user why the app is requesting access to the user's location.
OsLocationAlwaysUsageDescription | iOS | A message that tells the user why the app is requesting access to the user's location at all times.
OsContactsUsageDescription | iOS | A message that tells the user why the app is requesting access to the user's contacts.
OsCalendarUsageDescription | iOS | A message that tells the user why the app is requesting access to the user's calendar data.
OsNfcUsageDescription | iOS | A message that tells the user why the app is requesting access to the device's NFC hardware.
OsBluetoothUsageDescription | iOS | A message that tells the user why the app is requesting the ability to connect to Bluetooth peripherals.
OsMicrophoneUsageDescription | iOS | A message that tells the user why the app is requesting access to the device’s microphone.
