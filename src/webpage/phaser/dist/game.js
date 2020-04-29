(function (VConsole) {
    'use strict';

    var global = window;

    VConsole = VConsole && VConsole.hasOwnProperty('default') ? VConsole['default'] : VConsole;

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

    var Point = Phaser.Geom.Point;
    var Rectagle = Phaser.Geom.Rectangle;
    var stageWidth = document.body.clientWidth;
    var stageHeight = document.body.clientHeight;
    var Mouth = /** @class */ (function () {
        // private mouthColor: Graphics;
        function Mouth(scene) {
            this.mouthRect = new Rectagle(0, 0, 0, 0);
            this.mouthContour = scene.add.graphics();
            this.mouthStateText = scene.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
        }
        Mouth.prototype.setMouthContourPoints = function (upperTop, upperBottom, lowerTop, lowerBottom) {
            this.upperTopPoints = upperTop;
            this.upperBottomPoints = upperBottom;
            this.lowerTopPoints = lowerTop;
            this.lowerBottomPoints = lowerBottom;
            this.mouthAllPoints = __spreadArrays(upperTop, upperBottom, lowerTop, lowerBottom);
            this.calcMouthRect();
            this.drawContour();
        };
        Mouth.prototype.calcMouthRect = function () {
            var mouthPoints = this.mouthAllPoints;
            var xVals = mouthPoints.map(function (p) {
                return p.x;
            });
            var yVals = mouthPoints.map(function (p) {
                return p.y;
            });
            var minX = Math.min.apply(Math, xVals);
            var maxX = Math.max.apply(Math, xVals);
            var minY = Math.min.apply(Math, yVals);
            var maxY = Math.max.apply(Math, yVals);
            this.mouthRect.setPosition(minX, minY);
            this.mouthRect.setSize(maxX - minX, maxY - minY);
        };
        Mouth.prototype.drawContour = function () {
            var mouthPoints = this.mouthAllPoints;
            this.mouthContour.clear();
            this.mouthContour.lineStyle(5, 0xFF00FF, 1.0);
            this.mouthContour.beginPath();
            var idx = 0;
            for (var _i = 0, mouthPoints_1 = mouthPoints; _i < mouthPoints_1.length; _i++) {
                var p = mouthPoints_1[_i];
                if (idx == 0) {
                    this.mouthContour.moveTo(p.x, p.y);
                }
                else {
                    this.mouthContour.lineTo(p.x, p.y);
                }
                idx++;
            }
            this.mouthContour.closePath();
            this.mouthContour.strokePath();
        };
        Mouth.prototype.checkIfMouthClose = function () {
            return false;
        };
        // 得到嘴巴中心点 用于确定动画结束的位置
        Mouth.prototype.getMouthCenter = function () {
            var mouthCenterX = this.mouthRect.x + this.mouthRect.width / 2;
            var mouthCenterY = this.mouthRect.y + this.mouthRect.width / 2;
            return new Point(mouthCenterX, mouthCenterY);
        };
        return Mouth;
    }());

    var Point$1 = Phaser.Geom.Point;
    var stageWidth$1 = document.body.clientWidth;
    var stageHeight$1 = document.body.clientHeight;
    var angle2Rad = function (angle) {
        return (Math.PI / 180) * angle;
    };
    var Demo = /** @class */ (function (_super) {
        __extends(Demo, _super);
        //text
        // public mouthStateText: PhaserText;
        function Demo() {
            var _this = _super.call(this, 'demo') || this;
            _this.spSpinSpeed = 1;
            _this.distanceAngle = 60; //食物和食物之间的间隔(角度)
            _this.tableCapacity = 360 / _this.distanceAngle; //根据间隔计算得到的桌面容量
            _this.foodList = __spreadArrays(Array(_this.tableCapacity)).map(function (_) { return null; });
            // 旋转圆心
            _this.circleRadius = stageWidth$1;
            _this.circleCenter = new Point$1(stageWidth$1 / 2, stageHeight$1 + _this.circleRadius / 2.3);
            _this.frameCounter = 0;
            _this.addCounter = 0;
            _this.previewWidth = 198;
            _this.previewHeight = 352;
            _this.previewOffsetX = 170;
            _this.previewOffsetY = 250;
            return _this;
        }
        Demo.prototype.preload = function () {
            // yarn run dev 的时候 这个资源也还是从 dist 中读取的
            this.load.image('bgImg', 'assets/kitchen.png');
            this.load.image('pinWheel', 'assets/pinWheel.png');
            this.load.image('light', 'assets/light.png');
            this.load.image('food0', 'assets/burger.png');
            this.load.image('food1', 'assets/burrito.png');
            this.load.image('food2', 'assets/cheese-burger.png');
            this.load.image('food3', 'assets/chicken-leg.png');
            this.load.image('food4', 'assets/french-fries.png');
            this.load.image('food5', 'assets/donut.png');
            this.load.image('dogFront', 'assets/front.png');
            this.load.image('dogBack', 'assets/back.png');
            this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
            this.load.glsl('stars', 'assets/starfields.glsl.js');
        };
        Demo.prototype.create = function () {
            this.bg = this.add.graphics();
            // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);
            // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);
            // this.tweens.add({
            //     targets: logo,
            //     y: 350,
            //     duration: 1500,
            //     ease: 'Sine.inOut',
            //     yoyo: true,
            //     repeat: -1
            // })
            this.drawBackground();
            this.drawWheel();
            // this.light = this.add.image(0, 0, 'light');
            // this.point = new Phaser.Geom.Point(this.light.x, this.light.y)
            // Phaser会根据 add 的先后顺序决定层级.
            this.mouthObj = new Mouth(this);
            this.refreshMouth([], [], [], []);
            this.messageListener();
            this.addText();
        };
        Demo.prototype.update = function (time, delta) {
            this.rotateTable();
            this.movingFoodOnTable();
            this.checkIfCouldEat();
            // Phaser.Geom.Circle.CircumferencePoint(this.circle, this.spSpin.rotation,  this.point);
            // this.light.x = this.point.x
            // this.light.y = this.point.y
            this.frameCounter += 1;
            if (this.frameCounter >= 60) {
                this.frameCounter = 0;
                this.update60Frame();
            }
        };
        Demo.prototype.update60Frame = function () {
        };
        Demo.prototype.rotateTable = function () {
            // 右手顺时针
            this.spSpin.angle += this.spSpinSpeed;
            // rotate 是使用的弧度
            this.addFoodIfNeed();
        };
        Demo.prototype.addFoodIfNeed = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                // i = 0 angle 0
                // i = 1 angle 60
                // 盘子是空的, 且恰好转到合适的位置. 就添加食物
                if (!this.foodList[i]) {
                    //
                    //               +
                    //               |
                    //               |
                    //               |
                    //   -90 ~ -180  |    0 ~ -90
                    //               |
                    //               |
                    //               |
                    //               |
                    // +-----------------------------+
                    //               |
                    //               |
                    //               |
                    //     90 - 180  |     0 - 90
                    //               |
                    //               |
                    //               |
                    //               |
                    //               +
                    // 由于phaser 的坐标不是连续的, 因此为了按照顺时针旋转一周得到 360 的角度, 需要做下面的处理
                    var mathAngle = this.spSpin.angle < 0 ? 360 + this.spSpin.angle : this.spSpin.angle;
                    // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                    if (Math.abs(mathAngle - i * this.distanceAngle) < 2) {
                        var foodTextureKey = "food" + i;
                        var food = this.add.image(0, 0, foodTextureKey);
                        food.name = "Food" + i;
                        food.setScale(2, 2);
                        this.foodList[i] = food;
                        console.log("angle add", this.spSpin.angle, mathAngle, food.name);
                        // this.foodList.push(food)
                    }
                }
            }
        };
        Demo.prototype.movingFoodOnTable = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (!food) {
                    continue;
                }
                var point = new Phaser.Geom.Point(0, 0);
                // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
                var angle = this.spSpin.angle + this.distanceAngle * (this.tableCapacity - i);
                // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
                // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
                Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
                food.x = point.x;
                food.y = point.y;
            }
        };
        Demo.prototype.refreshMouth = function (upperTop, upperBottom, lowerTop, lowerBottom) {
            this.mouthObj.setMouthContourPoints(upperTop, upperBottom, lowerTop, lowerBottom);
            // if (!this.mouthContour) {
            //     this.mouthContour = this.add.graphics()
            // }
            // this.mouthContourPoints = points
            // let mouthPoints = points;
            // let xVals = mouthPoints.map(p => {
            //     return p.x
            // })
            // let yVals = mouthPoints.map(p => {
            //     return p.y
            // })
            // let minX = Math.min(...xVals)
            // let maxX = Math.max(...xVals)
            // let minY = Math.min(...yVals)
            // let maxY = Math.max(...yVals)
            // this.mouthContour.clear()
            // this.mouthContour.lineStyle(5, 0xFF00FF, 1.0);
            // this.mouthContour.beginPath();
            // let idx = 0
            // for (let p of mouthPoints) {
            //     if (idx == 0) {
            //         this. mouthContour.moveTo(p.x, p.y);
            //     }else {
            //         this.mouthContour.lineTo(p.x, p.y);
            //     }
            //     idx++
            // }
            // this.mouthContour.closePath();
            // this.mouthContour.strokePath();
            // this.mouthRect.setPosition(minX, minY);
            // this.mouthRect.setSize(maxX - minX, maxY - minY)
            // if (!this.mouthColor) {
            //     this.mouthColor = this.add.graphics({ fillStyle: { color: 0x0000ff } });
            // }
            // this.mouthColor.clear()
            // this.mouthColor.fillStyle(0x0000ff)
            // this.mouthColor.fillRectShape(this.mouth)
        };
        Demo.prototype.messageListener = function () {
            var _this = this;
            window.addEventListener("message", function (event) {
                var of = event.data;
                var mouthPoints = __spreadArrays(of.upperLipBottom, of.lowerLipTop);
                var newPoints = _this.offsetPoints(stageWidth$1, stageHeight$1, mouthPoints);
                _this.refreshMouth(of.upperLipTop, of.upperLipBottom, of.lowerLipTop, of.lowerLipBottom);
            }, false);
        };
        Demo.prototype.offsetPoints = function (webviewWidth, webviewHeight, mouthPoints) {
            var _this = this;
            var scaleX = webviewWidth / this.previewWidth;
            var scaleY = webviewHeight / this.previewHeight;
            var newPoints = mouthPoints.map(function (p) {
                return new Point$1(p.x + _this.previewOffsetX, p.y + _this.previewOffsetY);
            });
            return newPoints;
        };
        Demo.prototype.checkIfCouldEat = function () {
            if (this.mouthObj.checkIfMouthClose()) {
                return;
            }
            var destPos = this.mouthObj.getMouthCenter();
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (!food) {
                    continue;
                }
                if (food.eating) {
                    continue;
                }
                var foodx = food.x;
                var foody = food.y;
                // 重新修改判定条件
                // 当food 在摄像头范围内就可以吃
                if ((this.previewOffsetX < food.x && food.x < this.previewOffsetX + this.previewWidth)
                    &&
                        (this.previewOffsetY < food.y && food.y < this.previewOffsetY + this.previewHeight)
                    &&
                        !food.eating) {
                    // this.foodList.splice(i--, 1)
                    this.foodList[i] = null;
                    this.eatingAnimation(food, destPos);
                    break;
                }
            }
        };
        Demo.prototype.eatingAnimation = function (food, dest) {
            food.eating = true;
            var tween = this.tweens.add({
                targets: food,
                x: dest.x,
                y: dest.y,
                scale: 0,
                duration: 400,
                ease: 'Power3',
                onComplete: function () {
                    food.destroy();
                }
            });
        };
        Demo.prototype.drawHollowBackground = function () {
            var faceCenter = new Point$1(300, 450);
            var faceRadius = 200;
            this.bg.beginPath();
            this.bg.moveTo(0, 0);
            this.bg.lineTo(stageWidth$1, 0);
            this.bg.lineTo(stageWidth$1, faceCenter.y);
            this.bg.lineTo(faceCenter.x + faceRadius, faceCenter.y);
            this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, true);
            this.bg.lineTo(0, faceCenter.y);
            this.bg.lineTo(0, 0);
            this.bg.fillStyle(0xffeeff);
            this.bg.fill();
            this.bg.moveTo(stageWidth$1, stageHeight$1);
            this.bg.lineTo(stageWidth$1, faceCenter.y);
            this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, false);
            this.bg.lineTo(0, faceCenter.y);
            this.bg.lineTo(0, stageHeight$1);
            this.bg.lineTo(stageWidth$1, stageHeight$1);
            this.bg.fillStyle(0xffeeff);
            this.bg.fill();
        };
        Demo.prototype.drawBackground = function () {
            this.bgImg = this.add.image(0, 0, 'bgImg');
            var bd = this.bgImg.getBounds();
            this.bgImg.setPosition(0, 0);
            // Phaser 中 Image 的默认 pivot 就是图片的中心点
            this.bgImg.x = stageWidth$1 / 2;
            this.bgImg.y = stageHeight$1 / 2;
            this.bgImg.setScale(stageWidth$1 / bd.width, stageHeight$1 / bd.height);
            this.bgImg.alpha = 0.5;
        };
        Demo.prototype.drawWheel = function () {
            this.spSpin = this.add.sprite(this.circleCenter.x, this.circleCenter.y, 'pinWheel');
            this.spSpin.alpha = 0.5;
            var bds = this.spSpin.getBounds();
            var width = bds.width;
            this.spSpin.setScale(this.circleRadius / (width / 2), this.circleRadius / (width / 2));
            this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);
        };
        Demo.prototype.addText = function () {
            // this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
        };
        return Demo;
    }(Phaser.Scene));

    // 测试嘴巴位置
    function changeMouth(game) {
        //contours sample data
        window.addEventListener("load", function () {
            var movingDown = function (points) {
                for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                    var p = points_1[_i];
                    p.y = p.y += 1;
                }
            };
            fetch('/assets/sampleContours.json').then(function (resp) {
                return resp.json();
            }).then(function (data) {
                new VConsole();
                // 在PC上调试
                if (window.navigator.userAgent.indexOf("ONEPLUS") == -1) {
                    var oneFace_1 = data[0];
                    setInterval(function () {
                        movingDown(oneFace_1.lowerLipBottom);
                        movingDown(oneFace_1.lowerLipTop);
                        movingDown(oneFace_1.upperLipBottom);
                        movingDown(oneFace_1.upperLipTop);
                        window.postMessage(oneFace_1, "*");
                    }, 100);
                }
            });
        }, false);
        // let points = [{x:100, y:500}, {x:200, y:600}, {x:100, y:600}, {x:200, y:600}]
    }
    //# sourceMappingURL=test.js.map

    console.log(Phaser.AUTO);
    console.log(Phaser.AUTO);
    console.log('.................');
    var stageWidth$2 = document.body.clientWidth;
    var stageHeight$2 = document.body.clientHeight;
    var config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: stageWidth$2,
        height: stageHeight$2,
        scene: Demo,
        transparent: true,
        physics: {
            "default": 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
    };
    console.log("...............");
    var game = new Phaser.Game(config);
    changeMouth();
    //# sourceMappingURL=index.js.map

}(VConsole));
//# sourceMappingURL=game.js.map
