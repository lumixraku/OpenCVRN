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
            var mouthOpenHeight = [];
            // 计算趋势
            var i = 0;
            faceDataQueue.iterate(function (data) {
                mouthOpenHeight[i] = _this.calcMouthOpenHeight(data);
                i++;
            });
            // console.log("mouthOpenDirection", mouthOpenDirection)
            var bottomMouthPosition = faceData.bottomMouthPosition, rightMouthPosition = faceData.rightMouthPosition, leftMouthPosition = faceData.leftMouthPosition;
            this.drawTriangle(bottomMouthPosition, rightMouthPosition, leftMouthPosition);
            // if (openCount / mouthOpenDirection.length > 0.5) {
            //     this.drawStatusText("mouse open", { x: 50, y: 50 })
            // } else {
            //     this.drawStatusText("mouse close", { x: 50, y: 50 })
            // }
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        return Vector2;
    }());
    //# sourceMappingURL=Vector.js.map

    var loader = PIXI.loader;
    var resources = PIXI.loader.resources;
    var TextureCache = PIXI.utils.TextureCache;
    var Sprite = PIXI.Sprite;
    var stageHeight = document.body.clientHeight;
    var eatPosSY = stageHeight / 2 - 100; //超过这个点还没有吃到的话  视为miss
    var eatPosEY = stageHeight / 2 + 100; //超过这个点还没有吃到的话  视为miss
    var Food = /** @class */ (function (_super) {
        __extends(Food, _super);
        function Food() {
            var _this = this;
            var resourceMap = resources["/images/animals.json"].textures;
            // new Sprite(resourceMap["cat.png"]);
            _this = _super.call(this, resourceMap["cat.png"]) || this;
            return _this;
        }
        return Food;
    }(PIXI.Sprite));
    var EatGame = /** @class */ (function () {
        function EatGame() {
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
            this.foodList = new Array();
            this.foodMovingList = new Array();
            this.renderText();
        }
        EatGame.prototype.testTween = function () {
            var _this = this;
            var resourceMap = resources["/images/animals.json"].textures;
            //The cat
            var cat = new Sprite(resourceMap["cat.png"]);
            cat.position.x = 16;
            cat.position.y = 16;
            this.app.stage.addChild(cat);
            var dest = new Vector2(200, 200);
            new TWEEN.Tween({ x: cat.x, y: cat.y })
                .to({ x: dest.x, y: dest.y }, 500)
                .onUpdate(function (o) {
                cat.y = o.y;
                cat.x = o.x;
            })
                .easing(TWEEN.Easing.Cubic.In)
                // .repeat(Infinity)
                // .yoyo(true) //到了终点之后 再动画返回原点
                .start()
                .onComplete(function (e) {
                _this.app.stage.removeChild(cat);
            });
        };
        EatGame.prototype.makeScene = function () {
            var _this = this;
            // this.addCat()
            this.testTween();
            this.app.ticker.add(function (delta) { return _this.gameLoop(delta); });
        };
        EatGame.prototype.gameLoop = function (delta) {
            TWEEN.update();
            this.elapse++;
            this.movingFood();
            if (this.elapse > 60) {
                this.elapse = 0;
                this.addMoreFood();
                this.changeMouthState();
            }
            this.reachBottomLineCat();
            this.shouldIEat();
        };
        EatGame.prototype.loadRes = function (callback) {
            loader
                .add("/images/animals.json")
                .load(callback);
        };
        EatGame.prototype.addMoreFood = function () {
            var app = this.app;
            var food = new Food();
            food.x = 16;
            food.y = 16;
            this.foodList.push(food);
            app.stage.addChild(food);
            console.log("pixi......", app.stage.children);
        };
        EatGame.prototype.movingFood = function () {
            for (var _i = 0, _a = this.foodList; _i < _a.length; _i++) {
                var food = _a[_i];
                if (food.transform) {
                    if (!food.eating) {
                        food.y += 6;
                    }
                }
                //miss
                if (food.y > eatPosEY && food.miss === false) {
                    var resourceMap = resources["/images/animals.json"].textures;
                    food.miss = true;
                    food.texture = resourceMap["hedgehog.png"];
                }
            }
        };
        EatGame.prototype.reachBottomLineCat = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (food.y >= stageHeight - food.height) {
                    console.log('miss');
                    food.destroy();
                    this.foodList.splice(i--, 1);
                }
            }
        };
        // 寻找当前列表中第一个不是 miss 的cat
        EatGame.prototype.getFirstAvailableCat = function () {
            for (var _i = 0, _a = this.foodList; _i < _a.length; _i++) {
                var food = _a[_i];
                if (!food.miss) {
                    return food;
                }
            }
            return null;
        };
        // call Each Frame
        EatGame.prototype.shouldIEat = function () {
            if (this.mouthOpen) {
                for (var i = 0; i < this.foodList.length; i++) {
                    var food = this.foodList[i];
                    if (food && food.transform) {
                        // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                        if (food.y > eatPosSY && food.y < eatPosEY) {
                            this.foodList.splice(i--, 1);
                            this.eatingFood(food, new Vector2(200, 300));
                        }
                    }
                }
            }
        };
        EatGame.prototype.eatingFood = function (food, dest) {
            var _this = this;
            food.eating = true;
            new TWEEN.Tween({ x: food.x, y: food.y })
                .to({ x: dest.x, y: dest.y }, 1000)
                .onUpdate(function (o) {
                food.y = o.y;
                food.x = o.x;
            })
                .easing(TWEEN.Easing.Cubic.In)
                // .repeat(Infinity)
                // .yoyo(true) //到了终点之后 再动画返回原点
                .start()
                .onComplete(function (e) {
                console.log("eat finish", food.x, food.y);
                food.destroy();
                _this.app.stage.removeChild(food);
            });
        };
        EatGame.prototype.changeMouthState = function () {
            // 这里还会有一些其他条件  待补充
            if (Math.random() > 0.5) {
                this.mouthText.text = "OPEN";
                this.mouthOpen = true;
            }
            else {
                this.mouthText.text = "CLOSE";
                this.mouthOpen = false;
            }
        };
        EatGame.prototype.renderText = function () {
            var mouthText = new PIXI.Text("The En", new PIXI.TextStyle({
                fontFamily: "Futura",
                fontSize: 64,
                fill: "red"
            }));
            this.mouthText = mouthText;
            mouthText.x = 15;
            mouthText.y = 15;
            this.app.stage.addChild(mouthText);
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

}(PIXI, TWEEN));
//# sourceMappingURL=index.js.map
