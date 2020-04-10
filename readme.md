
# Open CV in React Native

If you wants to config OpenCV with RN, Please read this https://brainhub.eu/blog/opencv-react-native-image-processing/

It's a demo that detect photo is blur or not.

PS : 不一定出现手抖才叫 blur, 没对上焦也算, 比入当镜头离手机太近的时候.

If you want to config ML kit with android, also read that.

One more thing, ML kit requires Google Firebase. Please follow the steps here https://firebase.google.com/docs/android/setup

react-native-camera itself supports ML kit.



## Prepare
OpenCV  3.4.10
Android Pie (SDK 28)
React Native 0.62.1
use `npm install ` not yarn


## Log
npm start show log in js
OR
npx react-native log-android

android log
adb logcat

## Others
adb shell ls -Ral /storage/emulated/0/Pictures/Screenshots


## ML kit
后面不再使用 openCV 了, 改为 ML kit.


Demo face data
```
{"bottomMouthPosition": {"x": 270.27269345238096, "y": 480.5116423107329}, "bounds": {"origin": {"x": 76.46005394345241, "y": 74.11966451009116}, "size": {"height": 601.4217692057292, "width": 412.9934430803571}}, "faceID": 0, "leftCheekPosition": {"x": 329.1755719866071, "y": 349.8769292922247}, "leftEarPosition": {"x": 344.4310128348214, "y": 189.23731391543436}, "leftEarTipPosition": {"x": 361.72421409970235, "y": 273.5698423839751}, "leftEyeOpenProbability": 0.5554949641227722, "leftEyePosition": {"x": 272.0940755208333, "y": 265.4891751970564}, "leftMouthPosition": {"x": 311.18770926339283, "y": 425.8223577590216}, "noseBasePosition": {"x": 240.8182663690476, "y": 378.8622230166481}, "rightCheekPosition": {"x": 173.11481584821428, "y": 466.3295253208706}, "rightEarPosition": {"x": 66.69898623511905, "y": 392.3728966122582}, "rightEarTipPosition": {"x": 105.62802269345238, "y": 457.1561119442895}, "rightEyeOpenProbability": 0.434387743473053, "rightEyePosition": {"x": 153.3656994047619, "y": 353.0205575125558}, "rightMouthPosition": {"x": 221.801025390625, "y": 491.40720810663134}, "rollAngle": -26.673864364624023, "smilingProbability": 0.19892069697380066, "yawAngle": 1.3344969749450684}
```



## Trouble shooting

### Cannot choose between the following variants of project :react-native-camera

https://github.com/react-native-community/react-native-camera/issues/2138




### React Native Apps keeps stopping

Unable to load script.Make sure you are either running a Metro server or that your bundle 'index.android.bundle' is packaged correctly for release

https://stackoverflow.com/questions/55441230/unable-to-load-script-make-sure-you-are-either-running-a-metro-server-or-that-yo
https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows

`mkdir android/app/src/main/assets`

`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`

What mentioned above is not a good choice, you would lost reload if you do that.

### can not set resolution of RNCamera
https://github.com/react-native-community/react-native-camera/issues/1271