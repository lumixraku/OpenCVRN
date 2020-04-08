import React, {Component} from 'react';
import {
  ScrollView,
  PixelRatio,
  TouchableHighlight,
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

import CameraScreen from './src/Screens/CameraScreen';
import {WebView} from 'react-native-webview';

var stageWidth = Dimensions.get('window').width; //full width
var stageHeight = Dimensions.get('window').height; //full height
var bottomHeight = 100;
var absViewHeight = stageHeight - bottomHeight;

export default class App extends Component<Props> {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: 'Initializing AR..',
    };
    this.getWebView();
  }

  getWebView() {
    this.webview =  (
      <WebView
        ref={(r) => (this.webref = r)}
        style={localStyles.webview}
        source={{
          // uri: 'https://facehehe.com/',
          uri: 'http://10.12.167.120:5001/',
        }}
      />
    );
  }

  render() {
    console.log("webref", this.webref)
    console.log('webview', this.webview);
    return (
      <View style={localStyles.outer}>
        <CameraScreen />
        <View style={localStyles.absView}>{this.webview}</View>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  absView: {
    width: stageWidth,
    height: absViewHeight,
    // backgroundColor: "yellow",
    position: 'absolute',
    top: 0,
  },
  viroContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  outer: {
    flex: 1,
    // backgroundColor: '#aaa',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inner: {
    marginHorizontal: 20,
    backgroundColor: 'black',
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
  buttons: {
    height: 80,
    width: 150,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  webview: {
    height: 350,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
});
