import {StyleSheet, Dimensions} from 'react-native';


// RN 中的高宽就是在webview 中默认得到的高宽(在不处理 dpr 的情况下的值)
var stageWidth = Dimensions.get('window').width; //full width
var stageHeight = Dimensions.get('window').height; //full height
console.log("LogDemo stage Size", stageWidth, stageHeight)

var screenRatio =  stageHeight / stageWidth;

// PS: 不能把屏幕比例直接套用在取景器大小上
// 例如当前测试机屏幕是 2160 * 1080, 但是摄像头的取景器仅支持 1920 * 1080, 一个是18:9 一个是16:9

console.log("LogDemo", "WH", stageWidth, stageHeight)

var bottomHeight = 20;
var absViewHeight = stageHeight - bottomHeight;

var landmarkSize = 2;


// camera preview offset
var offsetXPreview = 180
var offsetYPreview = 250
var previewWidth = 198
var previewHeight = previewWidth * 16 / 9

// var offsetXPreview = 0
// var offsetYPreview = 0
// var previewWidth = stageWidth
// var previewHeight = stageWidth /9 * 16

export { offsetXPreview, offsetYPreview, previewWidth, previewHeight}

export default StyleSheet.create({
  imagePreview: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 60,
  },
  container: {
    flex: 1,
    // flexDirection: 'row',
    position:'relative',
  },
  repeatPhotoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 120,
    backgroundColor: '#000',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
  },
  focusFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  focusFrame: {
    height: 90,
    width: 90,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'dotted',
    borderRadius: 5,
  },
  photoPreviewRepeatPhotoText: {
    color: '#abcfff',
    fontSize: 15,
    marginLeft: 10,
  },
  usePhotoContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: 120,
    backgroundColor: '#000',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  photoPreviewUsePhotoText: {
    color: '#abcfff',
    fontSize: 15,
    marginRight: 10,
  },


  box1: {
    position: 'absolute',
    top: 170,
    left: 170,
    width: 100,
    height: 100,
    backgroundColor: 'red'
  },
  preview: {
    position: 'absolute',
    top: offsetYPreview,
    left: offsetXPreview,
    width: previewWidth,
    height: previewHeight,
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  takePictureContainer: {
    position: 'absolute',
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    backgroundColor: 'red',
  },
  webViewContainer: {
    width: stageWidth,
    height: absViewHeight,
    // backgroundColor: 'red',
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  webview: {
    flex:1,
    height: absViewHeight,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#FFD700',
  },
  face: {
    position: 'absolute',
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
});
