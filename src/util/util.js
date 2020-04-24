
import _ from "underscore";

import { StyleSheet, Dimensions } from 'react-native';

var stageWidth = Dimensions.get('window').width; //full width
var stageHeight = Dimensions.get('window').height; //full height

let lasttime = +new Date

const	postToWebview = (webview, data) => {
	  // Ok postMessage 可以放对象
		// var runJS = `
		// // 	window.postMessage({a: 1})
		// `;
		// 当 data = {a:1} 时
		// var runJS = `
		// 	window.postMessage(${data})
		// `;
		// 这么做实际上是 window.postMessage([object Object])

		var dataStr = ""

		console.log("time", (+new Date) - lasttime)
		lasttime = +new Date

		// console.log("post to webview", data)
		if ( typeof(data) != "string" ) {
			dataStr = JSON.stringify(data)
		}else{
			dataStr = data;
		}
		var runJS = `
			window.postMessage(${dataStr})
		`;
		console.log(stageHeight, stageWidth)
		webview.injectJavaScript(runJS);
  }

export {postToWebview};