var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = document.body.clientWidth
c.height = document.body.clientHeight;
// Red rectangle
// ctx.beginPath();
// ctx.lineWidth = "6";
// ctx.strokeStyle = "red";
// ctx.rect(2, 54, 192, 147);
// ctx.stroke();


window.addEventListener("message", receivePostMessage, false);
var infoDiv = document.querySelector("#info")
function receivePostMessage(event) {
	// For Chrome, the origin property is in the event.originalEvent
	// object.
	// 这里不准确，chrome没有这个属性
	// var origin = event.origin || event.originalEvent.origin;
	var origin = event.origin;
	console.log("screen size:::", c.clientWidth, c.clientHeight)
	console.log("event FROM RN::::", typeof(event.data),  event.data)

	drawRect(event.data)

  if (window.ReactNativeWebView) {
		window.ReactNativeWebView.postMessage("Hello! From JS");
	}


	// ...
}

function drawRect(data) {
	if (data.facepos && data.facepos.length == 4) {

		ctx.beginPath();
		ctx.lineWidth = '6';
		ctx.strokeStyle = 'red';
		ctx.rect(2, 54, 292, 347);
		ctx.stroke();
	}

}