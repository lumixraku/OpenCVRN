(function () {
  'use strict';

  var global = window;

  var MSG_TYPE_FACE = 'face';
  var MSG_TYPE_CAM = 'cam'; // RN  告知 WEB 取景器的位置
  var MSG_TYPE_WEBVIEW_READY = 'webview_ready'; // WEB 告知 RN OnMessage 事件已经准备好 RN可以post 消息了
  var MSG_TYPE_FACE_TARGET_POS = 'face_target'; // WEB 告知 RN 人脸应该固定的位置
  var DOGCOOK = 'dogcook';
  var CHECKING_INTERVAL = 2000; // 回头检测的最短间隔
  var GAME_SCENE = 'game';
  var UI_SCENE = 'uiScene';
  //# sourceMappingURL=constants.js.map

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
          this.mouthStateText = scene.add.text(stageWidth - 100, -100, 'Hello World', { fontFamily: '"Roboto Condensed"' });
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
          // return false
          var isClose = false;
          if (this.mouthRect.height < 30 && this.mouthRect.height / this.mouthRect.width < 0.5) {
              isClose = true;
          }
          this.mouthStateText.text = "" + this.mouthRect.height; //isClose ? "close" : "open"
          return isClose;
      };
      // 得到嘴巴中心点 用于确定动画结束的位置
      Mouth.prototype.getMouthCenter = function () {
          var mouthCenterX = this.mouthRect.x + this.mouthRect.width / 2;
          var mouthCenterY = this.mouthRect.y + this.mouthRect.width / 2;
          return new Point(mouthCenterX, mouthCenterY);
      };
      return Mouth;
  }());
  //# sourceMappingURL=mouth.js.map

  var Point$1 = Phaser.Geom.Point;
  var stageWidth$1 = document.body.clientWidth;
  var stageHeight$1 = document.body.clientHeight;
  var angle2Rad = function (angle) {
      return (Math.PI / 180) * angle;
  };
  var SpinTable = /** @class */ (function () {
      function SpinTable(pos, radius, spinSpeed) {
          this.spSpinSpeed = 1;
          this.circleRadius = stageWidth$1;
          this.circleCenter = new Point$1(stageWidth$1 / 2, stageHeight$1 + this.circleRadius / 2.3);
          this.distanceAngle = 60; //食物和食物之间的间隔(角度)
          this.tableCapacity = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量
          this.circleCenter = pos;
          this.circleRadius = radius;
          this.spSpinSpeed = spinSpeed;
      }
      SpinTable.prototype.addToContainer = function (scene) {
          this.spSpin = scene.add.sprite(this.circleCenter.x, this.circleCenter.y, 'pinWheel');
          // if (isPC) {
          this.spSpin.alpha = 0.5;
          // }
          var bds = this.spSpin.getBounds();
          var width = bds.width;
          this.spSpin.setScale(this.circleRadius / (width / 2), this.circleRadius / (width / 2));
          this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);
      };
      SpinTable.prototype.setTableCapacity = function (tableCapacity) {
          this.tableCapacity = tableCapacity;
          this.distanceAngle = 360 / tableCapacity;
      };
      SpinTable.prototype.rotateTableSlightly = function () {
          // 角度从x轴正方向开始算  顺时针旋转
          // rotate 是使用的弧度
          // angle 是角度
          this.spSpin.angle += this.spSpinSpeed;
      };
      SpinTable.prototype.getAngle = function () {
          return this.spSpin.angle;
      };
      // 计算第 i 个食物的在当前桌面上的角度
      // 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
      // i starts from 0
      SpinTable.prototype.calcFoodIAngle = function (i) {
          var rawAngle = this.getAngle();
          var angle = rawAngle + this.distanceAngle * (this.tableCapacity - i);
          return angle;
          // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
          // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
      };
      SpinTable.prototype.calcAngleToPoint = function (angle) {
          var point = new Phaser.Geom.Point(0, 0);
          Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
          return point;
      };
      return SpinTable;
  }());
  //# sourceMappingURL=spinTable.js.map

  var Point$2 = Phaser.Geom.Point;
  var Vector2 = Phaser.Math.Vector2;
  var Rectagle$1 = Phaser.Geom.Rectangle;
  var stageWidth$2 = document.body.clientWidth;
  var stageHeight$2 = document.body.clientHeight;
  var CamFaceCheck = /** @class */ (function () {
      function CamFaceCheck(scene) {
          this.scene = scene;
          this.faceRect = scene.add.graphics();
          this.previewRect = scene.add.graphics();
          this.facePosText = scene.add.text(stageWidth$2 - 100, 250, 'Hello World', { fontFamily: '"Roboto Condensed"' });
      }
      CamFaceCheck.prototype.refreshFacePosition = function (faceBounds, facePoints) {
          this.faceBounds = faceBounds;
      };
      // check if face is in the center of preview
      // private 
      CamFaceCheck.prototype.checkFacePosition = function (faceBounds) {
          var rs = {
              pass: false,
              bounds: null
          };
          if (!this.camPreviewArea) {
              return rs;
          }
          if (faceBounds) {
              var minFaceX = faceBounds.origin.x;
              var maxFaceX = faceBounds.origin.x + faceBounds.size.width;
              var minFaceY = faceBounds.origin.y;
              var maxFaceY = faceBounds.origin.y + faceBounds.size.height;
              this.drawFaceBounds(faceBounds);
              // this.drawPreviewBounds(this.camPreviewArea)
              var minPreviewX = this.camPreviewArea.x;
              var maxPreviewX = this.camPreviewArea.x + this.camPreviewArea.width;
              var minPreviewY = this.camPreviewArea.y;
              var maxPreviewY = this.camPreviewArea.y + this.camPreviewArea.height;
              var paddingLeft = minFaceX - minPreviewX;
              var paddingRight = maxPreviewX - maxFaceX;
              // this.facePosText.text = `${paddingLeft.toFixed(2)} --- ${paddingRight.toFixed(2)}`
              if (paddingLeft / paddingRight > 2) {
                  this.facePosText.text = 'to right slightly';
              }
              else if (paddingRight / paddingLeft > 2) {
                  this.facePosText.text = 'to left slightly';
              }
              else {
                  this.facePosText.text = 'Hold your phone!';
                  return {
                      pass: true,
                      bounds: faceBounds
                  };
              }
          }
          return rs;
      };
      CamFaceCheck.prototype.drawPreviewBounds = function (previewCamArea) {
          if (!previewCamArea) {
              return;
          }
          this.previewRect.clear();
          this.previewRect.lineStyle(5, 0x00FFFF, 1.0);
          this.previewRect.beginPath();
          var minPreviewX = previewCamArea.x;
          var maxPreviewX = previewCamArea.x + previewCamArea.width;
          var minPreviewY = previewCamArea.y;
          var maxPreviewY = previewCamArea.y + previewCamArea.height;
          var points = [
              new Point$2(minPreviewX, minPreviewY), new Point$2(maxPreviewX, minPreviewY),
              new Point$2(maxPreviewX, maxPreviewY), new Point$2(minPreviewX, maxPreviewY)
          ];
          var idx = 0;
          for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
              var p = points_1[_i];
              if (idx == 0) {
                  this.previewRect.moveTo(p.x, p.y);
              }
              else {
                  this.previewRect.lineTo(p.x, p.y);
              }
              idx++;
          }
          this.previewRect.closePath();
          this.previewRect.strokePath();
      };
      CamFaceCheck.prototype.drawFaceBounds = function (faceBounds) {
          this.faceRect.clear();
          this.faceRect.lineStyle(5, 0xFF00FF, 1.0);
          this.faceRect.beginPath();
          var minFaceX = faceBounds.origin.x;
          var maxFaceX = faceBounds.origin.x + faceBounds.size.width;
          var minFaceY = faceBounds.origin.y;
          var maxFaceY = faceBounds.origin.y + faceBounds.size.height;
          var points = [
              new Point$2(minFaceX, minFaceY), new Point$2(maxFaceX, minFaceY),
              new Point$2(maxFaceX, maxFaceY), new Point$2(minFaceX, maxFaceY)
          ];
          var idx = 0;
          for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
              var p = points_2[_i];
              if (idx == 0) {
                  this.faceRect.moveTo(p.x, p.y);
              }
              else {
                  this.faceRect.lineTo(p.x, p.y);
              }
              idx++;
          }
          this.faceRect.closePath();
          this.faceRect.strokePath();
      };
      CamFaceCheck.prototype.setCameraArea = function (camPreviewArea) {
          this.camPreviewArea = camPreviewArea;
          if (!this.firstSetCamPreviewArea) {
              this.firstSetCamPreviewArea = new Rectagle$1(0, 0, 0, 0);
              this.firstSetCamPreviewArea.x = this.camPreviewArea.x;
              this.firstSetCamPreviewArea.y = this.camPreviewArea.y;
              this.firstSetCamPreviewArea.width = this.camPreviewArea.width;
              this.firstSetCamPreviewArea.height = this.camPreviewArea.height;
          }
      };
      CamFaceCheck.prototype.setTargetFaceBounds = function (facebds) {
          if (this.targetFaceBounds == null) {
              this.targetFaceBounds = facebds;
              var centerX = facebds.origin.x + facebds.size.width;
              var centerY = facebds.origin.y + facebds.size.height;
              var distanceX = this.camPreviewArea.x - centerX;
              var distanceY = this.camPreviewArea.y - centerY;
              this.faceCenterPos = new Vector2(centerX, centerY);
              // 同时告知 RN?  //脸的位置确定了
              if (window["ReactNativeWebView"]) {
                  var msg = {
                      messageType: MSG_TYPE_FACE_TARGET_POS,
                      actualData: {
                          bounds: facebds,
                      },
                      time: +new Date
                  };
                  window["ReactNativeWebView"].postMessage(JSON.stringify(msg));
              }
          }
      };
      CamFaceCheck.prototype.getTargetFaceBounds = function () {
          return this.faceBounds;
      };
      CamFaceCheck.prototype.updatePreviewPosByTarget = function () {
          var faceCenterPos = this.faceCenterPos;
          var firstCamPreviewArea = this.firstSetCamPreviewArea;
          if (!firstCamPreviewArea) {
              return;
          }
          if (!faceCenterPos) {
              return;
          }
          var originCamArea = this.firstSetCamPreviewArea;
          var faceBounds = this.faceBounds;
          var centerX = faceBounds.origin.x + faceBounds.size.width;
          var centerY = faceBounds.origin.y + faceBounds.size.height;
          var distanceX = this.camPreviewArea.x - centerX;
          var distanceY = this.camPreviewArea.y - centerY;
          var offset = new Point$2(faceCenterPos.x - centerX, faceCenterPos.y - centerY);
          this.camPreviewArea.x = originCamArea.x + offset.x;
          this.camPreviewArea.y = originCamArea.y + offset.y;
          this.drawPreviewBounds(this.camPreviewArea);
      };
      return CamFaceCheck;
  }());
  //# sourceMappingURL=facePosCheck.js.map

  var Image = Phaser.GameObjects.Image;
  var Cook = /** @class */ (function (_super) {
      __extends(Cook, _super);
      function Cook(scene, x, y) {
          var _this = _super.call(this, scene, x, y, DOGCOOK, 0) || this;
          _this.cooking = true;
          // scene.add.image(0, 0, 'dog', 0)
          // let img = new Image(scene,x,y,texture);
          // scene.children.add(this);
          scene.add.existing(_this);
          return _this;
      }
      Cook.prototype.setOriginToTopLeft = function () {
          this.setOrigin(0, 0);
      };
      Cook.prototype.lookBack = function () {
          this.setTexture('doglook', 0);
          this.checking = true;
          this.cooking = false;
          this.startCheckingTime = +new Date;
      };
      Cook.prototype.cookAgain = function () {
          this.setTexture('dogcook', 0);
          this.checking = false;
          this.cooking = true;
          this.endCheckingTime = +new Date;
          console.log("looking back", this.endCheckingTime - this.startCheckingTime);
      };
      Cook.prototype.isCooking = function () {
          return this.cooking;
      };
      //是否刚刚回头过
      Cook.prototype.ifJustChecked = function () {
          var timeGap = +new Date - this.endCheckingTime;
          return (timeGap < CHECKING_INTERVAL);
      };
      return Cook;
  }(Image));
  //# sourceMappingURL=cook.js.map

  var Point$3 = Phaser.Geom.Point;
  var Rectagle$2 = Phaser.Geom.Rectangle;
  var stageWidth$3 = document.body.clientWidth;
  var stageHeight$3 = document.body.clientHeight;
  var Demo = /** @class */ (function (_super) {
      __extends(Demo, _super);
      function Demo() {
          var _this = _super.call(this, GAME_SCENE) || this;
          _this.spSpinSpeed = 1;
          _this.circleRadius = stageWidth$3;
          _this.circleCenter = new Point$3(stageWidth$3 / 2, stageHeight$3 + _this.circleRadius / 2.3);
          _this.distanceAngle = 60; //食物和食物之间的间隔(角度)
          _this.tableCapacity = 360 / _this.distanceAngle; //根据间隔计算得到的桌面容量
          _this.foodList = __spreadArrays(Array(_this.tableCapacity)).map(function (_) { return null; });
          // preview 取景器
          _this.previewArea = new Rectagle$2(0, 0, 0, 0);
          _this.frameCounter = 0;
          _this.addCounter = 0;
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
          this.load.image('doglook', 'assets/front.png');
          this.load.image('dogcook', 'assets/back.png');
          this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
          this.load.glsl('stars', 'assets/starfields.glsl.js');
      };
      Demo.prototype.create = function () {
          this.bg = this.add.graphics();
          this.drawBackground();
          this.addCook();
          this.addFace();
          this.drawWheel();
          // Phaser会根据 add 的先后顺序决定层级.
          this.mouthObj = new Mouth(this);
          this.refreshMouth([], [], [], []);
          this.messageListener();
          this.addText();
          this.scene.launch(UI_SCENE);
          // this.uiManager = new UIManager()
      };
      Demo.prototype.update = function (time, delta) {
          this.rotateTable();
          this.addFoodIfNeed();
          this.movingFoodOnTable();
          this.checkIfCouldEat();
          this.frameCounter += 1;
          if (this.frameCounter >= 60) {
              this.frameCounter = 0;
              this.update60Frame();
          }
      };
      Demo.prototype.update60Frame = function () {
          var _this = this;
          var shouldLookBack = Math.random();
          if (this.cook) {
              var isDogCooking = this.cook.isCooking();
              var isJustChecked = this.cook.ifJustChecked();
              if (!isJustChecked && isDogCooking && shouldLookBack < 0.9) {
                  this.cook.lookBack();
                  setTimeout(function () {
                      _this.cook.cookAgain();
                  }, 1000);
              }
          }
      };
      Demo.prototype.rotateTable = function () {
          // 右手顺时针
          // this.spSpin.angle += this.spSpinSpeed;
          this.spinTable.rotateTableSlightly();
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
                  var rawAngle = this.spinTable.getAngle();
                  var mathAngle = rawAngle < 0 ? 360 + rawAngle : rawAngle;
                  // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
                  // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                  if (Math.abs(mathAngle - i * this.distanceAngle) < 2) {
                      var foodTextureKey = "food" + i;
                      var food = this.add.image(0, 0, foodTextureKey);
                      food.name = "Food" + i;
                      food.setScale(2, 2);
                      this.foodList[i] = food;
                      // console.log("angle add", rawAngle, mathAngle, food.name)
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
              // let rawAngle = this.spinTable.getAngle()
              // let angle = rawAngle + this.distanceAngle * (this.tableCapacity  - i)
              // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
              // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
              var foodAngle = this.spinTable.calcFoodIAngle(i); //当前食物在桌上的角度
              var point = this.spinTable.calcAngleToPoint(foodAngle);
              // Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle) , point);
              food.x = point.x;
              food.y = point.y;
          }
      };
      Demo.prototype.refreshMouth = function (upperTop, upperBottom, lowerTop, lowerBottom) {
          this.mouthObj.setMouthContourPoints(upperTop, upperBottom, lowerTop, lowerBottom);
      };
      Demo.prototype.messageListener = function () {
          var _this = this;
          window.addEventListener("message", function (event) {
              switch (event.data.messageType) {
                  case MSG_TYPE_FACE:
                      // 不论取景器是否有偏移  这里得到的坐标就是相对于 webview 左上角而言的
                      // offset 的处理已经在 RN 的部分完成
                      var of = event.data.faceData;
                      _this.refreshMouth(of.upperLipTop, of.upperLipBottom, of.lowerLipTop, of.lowerLipBottom);
                      _this.refreshFaceBounds(of.bounds, of.face);
                      break;
                  case MSG_TYPE_CAM:
                      setTimeout(function () {
                          console.log("MSG_TYPE_CAM");
                      }, 1000);
                      var previewArea = event.data.previewArea;
                      _this.previewArea = previewArea;
                      _this.camFaceCheck.setCameraArea(previewArea);
              }
          }, false);
          // 告知 RN webview 事件绑定上了
          if (window["ReactNativeWebView"]) {
              var msg = {
                  messageType: MSG_TYPE_WEBVIEW_READY,
                  event: "bindMessage",
                  time: +new Date
              };
              window["ReactNativeWebView"].postMessage(JSON.stringify(msg));
          }
      };
      // 所有的 offset 都移动到了 RN 的部分处理
      // offsetPoints(webviewWidth: number,  webviewHeight, mouthPoints: Point[]) {
      //     let scaleX = webviewWidth / this.previewWidth;
      //     let scaleY = webviewHeight / this.previewHeight;
      //     let newPoints = mouthPoints.map( p => {
      //         return new Point(p.x + this.previewOffsetX, p.y + this.previewOffsetY )
      //     })
      //     return newPoints
      // }
      Demo.prototype.checkIfCouldEat = function () {
          if (this.mouthObj.checkIfMouthClose()) {
              return;
          }
          if (this.previewArea.x == 0) {
              console.warn("offsetXPreview is still zero");
              return;
          }
          var offsetXPreview = this.previewArea.x;
          var offsetYPreview = this.previewArea.y;
          var previewWidth = this.previewArea.width;
          var previewHeight = this.previewArea.height;
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
              if ((offsetXPreview < food.x && food.x < offsetXPreview + previewWidth)
                  &&
                      (offsetYPreview < food.y && food.y < offsetYPreview + previewHeight * 1.2)
                  &&
                      !food.eating) {
                  // this.foodList.splice(i--, 1)
                  this.foodList[i] = null;
                  this.eatingAnimation(food, destPos);
                  this.countEatScore();
                  break;
              }
              // 来到了取景器右边 // 表示miss
              if (food.x > offsetXPreview + previewWidth && food.y < offsetYPreview + previewHeight * 1.2) {
                  console.log('miss');
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
      Demo.prototype.countEatScore = function () {
          var _this = this;
          if (!this.cook.isCooking()) {
              this.showCaughtToast('You get caught!!!!', 1000, function () {
                  // this.scoreText.text = +(this.scoreText.text) + 1 + ''
              });
          }
          else {
              this.showScoreToast('+1', 400, function () {
                  _this.scoreText.text = +(_this.scoreText.text) + 1 + '';
              });
          }
      };
      Demo.prototype.missAnimation = function () {
      };
      Demo.prototype.drawHollowBackground = function () {
          var faceCenter = new Point$3(300, 450);
          var faceRadius = 200;
          this.bg.beginPath();
          this.bg.moveTo(0, 0);
          this.bg.lineTo(stageWidth$3, 0);
          this.bg.lineTo(stageWidth$3, faceCenter.y);
          this.bg.lineTo(faceCenter.x + faceRadius, faceCenter.y);
          this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, true);
          this.bg.lineTo(0, faceCenter.y);
          this.bg.lineTo(0, 0);
          this.bg.fillStyle(0xffeeff);
          this.bg.fill();
          this.bg.moveTo(stageWidth$3, stageHeight$3);
          this.bg.lineTo(stageWidth$3, faceCenter.y);
          this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, false);
          this.bg.lineTo(0, faceCenter.y);
          this.bg.lineTo(0, stageHeight$3);
          this.bg.lineTo(stageWidth$3, stageHeight$3);
          this.bg.fillStyle(0xffeeff);
          this.bg.fill();
      };
      Demo.prototype.drawBackground = function () {
          this.bgImg = this.add.image(0, 0, 'bgImg');
          var bd = this.bgImg.getBounds();
          this.bgImg.setPosition(0, 0);
          // Phaser 中 Image 的默认 pivot 就是图片的中心点
          this.bgImg.x = stageWidth$3 / 2;
          this.bgImg.y = stageHeight$3 / 2;
          this.bgImg.setScale(stageWidth$3 / bd.width, stageHeight$3 / bd.height);
          // if (isPC) {
          this.bgImg.alpha = 0.5;
          // }
      };
      Demo.prototype.drawWheel = function () {
          this.spinTable = new SpinTable(this.circleCenter, this.circleRadius, this.spSpinSpeed);
          this.spinTable.addToContainer(this);
      };
      Demo.prototype.addFace = function () {
          this.camFaceCheck = new CamFaceCheck(this);
      };
      Demo.prototype.addText = function () {
          // this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
          // this.testText = this.add.text(170, 170, 'Hello World', { fontFamily: '"Roboto Condensed"' });
          this.scoreText = this.add.text(390, 50, '0', {
              fontFamily: '"Roboto Condensed"',
              color: 'red'
          });
      };
      Demo.prototype.refreshFaceBounds = function (bounds, facePoints) {
          this.camFaceCheck.refreshFacePosition(bounds, facePoints);
          this.camFaceCheck.updatePreviewPosByTarget();
          var rs = this.camFaceCheck.checkFacePosition(bounds);
          if (rs.pass) {
              this.camFaceCheck.setTargetFaceBounds(bounds);
          }
      };
      Demo.prototype.addCook = function () {
          this.cook = new Cook(this, 100, 400);
      };
      Demo.prototype.showScoreToast = function (text, delay, cb) {
          var _this = this;
          var toastText = this.add.text(0, 0, '', { fontFamily: '"Roboto Condensed"' });
          toastText.x = stageWidth$3 / 2;
          toastText.y = stageWidth$3 / 2;
          toastText.text = text;
          toastText.setFontSize(32);
          toastText.setColor('red');
          var dest = {
              x: 390, y: 50
          };
          setTimeout(function () {
              _this.tweens.add({
                  targets: toastText,
                  x: dest.x,
                  y: dest.y,
                  scale: 0,
                  duration: 1000,
                  ease: 'Power3',
                  onComplete: function () {
                      cb();
                      toastText.destroy();
                  }
              });
          }, delay);
      };
      Demo.prototype.showCaughtToast = function (text, delay, cb) {
          var _this = this;
          if (this.hasCaughtToast)
              return;
          var toastText = this.add.text(0, 0, '', { fontFamily: '"Roboto Condensed"' });
          this.hasCaughtToast = true;
          toastText.x = stageWidth$3 / 2;
          toastText.y = stageWidth$3 / 2;
          toastText.text = text;
          toastText.setFontSize(32);
          toastText.setColor('red');
          var dest = {
              x: -200, y: stageWidth$3 / 2
          };
          setTimeout(function () {
              _this.tweens.add({
                  targets: toastText,
                  x: dest.x,
                  y: dest.y,
                  duration: 400,
                  ease: 'Power3',
                  onComplete: function () {
                      cb();
                      toastText.destroy();
                      _this.hasCaughtToast = false;
                  }
              });
          }, delay);
      };
      return Demo;
  }(Phaser.Scene));
  //# sourceMappingURL=game.js.map

  var stageWidth$4 = document.body.clientWidth;
  var stageHeight$4 = document.body.clientHeight;
  var UIManagerScene = /** @class */ (function (_super) {
      __extends(UIManagerScene, _super);
      function UIManagerScene() {
          return _super.call(this, UI_SCENE) || this;
      }
      UIManagerScene.prototype.preload = function () {
          this.load.scenePlugin({
              key: 'rexuiplugin',
              url: '/rexuiplugin.min.js',
              sceneKey: 'rexUI'
          });
      };
      UIManagerScene.prototype.create = function () {
          this.holdsOn = this.createHoldsDialog(this, 300, 500);
          this.testView = this.createDemoDialog(this, 0, 0);
          this.testView.visible = false;
      };
      UIManagerScene.prototype.update = function (time, delta) {
      };
      UIManagerScene.prototype.createHoldsDialog = function (scene, width, height) {
          var x = stageWidth$4 / 2;
          var y = stageHeight$4 / 2;
          var content = "\nThe Fox went out on a chilly night\n\nThe Fox went out on a chilly night\n\nThe Fox went out on a chilly night\n";
          // 默认x y 是 Dialog 中心位置   也就是说 Pivot 默认是 center 
          var dialog = scene.rexUI.add.dialog({
              x: x,
              y: y,
              width: width,
              // height: height,
              // background 并不在意大小的
              background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xf57f17),
              title: scene.rexUI.add.label({
                  background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                  text: scene.add.text(0, 0, 'Notice', {
                      fontSize: '20px'
                  }),
                  space: {
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10
                  }
              }),
              content: scene.rexUI.add.label({
                  width: 40,
                  height: 240,
                  background: scene.rexUI.add.roundRectangle(0, 0, 100, 240, 20, 0xffffff),
                  text: scene.add.text(0, 0, content, {
                      fontSize: '12px',
                      color: 0x888888
                  }),
                  space: {
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10
                  }
              }),
              actions: [
                  this.createButton(this, 'OK', 0xf57f17),
              ],
              actionsAlign: 'center',
              space: {
                  title: 10,
                  action: 45,
                  content: 115,
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
              }
          });
          dialog
              .on('button.click', function (button, groupName, index, pointer, event) {
              // this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
              dialog.scaleDownDestroy(100);
          }, this)
              .on('button.over', function (button, groupName, index, pointer, event) {
              button.getElement('background').setStrokeStyle(1, 0xffffff);
          })
              .on('button.out', function (button, groupName, index, pointer, event) {
              button.getElement('background').setStrokeStyle();
          });
          dialog.layout(); //.pushIntoBounds()
          return dialog;
      };
      UIManagerScene.prototype.createDemoDialog = function (scene, x, y) {
          scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63);
          return scene.rexUI.add.dialog({
              x: x,
              y: y,
              background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),
              title: scene.rexUI.add.label({
                  background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                  text: scene.add.text(0, 0, 'Pick a color', {
                      fontSize: '20px'
                  }),
                  space: {
                      left: 15,
                      right: 15,
                      top: 10,
                      bottom: 10
                  }
              }),
              actions: [
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
                  scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
              ],
              actionsAlign: 'left',
              space: {
                  title: 10,
                  action: 5,
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
              }
          })
              .layout()
              .pushIntoBounds()
              //.drawBounds(this.add.graphics(), 0xff0000)
              .popUp(500);
      };
      UIManagerScene.prototype.createButton = function (scene, text, color, space) {
          return scene.rexUI.add.label({
              x: 0,
              y: 100,
              width: 40,
              height: 40,
              background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
              text: scene.add.text(0, 0, text, {
                  fontSize: '24px'
              }),
              space: space || {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10
              }
          });
      };
      return UIManagerScene;
  }(Phaser.Scene));
  //# sourceMappingURL=DialogManager.js.map

  var offsetXPreview = 170;
  var offsetYPreview = 250;
  var previewWidth = 198;
  var previewHeight = previewWidth * 16 / 9;
  var isPC = window.navigator.userAgent.indexOf("PCMozilla") != -1;
  // 给坐标加上取景器的偏移信息
  // 原本的坐标信息是人脸相对取景器的位置
  // 现在坐标信息变为相对整个画布的位置
  function addOffsetForFaceData(target) {
      var checkedType = function (target) {
          return Object.prototype.toString.call(target).slice(8, -1);
      };
      //判断拷贝的数据类型
      //初始化变量result 成为最终克隆的数据
      var result;
      var targetType = checkedType(target);
      if (targetType === 'Object') {
          result = {};
      }
      else if (targetType === 'Array') {
          result = [];
      }
      else {
          return target;
      }
      //遍历目标数据
      for (var _i = 0, _a = Object.entries(target); _i < _a.length; _i++) {
          var _b = _a[_i], key = _b[0], value = _b[1];
          //获取遍历数据结构的每一项值。
          // let value = target[key]
          //判断目标结构里的每一值是否存在对象/数组
          if (checkedType(value) === 'Object' ||
              checkedType(value) === 'Array') { //对象/数组里嵌套了对象/数组
              //继续遍历获取到value值
              result[key] = addOffsetForFaceData(value);
          }
          else { //获取到value值是基本的数据类型或者是函数。
              if (key == "x") {
                  result[key] = offsetXPreview + value;
              }
              else if (key == "y") {
                  result[key] = offsetYPreview + value;
              }
              else {
                  result[key] = value;
              }
          }
      }
      return result;
  }
  // set preview area
  function setPreview() {
      window.addEventListener("load", function () {
          setTimeout(function () {
              window.postMessage({
                  messageType: MSG_TYPE_CAM,
                  previewArea: {
                      y: offsetYPreview,
                      x: offsetXPreview,
                      width: previewWidth,
                      height: previewHeight
                  },
              }, "*");
          }, 300);
      }, false);
  }
  // 测试嘴巴位置
  function changeMouth(game) {
      //contours sample data
      window.addEventListener("load", function () {
          var offsetSpeed = 3;
          var movingFaceBounds = function (bounds, dir) {
              var offset = 0;
              // dir 0下 1左 2上 3右
              if (dir == 0 || dir == 2) {
                  offset = dir == 2 ? -offsetSpeed : offsetSpeed;
                  bounds.origin.y = bounds.origin.y + offset;
              }
              else {
                  offset = dir == 1 ? -offsetSpeed : offsetSpeed;
                  bounds.origin.x = bounds.origin.x + offset;
              }
          };
          var movingYPoints = function (points, dir) {
              // dir 0下 1左 2上 3右
              var offset = 0;
              if (dir == 2) {
                  offset = -offsetSpeed;
              }
              else {
                  offset = offsetSpeed;
              }
              for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                  var p = points_1[_i];
                  p.y = p.y + offset;
              }
          };
          var movingXPoints = function (points, dir) {
              var offset = 0;
              if (dir == 1) {
                  offset = -offsetSpeed;
              }
              else {
                  offset = offsetSpeed;
              }
              for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
                  var p = points_2[_i];
                  p.x = p.x + offset;
              }
          };
          var moveFace = function (oneFace, dir) {
              // dir 0下 1左 2上 3右
              if (dir == 0 || dir == 2) {
                  movingYPoints(oneFace.lowerLipBottom, dir);
                  movingYPoints(oneFace.lowerLipTop, dir);
                  movingYPoints(oneFace.upperLipBottom, dir);
                  movingYPoints(oneFace.upperLipTop, dir);
                  movingFaceBounds(oneFace.bounds, dir);
              }
              else {
                  movingXPoints(oneFace.lowerLipBottom, dir);
                  movingXPoints(oneFace.lowerLipTop, dir);
                  movingXPoints(oneFace.upperLipBottom, dir);
                  movingXPoints(oneFace.upperLipTop, dir);
                  movingFaceBounds(oneFace.bounds, dir);
              }
          };
          // 这个数据是和取景器大小有关的数据 
          // 当 RN 的部分设置了取景器大小的时候, 返回的脸的位置也根据 RN 这里的实际尺寸有所压缩
          // 但是和取景器的位移无关  毕竟安卓端也不知道取景器的相对位置
          fetch('/assets/sampleContours.json').then(function (resp) {
              return resp.json();
          }).then(function (data) {
              // 在PC上调试
              if (window.navigator.userAgent.indexOf("PCMozilla") != -1) {
                  var oneFace_1 = data[0];
                  var i_1 = 0;
                  var changeDir_1 = 0; // 0下 1上 2左 3右
                  setInterval(function () {
                      if (i_1++ == 2) {
                          i_1 = 0;
                          changeDir_1 = (++changeDir_1) % 4;
                      }
                      moveFace(oneFace_1, changeDir_1);
                      var afterOffsetForFaceData = addOffsetForFaceData(oneFace_1);
                      window.postMessage({
                          messageType: 'face',
                          faceData: afterOffsetForFaceData
                      }, "*");
                  }, 100);
              }
          });
      }, false);
      // let points = [{x:100, y:500}, {x:200, y:600}, {x:100, y:600}, {x:200, y:600}]
  }
  // 获取鼠标点击位置
  function testClickEvent(game) {
      game.scene.getScene(GAME_SCENE).input.on('pointerup', function (pointer) {
          var touchX = pointer.x;
          var touchY = pointer.y;
          // let x = game.input.mousePointer.x;
          // let y = game.input.mousePointer.y;
          console.log('clickXY', touchX, touchY);
          // ...
      });
  }
  //# sourceMappingURL=test.js.map

  console.log(Phaser.AUTO);
  console.log(Phaser.AUTO);
  // import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
  var stageWidth$5 = document.body.clientWidth;
  var stageHeight$5 = document.body.clientHeight;
  var config = {
      type: Phaser.AUTO,
      parent: 'phaser-example',
      width: stageWidth$5,
      height: stageHeight$5,
      scene: [Demo, UIManagerScene],
      transparent: true,
      physics: {
          "default": 'arcade',
          arcade: {
              gravity: { y: 300 },
              debug: false
          }
      },
  };
  var game = new Phaser.Game(config);
  console.log(game.scene.isSleeping(UI_SCENE));
  setTimeout(function () {
      changeMouth();
      setPreview();
      testClickEvent(game);
  }, 0);
  //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=game.js.map
