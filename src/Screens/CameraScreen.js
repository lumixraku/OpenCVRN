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
import { offsetXPreview, offsetYPreview, previewWidth, previewHeight } from '../Styles/Screens/CameraScreen';
import styles from '../Styles/Screens/CameraScreen';

import { postToWebview } from '../util/util';
import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW } from '../constant';



// var webviewURL = 'http://10.12.167.7:5001/';
var webviewURL = 'http://47.92.222.162:3001/';
// var webviewLocal = 'file:///android_asset/index.html' // blob 请求无法识别
// var webviewSource = require("../../android/app/src/main/assets/index.html") // 报错


export default class CameraScreen extends Component {

  constructor(props) {
    super(props);
    // this.webview = this.props.webview;// failed!
    // this.webref = React.createRef();


    let _self = this;

    this.facesDetected = this.facesDetected.bind(this);
    this.renderFaces = this.renderFaces.bind(this);
    this.renderFace = this.renderFace.bind(this);
    this.renderAllContours = this.renderAllContours.bind(this);
    this.renderLandmarks = this.renderLandmarks.bind(this);
    this.onWebviewLoadEnd = this.onWebviewLoadEnd.bind(this);
    this.onMessageFromWeb = this.onMessageFromWeb.bind(this);

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




  onMessageFromWeb(event) {
    console.log('RCT  recevice event', event.nativeEvent.data);
    // event 只能是 string
    if (event.nativeEvent.data) {
      let evtData =  JSON.parse(event.nativeEvent.data)
      switch (evtData.messageType) {
        case MSG_TYPE_WEBVIEW:
          this.passPreviewPosToWebview()
          break;

        default:
          break;
      }

    }

  }


  // 即使webview内页面发生了刷新  该函数也会被调用
  onWebviewLoadEnd(event) {
    console.log("on webview loaded", +new Date)
    // 1588241946854 - 1588241947039 = -185 < 0
    // RN 中loadEnd的时间要早于 webview 中页面绑定message 事件的时间


    setTimeout( ()=> {
      this.passPreviewPosToWebview()
    }, 0)
  }

  passPreviewPosToWebview() {
    postToWebview(this.webref, {
      previewArea: {
        y: offsetYPreview,
        x: offsetXPreview,
        width: previewWidth,
        height: previewHeight
      },
      messageType: MSG_TYPE_CAM,
    })
  }


  facesDetected(detectData) {
    this.setState({
      faces: detectData.faces,
    })
  };


  renderFace(faceData) {
    postToWebview(this.webref, {
      faceData: this.addOffsetForFaceData(faceData),
      messageType: MSG_TYPE_FACE,
    });
  }


 addOffsetForFaceData(target) {
  const checkedType = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
  //判断拷贝的数据类型
  //初始化变量result 成为最终克隆的数据
  let result
  let targetType = checkedType(target)
  if (targetType === 'Object') {
    result = {}
  } else if (targetType === 'Array') {
    result = []
  } else {
    return target
  }



  //遍历目标数据  target is {...}
  for (let [key, value] of Object.entries(target)) {
    //获取遍历数据结构的每一项值。
    // let value = target[key]
    //判断目标结构里的每一值是否存在对象/数组
    if (checkedType(value) === 'Object' ||
      checkedType(value) === 'Array') { //对象/数组里嵌套了对象/数组
      //继续遍历获取到value值
      result[key] = this.addOffsetForFaceData(value)
    } else { //获取到value值是基本的数据类型或者是函数。

      if (key == "x") {
        result[key] = offsetXPreview + (value)

      } else if (key == "y") {
        result[key] = offsetYPreview + (value)

      } else {
        result[key] = value;

      }
    }
  }
  return result
}

  renderContourOfFace(faceData) {

    const renderContour = points => {
      points.push( {x: 0, y: 0})

      let elems = []
      for (let [idx, p] of points.entries()) {
        let left =  p.x
        let top =  p.y
        elems.push(
          <View
            key={ `${faceData.faceID}${idx}`}
            style={[styles.landmark, {
              left: left,
              top: top,
              backgroundColor: 'lime'
          }]}>
          </View>
        )

        //PS 这里的absolute 都是相对于父元素而言的 也就是contourPoints
        //并不是相对 contoursContainer 也不是preview
      }
      return elems
    }

    return (
      <View
        key={faceData.faceID}
        style={{
          borderWidth: 1,
          borderRadius: 1,
          borderColor: 'green',
          width: previewWidth,
          height: previewHeight,
        }}
        className="contourPoints"
      >
        {renderContour(faceData.upperLipTop)}
        {renderContour(faceData.upperLipBottom)}
        {renderContour(faceData.lowerLipTop)}
        {renderContour(faceData.lowerLipBottom)}
        {renderContour(faceData.face)}
      </View>
    )
  }

  renderLandmarksOfFace(face) {
    const landmarkSize = 5;
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
    if (face.leftCheekPosition) {
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
      )
    }
    return null;

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

  renderAllContours() {
    return (
      <View className="contoursContainer" style={styles.facesContainer} pointerEvents="none">
        {this.state.faces ? this.state.faces.map(this.renderContourOfFace) : null}
      </View>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        {/* <View style={styles.box1}></View> */}
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
          {this.renderAllContours()}
        </RNCamera>
        <View style={styles.webViewContainer}>
          <WebView
            // ref={this.webref}
            ref={(r) => (this.webref = r)}
            style={[styles.webview, { backgroundColor: this.state.webviewBG }]}
            onMessage={this.onMessageFromWeb}
            source={{
              uri: webviewURL,
            }}
            onLoadEnd={this.onWebviewLoadEnd}
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
