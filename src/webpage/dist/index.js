(function (PIXI, TWEEN) {
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

    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        return Vector2;
    }());
    //# sourceMappingURL=Vector.js.map

    console.log("pixi......", PIXI);
    var loader = PIXI.loader;
    var resources = PIXI.loader.resources;
    var TextureCache = PIXI.utils.TextureCache;
    var Sprite = PIXI.Sprite;
    var stageHeight = document.body.clientHeight;
    var eatPosY = stageHeight / 2; //超过这个点还没有吃到的话  视为miss
    var EatGame = /** @class */ (function () {
        function EatGame() {
            var _this = this;
            // 不断的生成猫猫
            this.elapse = 0;
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
            this.catList = new Array();
            app.ticker.add(function (delta) { return _this.gameLoop(delta); });
        }
        EatGame.prototype.gameLoop = function (delta) {
            TWEEN.update();
            this.moreCats(delta);
            this.movingCat();
            this.reachBottomLineCat();
            this.shouldIEat();
        };
        EatGame.prototype.loadRes = function (callback) {
            loader
                .add("/images/animals.json")
                .load(callback);
        };
        EatGame.prototype.makeScene = function () {
            this.addCat();
        };
        EatGame.prototype.moreCats = function (delta) {
            this.elapse += delta;
            if (this.elapse > 60) {
                this.elapse = 0;
                this.addCat();
            }
        };
        EatGame.prototype.addCat = function () {
            var app = this.app;
            var resourceMap = resources["/images/animals.json"].textures;
            //The cat
            var cat = new Sprite(resourceMap["cat.png"]);
            cat.position.set(16, 16);
            this.catList.push(cat);
            app.stage.addChild(cat);
        };
        EatGame.prototype.movingCat = function () {
            for (var _i = 0, _a = this.catList; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (cat.transform) {
                    cat.y += 6;
                }
                // console.log("cat", cat.y)
            }
        };
        EatGame.prototype.reachBottomLineCat = function () {
            for (var i = 0; i < this.catList.length; i++) {
                var cat = this.catList[i];
                if (cat.y >= stageHeight - cat.height) {
                    console.log('miss');
                    cat.destroy();
                    this.catList.splice(i--, 1);
                }
            }
        };
        // 寻找当前列表中第一个不是 miss 的cat
        EatGame.prototype.getFirstAvailableCat = function () {
            for (var _i = 0, _a = this.catList; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (!cat["miss"]) {
                    return cat;
                }
            }
            return null;
        };
        // call Each Frame
        EatGame.prototype.shouldIEat = function () {
            var firstCat = this.getFirstAvailableCat();
            if (firstCat) {
                // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                if (firstCat && firstCat.transform && firstCat.y > eatPosY) {
                    var openMouthPropability = void 0;
                    if (!firstCat["propability"]) {
                        firstCat["propability"] = Math.random();
                    }
                    openMouthPropability = firstCat["propability"];
                    if (openMouthPropability > 0.5) {
                        var cat = this.catList.pop();
                        console.log("eat", cat.y);
                        this.eatCat(cat, new Vector2(200, 300));
                        //miss
                    }
                    else {
                        var resourceMap = resources["/images/animals.json"].textures;
                        firstCat["miss"] = true;
                        firstCat.texture = resourceMap["hedgehog.png"];
                    }
                }
            }
        };
        EatGame.prototype.eatCat = function (cat, dest) {
            var _this = this;
            new TWEEN.Tween({ x: cat.x, y: cat.y })
                .to({ x: dest.x, y: dest.y }, 900 + Math.random() * 200)
                .onUpdate(function (o) {
                cat.y = o.y;
                cat.x = o.x;
            })
                .easing(TWEEN.Easing.Quadratic.InOut)
                // .repeat(Infinity)
                // .yoyo(true) //到了终点之后 再动画返回原点
                .start()
                .onComplete(function (e) {
                console.log("eat finish", cat);
                cat.destroy();
                _this.app.stage.removeChild(cat);
            });
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
    //# sourceMappingURL=index.js.map

}(PIXI, TWEEN));
//# sourceMappingURL=index.js.map
