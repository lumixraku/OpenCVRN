
# Open CV in React Native

Please read this https://brainhub.eu/blog/opencv-react-native-image-processing/

It's a demo that detect photo is blur or not.

PS : 不一定出现手抖才叫 blur, 没对上焦也算, 比入当镜头离手机太近的时候.


## Prepare
OpenCV  3.4.10
Android Pie (SDK 28)
React Native 0.62.1
use `npm install ` not yarn



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
