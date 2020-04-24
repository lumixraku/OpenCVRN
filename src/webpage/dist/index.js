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

    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.add = function (v) {
            this.x = this.x + v.x;
            this.y = this.y + v.y;
        };
        return Vector2;
    }());
    //# sourceMappingURL=Vector.js.map

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

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var resources = PIXI.loader.resources;
    var TextureCache = PIXI.utils.TextureCache;
    var CircleTable = /** @class */ (function (_super) {
        __extends(CircleTable, _super);
        // x y 表示圆桌在画布上的位置
        function CircleTable(x, y, radius) {
            var _this = this;
            // 这样会改变在画布中的额位置
            // this.x = x
            // this.y = y
            var tex = resources['/images/pinwheel.png'].texture;
            _this = _super.call(this, tex) || this;
            _this.origin = new Vector2(x, y);
            _this.radius = radius;
            _this.bounds = _this.getBounds();
            _this.width = _this.bounds.width;
            _this.height = _this.bounds.height;
            _this.pivot.x = _this.width / 2;
            _this.pivot.y = _this.height / 2;
            _this.degree = 0;
            return _this;
        }
        CircleTable.prototype.draw = function (parent) {
            // this.beginFill(0xFF0000, 1);
            // this.drawCircle(0, 0, this.radius); // drawCircle(x, y, radius)
            // this.endFill();    
            // x y 等 pos 坐标因为 pivot 而改变
            // 原本 x y 是指图片的左上角
            // 现在 x y 是图片的中心点
            this.x = this.origin.x; // - this.width/2
            this.y = this.origin.y; // - this.height/2
            // this.beginFill(0xFF0000, 1);
            // this.lineStyle(0, 0xFF0000, 1);
            // this.moveTo(200, 200);
            // this.lineTo(200, 300);
            // this.lineTo(300, 300)        
            // stage.addChild(this.applyTexture())
            parent.addChild(this);
        };
        CircleTable.prototype.create = function () {
            var newG = new PIXI.Graphics();
            newG.beginFill(0xe74c3c); // Red
            newG.drawCircle(this.x, this.y, this.radius);
            newG.endFill();
            this.graph = newG;
            return newG;
        };
        // 这个好像不对 
        // 这是在底部挖了一个洞  当graphic 移动的时候 纹理却没有移动
        CircleTable.prototype.apppplyTexture = function () {
            //create a texture
            var img = new Image();
            img.src = '/images/logo.png';
            var base = new PIXI.BaseTexture(img);
            var texture = new PIXI.Texture(base); // return you the texture        
            var tilingSprite = new PIXI.TilingSprite(texture, 0, 0);
            tilingSprite.mask = this;
            return tilingSprite;
        };
        CircleTable.prototype.startSpin = function (delta) {
            this.degree += delta;
            // angle 为正是顺时针旋转
            this.angle = -this.degree;
            // this.rotation -= 0.01 * delta;
        };
        CircleTable.prototype.degreeToPos = function (deg) {
            // Math.cos(x) 这里默认是弧度制
            // 而参数中的 deg 是角度
            // 所以要把角度转为弧度
            deg = Math.PI / 180 * deg;
            var r = this.radius;
            var pos;
            if (deg >= 0 && deg <= 90) {
                pos = new Vector2(Math.cos(deg) * r, Math.sin(deg) * r);
            }
            else if (deg > 90 && deg <= 180) {
                deg = 180 - deg;
                pos = new Vector2(-Math.cos(deg) * r, Math.sin(deg) * r);
            }
            else if (deg > 180 && deg <= 270) {
                deg = deg - 180;
                pos = new Vector2(-Math.cos(deg) * r, -Math.sin(deg) * r);
            }
            else if (deg > 270 && deg <= 360) {
                deg = 360 - deg;
                pos = new Vector2(Math.cos(deg) * r, -Math.sin(deg) * r);
            }
            // 和数学中的坐标系不一样哎                    
            // pos.add(this.origin)
            var gamePos = new Vector2(0, 0);
            gamePos.y = this.origin.y - pos.y;
            gamePos.x = this.origin.x + pos.x;
            return gamePos;
        };
        return CircleTable;
    }(PIXI.Sprite));
    //# sourceMappingURL=CircleTable.js.map

    var resources$1 = PIXI.loader.resources;
    var TextureCache$1 = PIXI.utils.TextureCache;
    var Mouth = /** @class */ (function (_super) {
        __extends(Mouth, _super);
        // constructor(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2) {
        //     super()
        //     this.leftPos = leftPos
        //     this.rightPos = rightPos
        //     this.bottomPos = bottomPos
        // }
        function Mouth(points) {
            var _this = _super.call(this) || this;
            // 适用于特征点
            _this.leftPos = new Vector2(0, 0);
            _this.rightPos = new Vector2(0, 0);
            _this.bottomPos = new Vector2(0, 0);
            // 适用于轮廓线
            _this.lowerLipBottom = [];
            _this.lowerLipTop = [];
            _this.upperLipTop = []; // 上嘴唇有 11 个点  其他都是 9个点
            _this.upperLipBottom = [];
            _this.openThreshold = 90;
            _this.points = points;
            if (window.navigator.userAgent.indexOf("ONEPLUS") == -1) {
                _this.openThreshold = 0;
            }
            return _this;
        }
        Mouth.prototype.refreshByNewContours = function (face) {
            this.clear();
            this.lowerLipBottom = face.lowerLipBottom;
            this.lowerLipTop = face.lowerLipTop;
            this.upperLipTop = face.upperLipTop;
            this.upperLipBottom = face.upperLipBottom;
            this.points = __spreadArrays(face.lowerLipBottom, face.lowerLipTop, face.upperLipTop, face.upperLipBottom);
            // this.beginFill(0xFF0000, 1);
            this.lineStyle(5, 0xFF0000, 1);
            var idx = 0;
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var p = _a[_i];
                if (idx == 0) {
                    this.moveTo(p.x, p.y);
                }
                this.lineTo(p.x, p.y);
                idx++;
            }
            this.calcMouthRect();
            // this.endFill();
        };
        Mouth.prototype.refreshByNewPoint = function (leftPos, rightPos, bottomPos) {
            this.clear();
            this.leftPos = leftPos;
            this.rightPos = rightPos;
            this.bottomPos = bottomPos;
            this.beginFill(0xFF0000, 1);
            this.lineStyle(0, 0xFF0000, 1);
            this.moveTo(rightPos.x, rightPos.y);
            this.lineTo(leftPos.x, leftPos.y);
            this.lineTo(bottomPos.x, bottomPos.y);
            //draw Top Line & bottom Line
            this.beginFill(0x00FF00, 1);
            this.lineStyle(3, 0x00FF00, 1);
            this.moveTo(rightPos.x, rightPos.y - 100);
            this.lineTo(rightPos.x, rightPos.y + 100);
            this.endFill();
        };
        Mouth.prototype.calcMouthRect = function () {
            var topY = 0;
            var bottomY = 0;
            var upperY = this.upperLipTop.map(function (v) {
                return v.y;
            });
            var lowerY = this.lowerLipBottom.map(function (v) {
                return v.y;
            });
            topY = Math.min.apply(Math, upperY);
            bottomY = Math.max.apply(Math, lowerY);
            var top = topY;
            var left = this.upperLipTop[0].x;
            var right = this.upperLipTop[10].x;
            var width = right - left;
            var height = bottomY - topY;
            this.mouthRect = new PIXI.Rectangle(left, top, width, height);
            topY = Math.min.apply(Math, upperY) - 100;
            return topY;
        };
        Mouth.prototype.getMouthRect = function () {
            return this.mouthRect;
        };
        // https://firebase.google.com/docs/ml-kit/images/examples/face_contours.svg
        Mouth.prototype.getMouthCenter = function () {
            if (this.upperLipTop.length == 0) {
                return;
            }
            var avg = function (arr) { return arr.reduce(function (acc, val) { return acc + val; }, 0) / arr.length; };
            var x = avg([this.upperLipTop[4].x, this.upperLipTop[5].x, this.upperLipTop[6].x]);
            var y = avg([this.upperLipTop[5].y, this.upperLipBottom[4].y, this.lowerLipTop[4].y, this.lowerLipBottom[4].y]);
            return new Vector2(x, y);
        };
        Mouth.prototype.checkOpenRs = function () {
            var bottomY = Math.max(Math.max(this.leftPos.y, this.rightPos.y), this.bottomPos.y);
            var topY = Math.min(this.leftPos.y, this.rightPos.y);
            return {
                rs: bottomY - topY > this.openThreshold,
                val: bottomY - topY
            };
        };
        Mouth.prototype.checkMouthOpenByContour = function () {
            if (!this.mouthRect) {
                return {
                    rs: false
                };
            }
            return {
                rs: this.mouthRect.height > this.openThreshold,
                // rs: true,
                val: this.mouthRect.height
            };
        };
        Mouth.prototype.isNearMouth = function (food) {
            var rect = this.mouthRect;
            if ((food.y < rect.top + rect.height + 100) && (food.y > rect.top - 100)) {
                return true;
            }
            else {
                return false;
            }
        };
        Mouth.prototype.missedFood = function (food) {
            var rect = this.mouthRect;
            return (food.y > rect.top + rect.height + 100);
        };
        return Mouth;
    }(PIXI.Graphics));

    var resources$2 = PIXI.loader.resources;
    var TextureCache$2 = PIXI.utils.TextureCache;
    var Food = /** @class */ (function (_super) {
        __extends(Food, _super);
        function Food() {
            var _this = this;
            var resourceMap = resources$2["/images/animals.json"].textures;
            _this = _super.call(this, resourceMap["cat.png"]) || this;
            _this.textures = resourceMap;
            // new Sprite(resourceMap["cat.png"]);
            _this.bounds = _this.getBounds();
            _this.width = _this.bounds.width;
            _this.height = _this.bounds.height;
            _this.pivot.x = _this.width / 2;
            _this.pivot.y = _this.height / 2;
            _this.degree = 0;
            return _this;
        }
        Food.prototype.changeTexture = function () {
            this.texture = this.textures["hedgehog.png"];
        };
        Food.prototype.centerPosToLeftTopPos = function (x, y) {
            return new Vector2(x - this.width / 2, y - this.height / 2);
        };
        return Food;
    }(PIXI.Sprite));
    //# sourceMappingURL=Food.js.map

    var loader = PIXI.loader;
    var resources$3 = PIXI.loader.resources;
    var TextureCache$3 = PIXI.utils.TextureCache;
    var Sprite = PIXI.Sprite;
    var stageHeight = document.body.clientHeight;
    var stageWidth = document.body.clientWidth;
    var EatGame = /** @class */ (function () {
        function EatGame() {
            var _this = this;
            this.score = 0;
            this.elapse = 0;
            this.genFoodGap = 60;
            this.frameCount = 0;
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
            this.loadRes(function () {
                _this.makeScene();
                _this.foodList = new Array();
                _this.foodMovingList = new Array();
                var ct = new CircleTable(stageWidth / 2, stageHeight, 200);
                ct.draw(_this.app.stage);
                _this.table = ct;
                // this.mouth = new Mouth(defaultPos, defaultPos, defaultPos)
                _this.mouth = new Mouth([]);
                _this.app.stage.addChild(_this.mouth);
                // this.score = 0
                _this.renderScore();
                // 收尾
                _this.renderTestText();
            });
        }
        EatGame.prototype.testTween = function () {
            var _this = this;
            var resourceMap = resources$3["/images/animals.json"].textures;
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
        EatGame.prototype.testSpin = function () {
            var _this = this;
            var resourceMap = resources$3["/images/animals.json"].textures;
            //The cat
            var cat = new Sprite(resourceMap["cat.png"]);
            cat.position.x = 16;
            cat.position.y = 16;
            this.app.stage.addChild(cat);
            cat.pivot.x = cat.getBounds().x;
            cat.pivot.y = cat.getBounds().y;
            var rotation = 0;
            var setPosFn = function (deg) {
                var pos = _this.table.degreeToPos(deg);
                // let deg = 315
                cat.x = pos.x;
                cat.y = pos.y;
            };
            this.app.ticker.add(function (delta) {
                rotation += 0.1 * delta;
                var deg = rotation % 360;
                setPosFn(deg);
            });
        };
        EatGame.prototype.makeScene = function () {
            var _this = this;
            this.app.ticker.add(function (delta) { return _this.gameUILoop(delta); });
            this.app.ticker.add(function (delta) { return _this.gameCheckLoop(delta); });
            // this.testSpin()
        };
        EatGame.prototype.gameCheckLoop = function (delta) {
            //60帧 加一次食物
            if (this.frameCount > this.genFoodGap) {
                this.addMoreFood();
                this.updateMouthState();
                this.frameCount = 0;
            }
            this.reachBottomLineCat();
            this.shouldIEat();
        };
        EatGame.prototype.gameUILoop = function (delta) {
            this.elapse++;
            this.frameCount++;
            TWEEN.update();
            this.table.startSpin(delta);
            // this.movingFood()
            this.movingFoodOnTable(delta);
        };
        EatGame.prototype.loadRes = function (callback) {
            loader
                .add("/images/animals.json")
                .add('/images/pinwheel.png')
                .load(callback);
        };
        EatGame.prototype.addMoreFood = function () {
            console.log("more food");
            // 桌上最多 6个 食物
            if (this.foodList.length >= 6) {
                return;
            }
            var app = this.app;
            var food = new Food();
            food.x = -1000;
            food.y = -1000 + Math.random() * 30;
            // food.visible = false
            this.foodList.push(food);
            app.stage.addChild(food);
        };
        EatGame.prototype.movingFood = function () {
            for (var _i = 0, _a = this.foodList; _i < _a.length; _i++) {
                var food = _a[_i];
                if (food.transform) {
                    if (!food.eating) {
                        food.y += (3 + Math.random() * 3);
                    }
                }
                //miss
                if (this.mouth.missedFood(new Vector2(food.x, food.y)) && !food.miss) {
                    food.miss = true;
                    food.changeTexture();
                    // let resourceMap = resources["/images/animals.json"].textures;
                    // food.texture = resourceMap["hedgehog.png"]
                }
            }
        };
        /**
         * 食物转圈圈
         * @param delta
         */
        EatGame.prototype.movingFoodOnTable = function (delta) {
            var foodInTable = function (food) {
                return food.transform && !food.eating;
            };
            for (var _i = 0, _a = this.foodList; _i < _a.length; _i++) {
                var food = _a[_i];
                // 逆时针旋转
                if (foodInTable(food)) {
                    food.degree += delta;
                    var pos = this.table.degreeToPos(food.degree);
                    food.position.x = pos.x;
                    food.position.y = pos.y;
                }
            }
        };
        EatGame.prototype.reachBottomLineCat = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (food.y >= stageHeight + 400) {
                    food.destroy();
                    this.foodList.splice(i--, 1);
                }
            }
        };
        // call Each Frame
        EatGame.prototype.shouldIEat = function () {
            if (this.mouth && this.mouth.checkMouthOpenByContour().rs) {
                for (var i = 0; i < this.foodList.length; i++) {
                    var food = this.foodList[i];
                    if (food && food.transform) {
                        // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                        var mouthRect = this.mouth.getMouthRect();
                        if (this.mouth.isNearMouth(new Vector2(food.x, food.y)) && !food.eating) {
                            this.foodList.splice(i--, 1);
                            var mouthCenter = this.mouth.getMouthCenter();
                            this.eatingFood(food, mouthCenter);
                        }
                    }
                }
            }
        };
        EatGame.prototype.eatingFood = function (food, dest) {
            var _this = this;
            // let leftTopPos = food.centerPosToLeftTopPos(dest.x, dest.y)
            // 注意应该使图片的中心位置移动到 dest
            food.eating = true;
            new TWEEN.Tween({ x: food.x, y: food.y })
                .to({ x: dest.x, y: dest.y }, 1000)
                .onUpdate(function (o) {
                food.y = o.y;
                food.x = o.x;
            })
                .easing(TWEEN.Easing.Quintic.Out)
                // .repeat(Infinity)
                // .yoyo(true) //到了终点之后 再动画返回原点
                .start()
                .onComplete(function (e) {
                food.destroy();
                _this.app.stage.removeChild(food);
                _this.finishEating();
            });
        };
        EatGame.prototype.updateMouthState = function () {
            // 这里还会有一些其他条件  待补充
            // if  (Math.random() > 0.4) {
            //     this.mouthText.text = "OPEN"
            //     this.mouthOpen = true;
            // }else {
            //     this.mouthText.text = "CLOSE"
            //     this.mouthOpen = false;
            // }
            // let rs = this.mouth.checkOpenRs()
            // this.mouthText.text = "" + rs.val
        };
        EatGame.prototype.finishEating = function () {
            this.score++;
            this.renderScore();
        };
        EatGame.prototype.renderScore = function () {
            if (!this.scoreText) {
                this.scoreText = new PIXI.Text("Score: " + this.score, new PIXI.TextStyle({
                    fontFamily: "Futura",
                    fontSize: 24,
                    fill: "red"
                }));
                this.scoreText.x = stageWidth - 100;
                this.scoreText.y = 25;
                this.app.stage.addChild(this.scoreText);
            }
            else {
                this.scoreText.text = "Score: " + this.score;
            }
        };
        EatGame.prototype.renderTestText = function () {
            var mouthText = new PIXI.Text("The End");
            this.mouthText = mouthText;
            mouthText.x = 15;
            mouthText.y = 15;
            this.app.stage.addChild(mouthText);
        };
        EatGame.prototype.setMouthPos = function (faceData) {
            // when landmarks
            var rightPos = faceData.rightMouthPosition;
            var leftPos = faceData.leftMouthPosition;
            var bottomPos = faceData.bottomMouthPosition;
            // when contour
            if (!this.mouth) {
                // this.mouth = new Mouth(leftPos, rightPos, bottomPos)
                this.mouth = new Mouth([]);
                this.app.stage.addChild(this.mouth);
            }
            else {
                // this.mouth.refreshByNewContours(faceData.face)
                this.mouth.refreshByNewContours(faceData);
            }
        };
        return EatGame;
    }());

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    var faceDataQueue = new Queue();
    var game = new EatGame();
    var drawing = new Drawing();
    drawing.SetCtx(ctx);
    drawing.SetFaceDataQueue(faceDataQueue);
    setTimeout(function () {
        console.log("width  height", document.body.clientWidth, document.body.clientHeight);
    }, 1000);
    var lasttime = +new Date;
    window.addEventListener("message", function (event) {
        // For Chrome, the origin property is in the event.originalEvent
        // object.
        // 这里不准确，chrome没有这个属性
        // var origin = event.origin || event.originalEvent.origin;
        var origin = event.origin;
        // console.log("screen size:::", c.clientWidth, c.clientHeight)
        // console.log("event FROM RN::::", typeof(event.data),  event.data)
        // ctx.clearRect(0, 0, c.width, c.height)
        var faceData = event.data;
        faceDataQueue.enqueue(faceData);
        game.setMouthPos(faceData);
        console.log("time", (+new Date) - lasttime);
        lasttime = +new Date;
        if (window["ReactNativeWebView"]) {
            window["ReactNativeWebView"].postMessage("Hello! From JS");
        }
    }, false);

}(PIXI, TWEEN));
//# sourceMappingURL=index.js.map
