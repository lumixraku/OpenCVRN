const	postToWebview = (webview, data) => {
		var runJS = `
			window.postMessage("...........")
		`;
		console.log("LogDemo :::: runJS ", runJS);
		webview.injectJavaScript(runJS);
  }

export {postToWebview};