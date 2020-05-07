
import _ from "underscore";

import { StyleSheet, Dimensions } from 'react-native';

import { offsetXPreviewDefault, offsetYPreviewDefault, previewWidthDefault, previewHeightDefault } from '../Styles/Screens/CameraStyle';

var stageWidth = Dimensions.get('window').width; //full width
var stageHeight = Dimensions.get('window').height; //full height

let lasttime = +new Date



const	postToWebview = (webview, data) => {

		if (!webview) {
			return
		}
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

		// console.log("time", (+new Date) - lasttime)
		lasttime = +new Date

		if ( typeof(data) != "string" ) {
			dataStr = JSON.stringify(data)
		}else{
			dataStr = data;
		}
		var runJS = `
			window.postMessage(${dataStr})
		`;

		webview.injectJavaScript(runJS);
	}


const addOffsetForFaceData = (target)  => {
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
			result[key] = addOffsetForFaceData(value)
		} else { //获取到value值是基本的数据类型或者是函数。

			if (key == "x") {
				result[key] = offsetXPreviewDefault + (value)

			} else if (key == "y") {
				result[key] = offsetYPreviewDefault + (value)

			} else {
				result[key] = value;
			}
		}
	}
	return result
}

export { postToWebview, addOffsetForFaceData };