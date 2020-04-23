# AR Demo with contours

Now only available on Android.



## Start

`yarn start` or `npm start` or `yarn start --reset-cache`

then open another terminal, `npm run android`


## Prepare
- ~~OpenCV  3.4.10~~
- Android Pie (SDK 28)
- React Native 0.62.1
- ML Kit & Firebase

Later I changed to use MK kit instead of OpenCV for face detection.

## Implemention

### RN + ML Kit

PS:   Flutter is also an available option. check this [flutter-face-contour-plugin](https://github.com/giandifra/flutter-face-contour-plugin)

The React Native part will launch a camera, sent face detect option to Native ML kit.  And puts a transparent WebView over the camera.


On the Native part, it will create a  FirebaseVisionFaceDetector by the options from RN.  Get image data from every frame and detect faces in it.

Then calculate the scale between real image and screen. Finally, put results in a callback function of React Camera.  Then RN will post this data to WebView.



The Webview will get data from message event. Then render everything you want.

###  Custom your Native Camera

This "React Native Camera" package does not support contours.  Face contours can highly improve the accurate position of facial feature, especially for mouth.

This package has two sourcesets,  general and mlkit.



general imports FaceDetector from com.google.android.gms.vision.face,  but this package does not support ALL_CONTOURS.

mlkit use FaceDetector from com.google.firebase.ml.vision.face.FirebaseVisionFaceDetector which supports contours.



Main Detecting face flow:

![image](https://raw.githubusercontent.com/lumixraku/react-native-camera/master/cameraFlow.png)



### Open CV in React Native

I'm using OpenCV at first, Later I changed to ML kit.

If you wants to config OpenCV with RN, Please read this https://brainhub.eu/blog/opencv-react-native-image-processing/

It's a demo that detect photo is blur or not.

PS : 不一定出现手抖才叫 blur, 没对上焦也算, 比入当镜头离手机太近的时候.

### ML kit & Firebase

If you want to config ML kit with android, also read that.

One more thing, ML kit requires Google Firebase. Please follow the steps here https://firebase.google.com/docs/android/setup

react-native-camera itself supports ML kit.



## Others

### show log

`npm start` show log in js

android log

`npx react-native log-android` OR `adb logcat`

### ls on android device
adb shell ls -Ral /storage/emulated/0/Pictures/Screenshots





## Demo face data
```
{"bottomMouthPosition": {"x": 270.27269345238096, "y": 480.5116423107329}, "bounds": {"origin": {"x": 76.46005394345241, "y": 74.11966451009116}, "size": {"height": 601.4217692057292, "width": 412.9934430803571}}, "faceID": 0, "leftCheekPosition": {"x": 329.1755719866071, "y": 349.8769292922247}, "leftEarPosition": {"x": 344.4310128348214, "y": 189.23731391543436}, "leftEarTipPosition": {"x": 361.72421409970235, "y": 273.5698423839751}, "leftEyeOpenProbability": 0.5554949641227722, "leftEyePosition": {"x": 272.0940755208333, "y": 265.4891751970564}, "leftMouthPosition": {"x": 311.18770926339283, "y": 425.8223577590216}, "noseBasePosition": {"x": 240.8182663690476, "y": 378.8622230166481}, "rightCheekPosition": {"x": 173.11481584821428, "y": 466.3295253208706}, "rightEarPosition": {"x": 66.69898623511905, "y": 392.3728966122582}, "rightEarTipPosition": {"x": 105.62802269345238, "y": 457.1561119442895}, "rightEyeOpenProbability": 0.434387743473053, "rightEyePosition": {"x": 153.3656994047619, "y": 353.0205575125558}, "rightMouthPosition": {"x": 221.801025390625, "y": 491.40720810663134}, "rollAngle": -26.673864364624023, "smilingProbability": 0.19892069697380066, "yawAngle": 1.3344969749450684}
```


## Read More
### create your own rn package
https://reactnative.dev/docs/native-modules-setup

https://medium.com/wix-engineering/creating-a-native-module-in-react-native-93bab0123e46

https://juejin.im/entry/5b908229f265da0a92238a93 (教程稍微有些旧了 至少上面的英文教程没有提到手动创建 RNxxxManager)

掘金教程中出现的 react-native-create-library 已经被  create-react-native-module 取代 (but I failed using create-react-native-module )

create-react-native-module MyLibrary 将会创建 react-native-my-library 这样一个目录

另外中文教程中的 `4.2 调试本地代码` 中提到的 `yarn link` 方法不再适用于 metro 管理的包


## Trouble shooting

### Cannot choose between the following variants of project :react-native-camera

https://github.com/react-native-community/react-native-camera/issues/2138

```
missingDimensionStrategy 'react-native-camera', 'general' <-- insert this line
```

### React Native Apps keeps stopping

Unable to load script.Make sure you are either running a Metro server or that your bundle 'index.android.bundle' is packaged correctly for release

https://stackoverflow.com/questions/55441230/unable-to-load-script-make-sure-you-are-either-running-a-metro-server-or-that-yo
https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows

`mkdir android/app/src/main/assets`

`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`

What mentioned above is not a good choice, you would lost reload if you do that.

### can not set resolution of RNCamera
https://github.com/react-native-community/react-native-camera/issues/1271



### React-Native Module HMRClinet is not a registered callable module(calling enable)
https://thetopsites.net/article/50618528.shtml
https://stackoverflow.com/questions/54935132/module-hmrclient-is-not-registered-react-native-why-is-this-happening-and-how-t
https://stackoverflow.com/questions/53220633/module-hmrclient-is-not-a-registered-callable-module-calling-enable-in-linux


### React Native:Module RCTDeviceEventEmitter is not a registered callable module (calling emit)

https://github.com/facebook/react-native/issues/27193

https://github.com/joltup/react-native-threads/issues/40

### pod install error
https://github.com/react-native-community/react-native-maps/issues/2290

### link local module
https://stackoverflow.com/questions/44061155/react-native-npm-link-local-dependency-unable-to-resolve-module

### error Unknown dependency.

Make sure that the package you are trying to link is already installed in your "node_modules" and present in your "package.json" dependencies

package.json 中一定要有这个包的引用, 不然即使把这个包放在node_modules 中也会报错.

### gradle
新建的 RN Package 本身要gradle sync  引用这个包的项目也要 gradle sync



### link local module
https://stackoverflow.com/questions/44061155/react-native-npm-link-local-dependency-unable-to-resolve-module
No newline at end of file

### webview getRandomValue not supported
https://github.com/react-native-community/react-native-webview/issues/1312