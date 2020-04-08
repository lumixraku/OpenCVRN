window.addEventListener("message", receivePostMessage, false);
var infoDiv = document.querySelector("#info")
function receivePostMessage(event) {
	// For Chrome, the origin property is in the event.originalEvent
	// object.
	// 这里不准确，chrome没有这个属性
	// var origin = event.origin || event.originalEvent.origin;
	var origin = event.origin;
	console.log("event FROM RN::::", typeof(event.data),  event.data)


  if (window.ReactNativeWebView) {
		window.ReactNativeWebView.postMessage("Hello! From JS");
	}
	// ...
}
