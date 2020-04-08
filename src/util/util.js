const	postToWebview = () => {
		var runJS = `
			window.postMessage("jajajajajja")
		`;
		this.webref.injectJavaScript(runJS);
  }

export {postToWebview};