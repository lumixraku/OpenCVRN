

import Drawing from '@root/drawing'
import { Queue } from './queue'
import EatGame from '@game/game'
import { FaceData } from '@root/faceData'

var c:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;



var faceDataQueue = new Queue()

var game = new EatGame();


const drawing = new Drawing();
drawing.SetCtx(ctx);
drawing.SetFaceDataQueue(faceDataQueue)

setTimeout( function(){
	console.log("width  height", document.body.clientWidth, document.body.clientHeight);
}, 1000);

let lasttime = +new Date
window.addEventListener("message", (event: MessageEvent)=> {
    
	// For Chrome, the origin property is in the event.originalEvent
	// object.
	// 这里不准确，chrome没有这个属性
	// var origin = event.origin || event.originalEvent.origin;
	var origin = event.origin;
	// console.log("screen size:::", c.clientWidth, c.clientHeight)
	// console.log("event FROM RN::::", typeof(event.data),  event.data)

	// ctx.clearRect(0, 0, c.width, c.height)
	let faceData = event.data as FaceData
	faceDataQueue.enqueue(faceData)
	game.setMouthPos(faceData)

	console.log("time", (+new Date) - lasttime )
	lasttime = +new Date


	if (window["ReactNativeWebView"]) {
		window["ReactNativeWebView"].postMessage("Hello! From JS");
	}
}, false);
