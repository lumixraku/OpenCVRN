

import Drawing from './drawing'
import { Queue } from './queue.js'


var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;



var faceDataQueue = new Queue()



const drawing = new Drawing();
drawing.SetCtx(ctx);
drawing.SetFaceDataQueue(faceDataQueue)



setTimeout( function(){
	console.log("width  height", document.body.clientWidth, document.body.clientHeight);
}, 1000);


window.addEventListener("message", (event: MessageEvent)=> {
    
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
  if (window["ReactNativeWebView"]) {
		window["ReactNativeWebView"].postMessage("Hello! From JS");
	}

}, false);
