# Migration Guides

This document includes migration guides for each notable upgrade in the Amazon IVS React Native Player SDK.

## 1.3.0 to 1.4.1

This release contains added features along with bug fixes for both Android and iOS.

## 1.2.0 to 1.3.0

No major updates for this version. Primarily React Native version updates and iOS IVS Player version updates.

## 1.1.0 to 1.2.0

In 1.2.0, the default behavior of the SDK when playing content in the background was changed. It is now up to the application to determine whether content should be paused or play through. Details of how to configure this within a React Native application can be found in the [Usage Guide for configuring background playback](https://github.com/aws/amazon-ivs-react-native-player/blob/main/docs/usage-guide.md#3-playpause-video-in-a-background).

## Early Adopter to 1.0.0

If you previously integrated this SDK, there are a couple of changes that have been made to the distribution and integration requirements.

### Package Rename

As part of the `1.0.0` release, the NPM package was renamed from [`amazon-ivs-react-native`](https://www.npmjs.com/package/amazon-ivs-react-native) to [`amazon-ivs-react-native-player`](https://www.npmjs.com/package/amazon-ivs-react-native-player).

Deprecation notices were added to the previous package, which should show up when an installation is attempted.

### Code Changes

Overall there are not many code changes required.

> Note that this diff is based off of a standard Create React Native App build, the location of your source files may vary.

```diff
--- a/App.js
+++ b/App.js
-import IVSPlayer from 'amazon-ivs-react-native';
+import IVSPlayer from 'amazon-ivs-react-native-player';


--- a/android/app/src/main/java/com/app/MainApplication.java
+++ b/android/app/src/main/java/com/app/MainApplication.java
 import com.facebook.react.ReactPackage;
 import com.facebook.soloader.SoLoader;
 import java.lang.reflect.InvocationTargetException;
 import java.util.List;
-import com.amazonivsreactnative.AmazonIvsPackage;
+import com.amazonaws.ivs.reactnative.player.AmazonIvsPackage;


--- a/ios/Podfile
+++ b/ios/Podfile
 require_relative '../node_modules/react-native/scripts/react_native_pods'
 require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

-platform :ios, '10.0'
+platform :ios, '11.0'


--- a/package.json
+++ b/package.json
   "dependencies": {
-    "amazon-ivs-react-native": "^1.0.2-beta",
+    "amazon-ivs-react-native-player": "^1.0.0",
     "react": "17.0.1",
     "react-native": "0.67.2"
   },
```

### Installation

Once the above code changes are in place, run the following:

```sh
yarn remove amazon-ivs-react-native
yarn add amazon-ivs-react-native-player
yarn
cd ios
pod install
```

Afterwards, ensure that you clean any build folders before attempting to run the app.
