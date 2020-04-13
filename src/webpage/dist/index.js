(function (PIXI) {
    'use strict';

    var Drawing = /** @class */ (function () {
        function Drawing() {
            this.ctx = null;
            this.faceDataQueue = null;
        }
        Drawing.prototype.SetCtx = function (c) {
            this.ctx = c;
        };
        Drawing.prototype.SetFaceDataQueue = function (queue) {
            this.faceDataQueue = queue;
        };
        // static Fn(){
        //     console.log("call static")   
        // }
        Drawing.prototype.drawMouth = function (faceData) {
            var _this = this;
            var faceDataQueue = this.faceDataQueue;
            if (!faceData.bottomMouthPosition) {
                return;
            }
            var mouthOpenDirection = [];
            var mouthOpenHeight = [];
            // 计算趋势
            var i = 0;
            faceDataQueue.iterate(function (data) {
                mouthOpenHeight[i] = _this.calcMouthOpenHeight(data);
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
            var bottomMouthPosition = faceData.bottomMouthPosition, rightMouthPosition = faceData.rightMouthPosition, leftMouthPosition = faceData.leftMouthPosition;
            this.drawTriangle(bottomMouthPosition, rightMouthPosition, leftMouthPosition);
            var openCount = 0;
            mouthOpenDirection.forEach(function (data) {
                openCount += (data == "+") ? 1 : 0;
            });
            if (openCount / mouthOpenDirection.length > 0.5) {
                this.drawStatusText("mouse open", { x: 50, y: 50 });
            }
            else {
                this.drawStatusText("mouse close", { x: 50, y: 50 });
            }
        };
        Drawing.prototype.drawTriangle = function (p1, p2, p3) {
            var ctx = this.ctx;
            ctx.fillStyle = "rgba(255,0,0,1)";
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.fill(); //填充闭合区域。如果path没有闭合，则fill()会自动闭合路径。
        };
        Drawing.prototype.drawNose = function () {
            // const { noseBasePosition } = faceData
        };
        Drawing.prototype.drawStatusText = function (text, pos) {
            var ctx = this.ctx;
            ctx.font = "30px Arial";
            ctx.fillText(text, pos.x, pos.y);
        };
        Drawing.prototype.calcMouthOpenHeight = function (faceData) {
            var bottomMouthPosition = faceData.bottomMouthPosition, rightMouthPosition = faceData.rightMouthPosition, leftMouthPosition = faceData.leftMouthPosition;
            var leftEyePosition = faceData.leftEyePosition, rightEyePosition = faceData.rightEyePosition;
            var eyeYPos = (leftEyePosition.y + rightEyePosition.y) / 2;
            var upperLipYPos = (rightMouthPosition.y + leftMouthPosition.y) / 2;
            var lowerLipYPos = bottomMouthPosition.y;
            var mouseOpenHeight = Math.max(0, lowerLipYPos - upperLipYPos);
            return mouseOpenHeight;
        };
        Drawing.prototype.drawClassification = function (faceData) {
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
        };
        return Drawing;
    }());
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

    console.log("pixi......", PIXI);
    var loader = PIXI.loader;
    var resources = PIXI.loader.resources;
    var TextureCache = PIXI.utils.TextureCache;
    var Sprite = PIXI.Sprite;
    var EatGame = /** @class */ (function () {
        function EatGame() {
            var app = new PIXI.Application({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                antialias: true,
                transparent: true,
                resolution: 1
            });
            this.app = app;
            this.makeScene = this.makeScene.bind(this);
            document.body.appendChild(app.view);
            this.loadRes(this.makeScene);
        }
        EatGame.prototype.loadRes = function (callback) {
            loader
                .add("/images/animals.json")
                .load(callback);
        };
        EatGame.prototype.makeScene = function () {
            this.addCat();
        };
        EatGame.prototype.addCat = function () {
            var app = this.app;
            var resourceMap = resources["/images/animals.json"].textures;
            //The cat
            var cat = new Sprite(resourceMap["cat.png"]);
            cat.position.set(16, 16);
            app.stage.addChild(cat);
        };
        return EatGame;
    }());
    //# sourceMappingURL=game.js.map

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    var faceDataQueue = new Queue();
    var drawing = new Drawing();
    drawing.SetCtx(ctx);
    drawing.SetFaceDataQueue(faceDataQueue);
    setTimeout(function () {
        console.log("width  height", document.body.clientWidth, document.body.clientHeight);
    }, 1000);
    window.addEventListener("message", function (event) {
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
    new EatGame();

}(PIXI));
//# sourceMappingURL=index.js.map
