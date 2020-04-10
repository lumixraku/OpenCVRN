var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;

import Drawing from './drawing.js'


var faceDataQueue = new Queue()



const drawing = new Drawing();
drawing.SetCtx(ctx);
drawing.SetFaceDataQueue(faceDataQueue)



setTimeout( function(){
	console.log("width  height", document.body.clientWidth, document.body.clientHeight);
}, 1000);


window.addEventListener("message", receivePostMessage, false);
var infoDiv = document.querySelector("#info")
function receivePostMessage(event) {
	// For Chrome, the origin property is in the event.originalEvent
	// object.
	// 这里不准确，chrome没有这个属性
	// var origin = event.origin || event.originalEvent.origin;
	var origin = event.origin;
	// console.log("screen size:::", c.clientWidth, c.clientHeight)
	// console.log("event FROM RN::::", typeof(event.data),  event.data)

	ctx.clearRect(0, 0, c.width, c.height)

	faceDataQueue.enqueue(event.data)
	drawing.drawMouth(event.data)
	drawing.drawClassification(event.data)
	drawing.drawNose(event.data)
  if (window.ReactNativeWebView) {
		window.ReactNativeWebView.postMessage("Hello! From JS");
	}


	// ...
}






function drawRectTest(data) {
	if (data.facepos && data.facepos.length == 4) {

		ctx.beginPath();
		ctx.lineWidth = '6';
		ctx.strokeStyle = 'red';
		ctx.rect(2, 54, 292, 347);
		ctx.stroke();
	}

}