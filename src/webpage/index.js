window.addEventListener("message", receiveMessage, false);
var infoDiv = document.querySelector("#info")
function receiveMessage(event) {
	// For Chrome, the origin property is in the event.originalEvent
	// object.
	// 这里不准确，chrome没有这个属性
	// var origin = event.origin || event.originalEvent.origin;
	var origin = event.origin;
	console.log("event FROM RN::::", event.data)


  if (window.ReactNativeWebView) {
		window.ReactNativeWebView.postMessage("Hello! From JS");
	}
	// ...
}
