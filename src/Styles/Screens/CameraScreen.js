import {StyleSheet, Dimensions} from 'react-native';

var stageWidth = Dimensions.get('window').width; //full width
var stageHeight = Dimensions.get('window').height; //full height
var bottomHeight = 200;
var absViewHeight = stageHeight - bottomHeight;


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
    flexDirection: 'row',
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
  preview: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  absView: {
    width: stageWidth,
    height: absViewHeight,
    // backgroundColor: "yellow",
    position: 'absolute',
    top: 0,
  },
  webview: {
    height: 350,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
});
