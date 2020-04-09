
# Open CV in React Native

Please read this https://brainhub.eu/blog/opencv-react-native-image-processing/

It's a demo that detect photo is blur or not.

PS : 不一定出现手抖才叫 blur, 没对上焦也算, 比入当镜头离手机太近的时候.


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
{"bottomMouthPosition": {"x": 208.13790457589283, "y": 468.79666500999815}, "bounds": {"origin": {"x": 119.19382440476187, "y": 190.57920183454243}, "size": {"height": 385.4539483933222, "width": 264.6894066220238}}, "faceID": 0, "leftCheekPosition": {"x": 266.8521670386905, "y": 410.85753348214286}, "leftEarPosition": {"x": 303.18650018601187, "y": 322.4182466052828}, "leftEarTipPosition": {"x": 298.98031761532735, "y": 372.8970765613374}, "leftEyePosition": {"x": 247.11902436755952, "y": 334.06106828962055}, "leftMouthPosition": {"x": 248.3365769159226, "y": 458.0550605410622}, "noseBasePosition": {"x": 210.47440011160714, "y": 384.48196382068454}, "rightCheekPosition": {"x": 147.54206194196428, "y": 418.72340988885793}, "rightEarPosition": {"x": 88.73911830357143, "y": 361.4497962588356}, "rightEarTipPosition": {"x": 100.95754278273809, "y": 418.58929050990514}, "rightEyePosition": {"x": 162.62662760416666, "y": 339.20050528390067}, "rightMouthPosition": {"x": 166.49730282738093, "y": 463.29231901622956}, "rollAngle": -3.3242709636688232, "yawAngle": -2.6576273441314697}
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