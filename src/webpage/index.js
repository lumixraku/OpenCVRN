var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;

setTimeout( function(){
	console.log("width  height", document.body.clientWidth, document.body.clientHeight);
}, 1000);

// Red rectangle
// ctx.beginPath();
// ctx.lineWidth = "6";
// ctx.strokeStyle = "red";
// ctx.rect(2, 54, 192, 147);
// ctx.stroke();

var faceDataQueue = new Queue()

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
	drawMouth(event.data)
  if (window.ReactNativeWebView) {
		window.ReactNativeWebView.postMessage("Hello! From JS");
	}


	// ...
}


function drawMouth(faceData) {
	if (!faceData.bottomMouthPosition) {
		return
	}
	var mouthOpenDirection= []
	var mouthOpenHeight = []
	// 计算趋势
	var i = 0
	faceDataQueue.iterate( function(data) {
		mouthOpenHeight[i] = calcMouthOpenHeight(data)
		console.log("open height", mouthOpenHeight[i])
		if (i > 0) {
			if (mouthOpenHeight[i] > mouthOpenHeight[i-1]  || mouthOpenHeight[i] > 50) {
				mouthOpenDirection.push("+")
			} else {
				mouthOpenDirection.push("")
			}
		} else if (i == 0) {
			mouthOpenDirection.push("")
		}

		i++
	});
	console.log("mouthOpenDirection", mouthOpenDirection)

	const { bottomMouthPosition, rightMouthPosition, leftMouthPosition } = faceData
	drawTriangle(bottomMouthPosition, rightMouthPosition, leftMouthPosition)

	var openCount = 0
	mouthOpenDirection.forEach((data)=> {
		openCount += (data == "+") ? 1 : 0
	})
	if (openCount / mouthOpenDirection.length > 0.5) {
		drawStatusText("mouse open")
	}else{
		drawStatusText("mouse close")
	}
}


function drawTriangle(p1, p2, p3){
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.fill(); //填充闭合区域。如果path没有闭合，则fill()会自动闭合路径。
}

function drawStatusText(text) {
	ctx.font = "30px Arial";
	ctx.fillText(text, 10, 50);
}

function calcMouthOpenHeight(faceData) {
	const { bottomMouthPosition, rightMouthPosition, leftMouthPosition } = faceData
	const { leftEyePosition, rightEyePosition } = faceData

	var eyeYPos = (leftEyePosition.y + rightEyePosition.y)/2
	var upperLipYPos = (rightMouthPosition.y + leftMouthPosition.y) /2 
	var lowerLipYPos = bottomMouthPosition.y
	var mouseOpenHeight = Math.max(0, lowerLipYPos - upperLipYPos)
	return mouseOpenHeight
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