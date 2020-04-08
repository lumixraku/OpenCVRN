import React, {Component} from 'react';
import {
  AppRegistry,
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Svg, Circle} from 'react-native-svg';

import {RNCamera as Camera} from 'react-native-camera';
import Toast, {DURATION} from 'react-native-easy-toast';
import {WebView} from 'react-native-webview';

import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import MLkit from '../NativeModules/MLKit';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';

import {postToWebview} from '../util/util';


var webviewURL = 'http://10.12.167.120:5001/';


export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    // this.webview = this.props.webview;// failed!

    this.takePicture = this.takePicture.bind(this);
    this.checkForBlurryImage = this.checkForBlurryImage.bind(this);
    this.changeCameraType = this.changeCameraType.bind(this);
    this.proceedWithCheckingBlurryImage = this.proceedWithCheckingBlurryImage.bind(
      this,
    );
    this.repeatPhoto = this.repeatPhoto.bind(this);
    this.usePhoto = this.usePhoto.bind(this);

    setTimeout(() => {
      // this.refs.toast.show('Action!', DURATION.LENGTH_SHORT);
      // console.log('MLkit  is null ???', MLkit); // 需要卸载然后安装 不然总是 null
      MLkit.show('Awesome', MLkit.SHORT);
      this.callDetectFace();
    }, 1000);

    this.state.cameraType = 'back'
    this.state.mirrorMode = false;
  }

  state = {
    cameraPermission: false,
    photoAsBase64: {
      content: '',
      isPhotoPreview: false,
      photoPath: '',
    },
    cameraType: 'back',
    mirrorMode: false
  };

  callDetectFace() {
    new Promise((resolve, reject) => {
      MLkit.detectFaces(
        '././path_to_file',
        (error) => {
          // error handling
        },
        (msg) => {
          console.log('LogDemo callback', msg);
          resolve(msg);
        },
      );
    }).then((data) => {
      //console.log("LogDemo react JS get data", data);
      postToWebview(this.webref, data);
    });

    console.log('LogDemo  after MLkit.detectFaces', MLkit.detectFaces);
  }

  checkForBlurryImage(imageAsBase64) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.checkForBlurryImage(
          imageAsBase64,
          (error) => {
            // error handling
          },
          (msg) => {
            resolve(msg);
          },
        );
      } else {
        OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
          resolve(dataArray[0]);
        });
      }
    });
  }

  proceedWithCheckingBlurryImage() {
    const {content, photoPath} = this.state.photoAsBase64;

    this.checkForBlurryImage(content)
      .then((blurryPhoto) => {
        if (blurryPhoto) {
          console.log('blur photo');

          this.refs.toast.show('Photo is blurred!!!', DURATION.FOREVER);
          return this.repeatPhoto();
        } else {
          console.log('clear photo');

          setTimeout(() => {
            this.refs.toast.show('Photo is CLEAR!!', DURATION.FOREVER);
          }, 0);

          this.setState({
            photoAsBase64: {
              ...this.state.photoAsBase64,
              isPhotoPreview: true,
              photoPath,
            },
          });
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async takePicture() {
    console.log('LogDemo  takePicture');
    this.callDetectFace()

    console.log('LogDemo  after MLkit.detectFaces', MLkit.detectFaces);

    return
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        ...this.state,
        photoAsBase64: {
          content: data.base64,
          isPhotoPreview: false,
          photoPath: data.uri,
        },
      });
      this.proceedWithCheckingBlurryImage();
    }
  }

  repeatPhoto() {
    this.setState({
      ...this.state,
      photoAsBase64: {
        content: '',
        isPhotoPreview: false,
        photoPath: '',
      },
    });
  }

  usePhoto() {
    // do something, e.g. navigate
  }

	onMessage(event) {
		console.log("RCT  recevice event", event.nativeEvent.data);
	}

  changeCameraType() {
    if (this.state.cameraType === 'back') {
      this.setState({
        cameraType: 'front',
        mirrorMode: true
      });
    } else {
      this.setState({
        cameraType: 'back',
        mirrorMode: false
      });
    }
  }

  render() {
    if (this.state.photoAsBase64.isPhotoPreview) {
      return (
        <View style={styles.container}>
          <Toast ref="toast" position="center" />
          <Image
            source={{
              uri: `data:image/png;base64,${this.state.photoAsBase64.content}`,
            }}
            style={styles.imagePreview}
          />
          <View style={styles.repeatPhotoContainer}>
            <TouchableOpacity onPress={this.repeatPhoto}>
              <Text style={styles.photoPreviewRepeatPhotoText}>
                Repeat photo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.usePhotoContainer}>
            <TouchableOpacity onPress={this.usePhoto}>
              <Text style={styles.photoPreviewUsePhotoText}>Use photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}>
          <View style={styles.takePictureContainer}>
            <TouchableOpacity onPress={this.takePicture}>
              <View>
                <CircleWithinCircle />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.changeCameraType}>
              <View>
                <Svg height="68" width="68">
                  <Circle cx="34" cy="34" fill="#FFF" r="28" />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
        <View style={styles.absView}>
          <WebView
            ref={(r) => (this.webref = r)}
            style={styles.webview}
            onMessage={this.onMessage}
            source={{
              uri: webviewURL,
            }}
          />
        </View>
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

AppRegistry.registerComponent('CameraScreen', () => CameraScreen);
