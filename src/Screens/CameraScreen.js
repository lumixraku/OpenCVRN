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

import {RNCamera} from 'react-native-camera';
import Toast, {DURATION} from 'react-native-easy-toast';
import {WebView} from 'react-native-webview';

import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import MLkit from '../NativeModules/MLKit';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';

import {postToWebview} from '../util/util';

// var webviewURL = 'http://192.168.8.242:5001/';
var webviewURL = 'http://10.12.167.120:5001/';

const landmarkSize = 5;

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    // this.webview = this.props.webview;// failed!

    this.takePicture = this.takePicture.bind(this);
    this.takeVideo = this.takeVideo.bind(this);
    this.checkForBlurryImage = this.checkForBlurryImage.bind(this);
    this.changeCameraType = this.changeCameraType.bind(this);
    this.proceedWithCheckingBlurryImage = this.proceedWithCheckingBlurryImage.bind(
      this,
    );
    this.proceedWithCheckingFacePhoto = this.proceedWithCheckingFacePhoto.bind(
      this,
    );

    this.repeatPhoto = this.repeatPhoto.bind(this);
    this.usePhoto = this.usePhoto.bind(this);
    this.facesDetected = this.facesDetected.bind(this);
    this.renderFace = this.renderFace.bind(this);
    this.renderFaces = this.renderFaces.bind(this);
    this.renderLandmarks = this.renderLandmarks.bind(this);

    this.lastTime = +new Date;
    setTimeout(() => {
      // this.refs.toast.show('Action!', DURATION.LENGTH_SHORT);
      // console.log('MLkit  is null ???', MLkit); // 需要卸载然后安装 不然总是 null
      MLkit.show('Awesome', MLkit.SHORT);
      // this.callDetectFace();
    }, 1000);

    this.state.cameraType = 'front';
    this.state.mirrorMode = false;
  }

  state = {
    cameraPermission: false,
    photoAsBase64: {
      content: '',
      isPhotoPreview: false,
      photoPath: '',
    },
    cameraType: 'front',
    mirrorMode: false,
    recordOptions: {
      mute: false,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
    preLandMarks: {
      mouth: {
        leftMouthPosition: {x: 0, y: 0},
        rightMouthPosition: { x: 0, y: 0 },
        bottomMouthPosition: {x: 0, y:0},
      }
    }
  };

  callDetectFace(imageAsBase64) {
    var _this = this;
    if (!imageAsBase64) {
      console.log('LogDemo', 'NOt base64');
    }
    return new Promise((resolve, reject) => {
      MLkit.detectFacesByBase64(
        imageAsBase64,
        (error) => {
          // error handling
        },
        (msg) => {
          console.log('LogDemo callback', msg);
          resolve(msg);
        },
      );
    }).then((data) => {
      console.log('LogDemo react JS get data', data);
      console.log('this webref2', _this.webref);
      // postToWebview(_this.webref, data);
    });

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

  proceedWithCheckingFacePhoto() {
    const {content, photoPath} = this.state.photoAsBase64;
    console.log('this webref1', this.webref);
    this.callDetectFace(content).then((rs) => {
      this.setState({
        photoAsBase64: {
          ...this.state.photoAsBase64,
          isPhotoPreview: true,
          photoPath,
        },
      });
    });
  }

  async takePicture() {
    console.log('LogDemo  takePicture');

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
      // this.proceedWithCheckingBlurryImage();
      this.proceedWithCheckingFacePhoto();
    }
  }

  async takeVideo() {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({isRecording: true});
          const data = await promise;
          this.setState({isRecording: false});
          console.warn('takeVideo', data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

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
    console.log('RCT  recevice event', event.nativeEvent.data);
  }

  changeCameraType() {
    if (this.state.cameraType === 'back') {
      this.setState({
        cameraType: 'front',
        mirrorMode: true,
      });
    } else {
      this.setState({
        cameraType: 'back',
        mirrorMode: false,
      });
    }
  }

  facesDetected( detectData ){
    // console.log("face data", detectData)
    this.setState({
      faces: detectData.faces
    })
  };


  renderFace(faceData){
    let { bounds, faceID, rollAngle, yawAngle } = faceData;
    var now = +new Date;
    console.log("date:::", now - this.lastTime)
    this.lastTime = now
    postToWebview(this.webref,  faceData);
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    )
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces(){
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces ? this.state.faces.map(this.renderFace) : null}
      </View>
    )
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces ? this.state.faces.map(this.renderLandmarksOfFace): null }
      </View>
    )
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
        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }
          ratio="4:3"
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}
          trackingEnabled
          onFacesDetected={this.facesDetected}
          faceDetectionLandmarks={
           RNCamera.Constants.FaceDetection.Landmarks.all
          }
          faceDetectionClassifications={
            RNCamera.Constants.FaceDetection.Classifications.all
          }
          >
          <View style={styles.takePictureContainer}>
            <TouchableOpacity onPress={this.takePicture}>
              <View>
                <CircleWithinCircle />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              paddingVertical: 20,
              bottom: 0,
              left: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0,
              backgroundColor: 'yellow',
            }}>
            <TouchableOpacity onPress={this.changeCameraType}>
              <View>
                <Svg height="68" width="68">
                  <Circle cx="34" cy="34" fill="#FFF" r="28" />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              paddingVertical: 20,
              bottom: 0,
              right: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0,
              backgroundColor: 'yellow',
            }}
          >
            <TouchableOpacity
              style={[
                styles.flipButton,
                {
                  flex: 0.3,
                  alignSelf: 'flex-end',
                  backgroundColor: this.state.isRecording ? 'white' : 'darkred',
                },
              ]}
              onPress={this.state.isRecording ? () => { } : this.takeVideo}
            >
              {this.state.isRecording ? (
                <Text style={styles.flipText}> ☕ </Text>
              ) : (
                  <Text style={styles.flipText}> REC </Text>
                )}
            </TouchableOpacity>
          </View>
          { this.renderFaces() }
          { this.renderLandmarks()}
        </RNCamera>
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
