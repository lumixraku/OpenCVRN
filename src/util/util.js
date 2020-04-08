
import _ from "underscore";

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
		if ( typeof(data) != "string" ) {
			dataStr = JSON.parse(data)
		}else{
			dataStr = data;
		}
		// dataStr = dataStr.replace('"', '\"')
		var runJS = `
			window.postMessage(${dataStr})
		`;

		console.log("LogDemo :::: runJS ", runJS);
		webview.injectJavaScript(runJS);
  }

export {postToWebview};