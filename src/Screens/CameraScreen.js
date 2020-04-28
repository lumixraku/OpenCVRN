import { WebView } from 'react-native-webview';

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';

import { RNCamera } from 'react-native-camera';
import Toast, { DURATION } from 'react-native-easy-toast';

import styles from '../Styles/Screens/CameraScreen';
import OpenCV from '../NativeModules/OpenCV';
import MLkit from '../NativeModules/MLKit';
import CircleWithinCircle from '../assets/svg/CircleWithinCircle';

import { postToWebview } from '../util/util';

import CardV from 'react-native-cardv'

setTimeout(() => {
  CardV.show("........AAAA..........")
}, 1000)


// var webviewURL = 'http://192.168.8.242:5001/';
var webviewURL = 'http://10.12.166.241:5001/';


// blob 请求无法识别
var webviewLocal = 'file:///android_asset/index.html'

// 报错
//var webviewSource = require("../../android/app/src/main/assets/index.html")

const landmarkSize = 5;

export default class CameraScreen extends Component {

  constructor(props) {
    super(props);
    // this.webview = this.props.webview;// failed!
    // this.webref = React.createRef();


    let _self = this;

    this.facesDetected = this.facesDetected.bind(this);
    this.renderFace = this.renderFace.bind(this);
    this.renderFaces = this.renderFaces.bind(this);
    this.renderLandmarks = this.renderLandmarks.bind(this);

    this.lastTime = +new Date;
    setTimeout(() => {
      // this.refs.toast.show('Action!', DURATION.LENGTH_SHORT);
      // console.log('MLkit  is null ???', MLkit); // 需要卸载然后安装 不然总是 null
      // MLkit.show('Awesome', MLkit.SHORT);
      // this.callDetectFace();
      this.setState({
        'webviewBG': 'transparent'
      })

    }, 2000);

    this.state.cameraType = 'front';
    this.state.mirrorMode = false;
  }

  state = {
    webviewBG: '#fff',
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
        leftMouthPosition: { x: 0, y: 0 },
        rightMouthPosition: { x: 0, y: 0 },
        bottomMouthPosition: { x: 0, y: 0 },
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
    });

  }



  onMessage(event) {
    console.log('RCT  recevice event', event.nativeEvent.data);
  }




  facesDetected(detectData) {
    this.setState({
      faces: detectData.faces
    })
  };


  renderFace(faceData) {
    let { bounds, faceID, rollAngle, yawAngle } = faceData;

    postToWebview(this.webref, faceData);
    // return (
    //   <View
    //     key={faceID}
    //     transform={[
    //       { perspective: 600 },
    //       { rotateZ: `${rollAngle.toFixed(0)}deg` },
    //       { rotateY: `${yawAngle.toFixed(0)}deg` },
    //     ]}
    //     style={[
    //       styles.face,
    //       {
    //         ...bounds.size,
    //         left: bounds.origin.x,
    //         top: bounds.origin.y,
    //       },
    //     ]}
    //   >
    //     <Text style={styles.faceText}>ID: {faceID}</Text>
    //     <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
    //     <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    //   </View>
    // )
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

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces ? this.state.faces.map(this.renderFace) : null}
      </View>
    )
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces ? this.state.faces.map(this.renderLandmarksOfFace) : null}
      </View>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
        </View>
        <View style={styles.box1}></View>
          <RNCamera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={
              'We need your permission to use your camera phone'
            }
            ratio="16:9"
            type={this.state.cameraType}
            mirrorImage={this.state.mirrorMode}
            trackingEnabled
            onFacesDetected={this.facesDetected}
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks.none
            }
            faceDetectionClassifications={
              RNCamera.Constants.FaceDetection.Classifications.none
            }
          >
            {this.renderFaces()}
            {/* { this.renderLandmarks() } */}
          </RNCamera>
        <View style={styles.webViewContainer}>
          <WebView
            // ref={this.webref}
            ref={(r) => (this.webref = r)}
            style={[ styles.webview , { backgroundColor: this.state.webviewBG } ]}

            onMessage={this.onMessage}
            source={{
              uri: webviewURL,
            }}
            originWhitelist={['*']}
            // source={{
            //   baseUrl: '',
            //   html: webviewSource
            // }}
          />
        </View>
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

AppRegistry.registerComponent('CameraScreen', () => CameraScreen);
