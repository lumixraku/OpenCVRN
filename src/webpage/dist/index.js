(function () {
    'use strict';

    class Drawing {
        constructor() {
            this.ctx = null;
            this.faceDataQueue = null;
        }
        SetCtx(c) {
            this.ctx = c;
        }
        SetFaceDataQueue(queue) {
            this.faceDataQueue = queue;
        }
        // static Fn(){
        //     console.log("call static")   
        // }
        drawMouth(faceData) {
            var faceDataQueue = this.faceDataQueue;
            if (!faceData.bottomMouthPosition) {
                return;
            }
            var mouthOpenDirection = [];
            var mouthOpenHeight = [];
            // 计算趋势
            var i = 0;
            faceDataQueue.iterate((data) => {
                mouthOpenHeight[i] = this.calcMouthOpenHeight(data);
                // console.log("open height", mouthOpenHeight[i])
                if (i > 0) {
                    if (mouthOpenHeight[i] > mouthOpenHeight[i - 1] || mouthOpenHeight[i] > 50) {
                        mouthOpenDirection.push("+");
                    }
                    else {
                        mouthOpenDirection.push("");
                    }
                }
                else if (i == 0) {
                    mouthOpenDirection.push("");
                }
                i++;
            });
            // console.log("mouthOpenDirection", mouthOpenDirection)
            const { bottomMouthPosition, rightMouthPosition, leftMouthPosition } = faceData;
            this.drawTriangle(bottomMouthPosition, rightMouthPosition, leftMouthPosition);
            var openCount = 0;
            mouthOpenDirection.forEach((data) => {
                openCount += (data == "+") ? 1 : 0;
            });
            if (openCount / mouthOpenDirection.length > 0.5) {
                this.drawStatusText("mouse open", { x: 50, y: 50 });
            }
            else {
                this.drawStatusText("mouse close", { x: 50, y: 50 });
            }
        }
        drawTriangle(p1, p2, p3) {
            const ctx = this.ctx;
            ctx.fillStyle = "rgba(255,0,0,1)";
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.fill(); //填充闭合区域。如果path没有闭合，则fill()会自动闭合路径。
        }
        drawNose() {
            // const { noseBasePosition } = faceData
        }
        drawStatusText(text, pos) {
            const ctx = this.ctx;
            ctx.font = "30px Arial";
            ctx.fillText(text, pos.x, pos.y);
        }
        calcMouthOpenHeight(faceData) {
            const { bottomMouthPosition, rightMouthPosition, leftMouthPosition } = faceData;
            const { leftEyePosition, rightEyePosition } = faceData;
            var eyeYPos = (leftEyePosition.y + rightEyePosition.y) / 2;
            var upperLipYPos = (rightMouthPosition.y + leftMouthPosition.y) / 2;
            var lowerLipYPos = bottomMouthPosition.y;
            var mouseOpenHeight = Math.max(0, lowerLipYPos - upperLipYPos);
            return mouseOpenHeight;
        }
        drawClassification(faceData) {
            // 因为对前置摄像头做了镜像处理  所以对于左右眼要反向一下
            if (faceData.leftEyeOpenProbability < 0.3 && faceData.rightEyeOpenProbability > 0.3) {
                this.drawStatusText("right eye close", { x: 350, y: 50 });
            }
            else if (faceData.rightEyeOpenProbability < 0.3 && faceData.leftEyeOpenProbability > 0.3) {
                this.drawStatusText("left eye close", { x: 350, y: 50 });
            }
            else if (faceData.rightEyeOpenProbability > 0.3 && faceData.leftEyeOpenProbability > 0.3) {
                this.drawStatusText("both open", { x: 350, y: 50 });
            }
        }
    }
    //# sourceMappingURL=drawing.js.map

    // Linked List
    function Node(data) {
        this.data = data;
        this.next = null;
    }

    // var stack = new Stack();
    // stack.push(3);
    // stack.push(5);
    // stack.push(7);
    // stack.print();

    // Queue implemented using LinkedList
    function Queue() {
        this.head = null;
        this.tail = null;
        this.eleCount = 0;
        this.maxCount = 16;
    }

    Queue.prototype.enqueue = function (data) {
        var newNode = new Node(data);

        if (this.eleCount >= this.maxCount) {
            this.dequeue();
        }

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.eleCount++;
    };

    Queue.prototype.dequeue = function () {
        var newNode;
        if (this.head !== null) {
            newNode = this.head.data;
            this.head = this.head.next;
        }
        return newNode;
    };

    Queue.prototype.print = function () {
        var curr = this.head;
        while (curr) {
            console.log(curr.data);
            curr = curr.next;
        }
    };

    Queue.prototype.iterate = function (fn) {
        var curr = this.head;
        while (curr) {
            fn(curr.data);
            curr = curr.next;
        }
    };

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    var faceDataQueue = new Queue();
    const drawing = new Drawing();
    drawing.SetCtx(ctx);
    drawing.SetFaceDataQueue(faceDataQueue);
    setTimeout(function () {
        console.log("width  height", document.body.clientWidth, document.body.clientHeight);
    }, 1000);
    window.addEventListener("message", (event) => {
        // For Chrome, the origin property is in the event.originalEvent
        // object.
        // 这里不准确，chrome没有这个属性
        // var origin = event.origin || event.originalEvent.origin;
        var origin = event.origin;
        // console.log("screen size:::", c.clientWidth, c.clientHeight)
        // console.log("event FROM RN::::", typeof(event.data),  event.data)
        ctx.clearRect(0, 0, c.width, c.height);
        faceDataQueue.enqueue(event.data);
        drawing.drawMouth(event.data);
        drawing.drawClassification(event.data);
        if (window["ReactNativeWebView"]) {
            window["ReactNativeWebView"].postMessage("Hello! From JS");
        }
    }, false);
    //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=index.js.map
