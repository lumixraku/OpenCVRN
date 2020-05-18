(function (phaser) {
  'use strict';

  var global = window;

  var stageWidth = document.body.clientWidth;
  var stageHeight = document.body.clientWidth / 9 * 16;
  // Message 类型
  var MSG_TYPE_FACE = 'face';
  var MSG_TYPE_CAM = 'cam'; // RN  告知 WEB 取景器的位置
  var MSG_TYPE_WEBVIEW_READY = 'webview_ready'; // WEB 告知 RN OnMessage 事件已经准备好 RN可以post 消息了
  // scene
  var BASE_SCENE = 'base';
  var GAME_SCENE = 'game';
  var GAMEUI_SCENE = 'gameUIScene';
  var EF_SCENE = 'effectScene';
  var SETTINGS_SCENE = 'settingsScene';
  var ASSETS_SCENE = 'assetsScene';
  var DOGCOOK = 'dogcook';
  var CHECKING_INTERVAL = 2000; // 回头检测的最短间隔
  var FIRST_CHECK_ELAPSE = 2; // 第一次检查的时  游戏已经进行的时间
  var DISTANCE_ANGLE = 40;
  // game UI
  var BACKGROUND = 'background';
  var SOUNDKEY = 'clickSound';
  var MUSICKEY = 'music';
  // animation
  var COOK_LOOKBACK_ANIMI = 'lookback';
  var COOK_TOCOOK_ANIMI = 'cookAgain';
  var HIT_DIZZY = 'hitDizzy';
  // color
  var MAIN_RED = 0xfc6158;
  var MAIN_RED_LIGHT = 0xf9ebe9;
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
          }, 1000);
      }, false);
  }
  // 测试嘴巴位置
  function changeMouth(game) {
      //contours sample data
      window.addEventListener("load", function () {
          // 这个数据是和取景器大小有关的数据 
          // 当 RN 的部分设置了取景器大小的时候, 返回的脸的位置也根据 RN 这里的实际尺寸有所压缩
          // 但是和取景器的位移无关  毕竟安卓端也不知道取景器的相对位置
          fetch('/assets/sampleContours.json').then(function (resp) {
              return resp.json();
          }).then(function (data) {
              setTimeout(function () {
                  // 在PC上调试
                  if (window.navigator.userAgent.indexOf("PCMozilla") != -1) {
                      var oneFace_1 = data[0];
                      setInterval(function () {
                          // moveFace(oneFace, changeDir)
                          var afterOffsetForFaceData = addOffsetForFaceData(oneFace_1);
                          window.postMessage({
                              messageType: 'face',
                              faceData: afterOffsetForFaceData
                          }, "*");
                      }, 100);
                  }
              }, 1000);
          });
      }, false);
      // let points = [{x:100, y:500}, {x:200, y:600}, {x:100, y:600}, {x:200, y:600}]
  }
  // 获取鼠标点击位置
  function testClickEvent(game) {
      window.addEventListener('load', function () {
          setTimeout(function () {
              game.scene.getScene(GAME_SCENE).input.on('pointerup', function (pointer) {
                  var touchX = pointer.x;
                  var touchY = pointer.y;
                  // let x = game.input.mousePointer.x;
                  // let y = game.input.mousePointer.y;
                  console.log('clickXY', touchX, touchY);
                  // ...
              });
          });
      }, false);
  }
  //# sourceMappingURL=test.js.map

  var Point = Phaser.Geom.Point;
  var Rectagle = Phaser.Geom.Rectangle;
  var stageWidth$1 = document.body.clientWidth;
  var stageHeight$1 = document.body.clientWidth / 9 * 16;
  var Mouth = /** @class */ (function () {
      // private mouthColor: Graphics;
      function Mouth(scene) {
          this.mouthRect = new Rectagle(0, 0, 0, 0);
          this.mouthContour = scene.add.graphics();
          this.mouthCenter = scene.add.graphics();
          this.mouthStateText = scene.add.text(stageWidth$1 - 100, 100, '', { fontFamily: '"Roboto Condensed"' });
      }
      Mouth.prototype.setMouthContourPoints = function (upperTop, upperBottom, lowerTop, lowerBottom) {
          if (upperTop === void 0) { upperTop = []; }
          if (upperBottom === void 0) { upperBottom = []; }
          if (lowerTop === void 0) { lowerTop = []; }
          if (lowerBottom === void 0) { lowerBottom = []; }
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
          // console.log('mouth vals', mouthPoints.length)
          var minX = Math.min.apply(Math, xVals);
          var maxX = Math.max.apply(Math, xVals);
          var minY = Math.min.apply(Math, yVals);
          var maxY = Math.max.apply(Math, yVals);
          this.mouthCenter.clear();
          var circle = new Phaser.Geom.Circle(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, 5);
          this.mouthCenter.fillCircleShape(circle);
          // console.log('center',mouthPoints, minX, minY, maxX, maxY, circle.x, circle.y )
          this.mouthRect.setPosition(minX, minY);
          this.mouthRect.setSize(maxX - minX, maxY - minY);
      };
      Mouth.prototype.drawContour = function () {
          var mouthPoints = this.mouthAllPoints;
          this.mouthContour.clear();
          this.mouthContour.lineStyle(5, 0xFFBBFF, 1.0);
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
          if (this.lowerBottomPoints.length == 0 || this.upperBottomPoints.length == 0) {
              return true;
          }
          var lowerTipTopY = this.lowerTopPoints.map(function (p) {
              return p.y;
          }).filter(function (p) {
              // 目前给到的数据存在 undefined
              if (p) {
                  return p;
              }
          });
          var upperLipBottomY = this.upperBottomPoints.map(function (p) {
              return p.y;
          }).filter(function (p) {
              // 目前给到的数据存在没有y的情况  所以经过上面的map 数组中有 undefined 的情况
              if (p) {
                  return p;
              }
          });
          var maxYOfLowerLipTop = Math.max.apply(Math, lowerTipTopY);
          var minYOfUpperLipBottom = Math.min.apply(Math, upperLipBottomY);
          // return false
          var isClose = false;
          // if (this.mouthRect.height < 30 && this.mouthRect.height / this.mouthRect.width < 0.5) {
          //     isClose = true
          // }
          if (Math.abs(minYOfUpperLipBottom - maxYOfLowerLipTop) < 10) {
              isClose = true;
          }
          this.mouthStateText.text = "" + Math.abs(minYOfUpperLipBottom - maxYOfLowerLipTop);
          // this.mouthStateText.text = "" + this.mouthRect.height //isClose ? "close" : "open"
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

  var Circle = Phaser.Geom.Circle;
  var Point$1 = Phaser.Geom.Point;
  var angle2Rad = function (angle) {
      return (Math.PI / 180) * angle;
  };
  var SpinTable = /** @class */ (function () {
      function SpinTable(scene, spinSpeed) {
          this.angleVal = 0;
          this.rotationVal = 0;
          this.spSpinSpeed = 1;
          this.circleRadius = stageWidth;
          this.circleCenter = new Point$1(stageWidth / 2 + 200, stageHeight + 200);
          // public circleCenter: Point = new Point(stageWidth / 2 , stageHeight - 200);    
          this.platePosRadius = this.circleRadius * 0.9;
          this.distanceAngle = DISTANCE_ANGLE; //食物和食物之间的间隔(角度)
          this.tableCapacity = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量
          this.distanceRad = 2 * Math.PI / this.tableCapacity;
          this.plates = [];
          this.spSpinSpeed = spinSpeed;
          this.scene = scene;
      }
      SpinTable.prototype.createTable = function () {
          this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);
          this.tableContainer = this.scene.add.container(this.circleCenter.x, this.circleCenter.y);
          this.spinTable = this.scene.add.sprite(0, 0, 'table');
          var bds = this.spinTable.getBounds();
          var width = bds.width;
          this.spinTable.setScale(this.circleRadius / (width / 2), this.circleRadius / (width / 2));
          // if (isPC) {
          //     this.spinTable.alpha = 0.5
          // }
          this.tableContainer.add(this.spinTable);
          this.addPlates();
      };
      SpinTable.prototype.setTableCapacity = function (tableCapacity) {
          this.tableCapacity = tableCapacity;
          this.distanceAngle = 360 / tableCapacity;
      };
      SpinTable.prototype.rotateTableSlightly = function () {
          // 角度从x轴正方向开始算  顺时针旋转
          // rotate 是使用的弧度
          // angle 是角度
          this.angleVal += this.spSpinSpeed;
          this.rotationVal += angle2Rad(this.spSpinSpeed);
          // this.spinTable.rotation = this.rotationVal
          this.tableContainer.rotation = this.rotationVal;
      };
      SpinTable.prototype.getAngle = function () {
          return this.angleVal;
      };
      SpinTable.prototype.getRotation = function () {
          return this.rotationVal;
      };
      SpinTable.prototype.addPlates = function () {
          for (var i = 0; i < this.tableCapacity; i++) {
              var rad = this.calcRadByIdx(i);
              var circle = new Circle(0, 0, this.platePosRadius);
              var p = this.calcRadToPoint(rad, circle);
              this.plates[i] = this.scene.add.image(p.x, p.y, 'plate');
              this.plates[i].setScale(2);
              this.tableContainer.add(this.plates[i]);
          }
      };
      /**
       * 计算第 i 个食物的在当前桌面上的角度
       * 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
       * i starts from 0
       * @param i
       */
      SpinTable.prototype.calcAngleByIndx = function (i) {
          var rawAngle = this.getAngle();
          var angle = rawAngle + this.distanceAngle * (this.tableCapacity - i);
          return angle;
          // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
          // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
      };
      /**
       * 计算第 i 个食物的在当前桌面上的角度
       * 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
       */
      SpinTable.prototype.calcRadByIdx = function (i) {
          var rawRad = this.rotationVal;
          var rad = rawRad + this.distanceRad * (this.tableCapacity - i);
          return rad;
      };
      SpinTable.prototype.calcAngleToPoint = function (angle) {
          var point = new Phaser.Geom.Point(0, 0);
          Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
          return point;
      };
      // 默认是以桌面半径计算位置 
      // 但是有时候半径会不一样  比如盘子和食物
      SpinTable.prototype.calcRadToPoint = function (rad, circle) {
          if (!circle) {
              circle = this.circle;
          }
          var point = new Phaser.Geom.Point(0, 0);
          Phaser.Geom.Circle.CircumferencePoint(circle, rad, point);
          return point;
      };
      return SpinTable;
  }());
  //# sourceMappingURL=spinTable.js.map

  var Point$2 = Phaser.Geom.Point;
  var Vector2 = Phaser.Math.Vector2;
  var Rectagle$1 = Phaser.Geom.Rectangle;
  var stageWidth$2 = document.body.clientWidth;
  var stageHeight$2 = document.body.clientWidth / 9 * 16;
  var CamFaceCheck = /** @class */ (function () {
      function CamFaceCheck(scene) {
          this.scene = scene;
          this.faceRect = scene.add.graphics();
          this.previewRect = scene.add.graphics();
          this.facePosText = scene.add.text(stageWidth$2 - 100, 250, '', { fontFamily: '"Roboto Condensed"' });
      }
      CamFaceCheck.prototype.refreshFacePosition = function (faceBounds, facePoints) {
          this.faceBounds = faceBounds;
          var centerX = faceBounds.origin.x + faceBounds.size.width / 2;
          var centerY = faceBounds.origin.y + faceBounds.size.height / 2;
          this.faceCenterPos = new Vector2(centerX, centerY);
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
          var centerX = previewCamArea.x + previewCamArea.width / 2;
          var centerY = previewCamArea.y + previewCamArea.height / 2;
          this.previewRect.fillStyle(0x00FFFF);
          this.previewRect.fillRect(centerX, centerY, 10, 10);
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
          var centerX = faceBounds.origin.x + faceBounds.size.width / 2;
          var centerY = faceBounds.origin.y + faceBounds.size.height / 2;
          this.faceRect.fillStyle(0xFF00FF);
          this.faceRect.fillRect(centerX, centerY, 10, 10);
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
      // setTargetFaceBounds(facebds: Bounds) {
      //     if (this.targetFaceBounds == null) {
      //         this.targetFaceBounds = facebds
      //         let centerX = facebds.origin.x + facebds.size.width
      //         let centerY = facebds.origin.y + facebds.size.height
      //         let distanceX = this.camPreviewArea.x - centerX
      //         let distanceY = this.camPreviewArea.y - centerY      
      //         this.faceCenterPos = new Vector2(centerX, centerY)
      //         // 同时告知 RN?  //脸的位置确定了
      //         if (window["ReactNativeWebView"]) {
      //             let msg = {
      //                 messageType: MSG_TYPE_FACE_TARGET_POS,                    
      //                 actualData: {
      //                     bounds: facebds,
      //                 },
      //                 time: +new Date
      //             }
      //             window["ReactNativeWebView"].postMessage(JSON.stringify(msg));
      //         }            
      //     }
      // }
      CamFaceCheck.prototype.getTargetFaceBounds = function () {
          return this.faceBounds;
      };
      CamFaceCheck.prototype.updatePreviewPosByTarget = function () {
          // let faceCenterPos = this.faceCenterPos
          // let firstCamPreviewArea = this.firstSetCamPreviewArea
          // if (!firstCamPreviewArea){
          //     return
          // }
          // if (!faceCenterPos) {
          //     return 
          // }
          // let originCamArea = this.firstSetCamPreviewArea
          // let faceBounds = this.faceBounds
          // let centerX = faceBounds.origin.x + faceBounds.size.width
          // let centerY = faceBounds.origin.y + faceBounds.size.height
          // let distanceX = this.camPreviewArea.x - centerX
          // let distanceY = this.camPreviewArea.y - centerY 
          // let offset = new Point(
          //     faceCenterPos.x - centerX,
          //     faceCenterPos.y - centerY
          // )
          // this.camPreviewArea.x = originCamArea.x + offset.x
          // this.camPreviewArea.y = originCamArea.y + offset.y
          // this.drawPreviewBounds(this.camPreviewArea)
      };
      return CamFaceCheck;
  }());
  //# sourceMappingURL=facePosCheck.js.map

  var Sprite = Phaser.GameObjects.Sprite;
  // import { DOGLOOK, DOGCOOK, CHECKING_INTERVAL, COOK_LOOKBACK_ANIMI, COOK_TOCOOK_ANIMI } from '../constants'
  // Phaser.Sprite 中可以 play 动画
  // 但是 Phaser.Image 不行
  var Cook = /** @class */ (function (_super) {
      __extends(Cook, _super);
      function Cook(scene, x, y) {
          var _this = _super.call(this, scene, x, y, DOGCOOK, 0) || this;
          _this.cooking = true; //做饭  
          //PS  存在时间差 当cooking false checking也是false 的时候表示在扭头的过程中
          _this.startCheckingTime = 0;
          _this.endCheckingTime = 0; //
          _this.checkTimeCount = 0; //回头检查次数
          // scene.add.image(0, 0, 'dog', 0)
          // let img = new Image(scene,x,y,texture);
          // scene.children.add(this);
          scene.add.existing(_this);
          _this.addAnimationListener();
          return _this;
      }
      Cook.prototype.setOriginToTopLeft = function () {
          this.setOrigin(0, 0);
      };
      Cook.prototype.addAnimationListener = function () {
          var _this = this;
          this.on('animationcomplete', function (e) {
              console.log("animationcomplete", e);
              var eventKey = e.key; // lookback ....
              switch (eventKey) {
                  // 回头继续做饭动画结束  又开始做饭了
                  case COOK_TOCOOK_ANIMI:
                      _this.endCheckingTime = +new Date;
                      console.log("looking back", _this.endCheckingTime - _this.startCheckingTime);
                      _this.checkTimeCount++;
                      _this.cooking = true;
                      break;
                  case COOK_LOOKBACK_ANIMI:
                      // this.startWatchingTime
                      _this.checkIfEatingAnimation();
              }
          });
      };
      Cook.prototype.lookBack = function () {
          // this.setTexture('doglook', 0)
          this.cooking = false;
          this.startCheckingTime = +new Date;
          this.play(COOK_LOOKBACK_ANIMI);
      };
      // 厨师回头检查的时间在 1S-2S范围内
      Cook.prototype.checkIfEatingAnimation = function () {
          var _this = this;
          this.checking = true;
          var duration = Math.random() * 1500 + 1000;
          setTimeout(function () {
              _this.cookAgain();
          }, duration);
      };
      Cook.prototype.cookAgain = function () {
          // this.setTexture('dogcook', 0)
          this.checking = false;
          // this.cooking = true  应该时动画结束的时候才开始 cooking  转头有一个过程
          // endCheckingTime 会在动画结束的时候计算
          this.play(COOK_TOCOOK_ANIMI);
      };
      Cook.prototype.isCooking = function () {
          return this.cooking;
      };
      Cook.prototype.isChecking = function () {
          return this.checking;
      };
      Cook.prototype.isTurning = function () {
          return !this.checking && !this.cooking;
      };
      //是否刚刚回头过
      Cook.prototype.ifJustChecked = function (elapsed) {
          if (this.endCheckingTime != 0 && this.endCheckingTime > this.startCheckingTime) {
              var timeGap = +new Date - this.endCheckingTime;
              return (timeGap < CHECKING_INTERVAL);
          }
          return true;
      };
      return Cook;
  }(Sprite));
  //# sourceMappingURL=cook.js.map

  // import { COOK_LOOKBACK_ANIMI, COOK_TOCOOK_ANIMI, HIT_DIZZY } from "../constants";
  var AnimateManager = /** @class */ (function () {
      function AnimateManager(scene) {
          // 此刻 scene 还没有准备好
          this.scene = scene;
      }
      AnimateManager.prototype.registerAnimation = function () {
          this.cookLookback();
          this.cookAgain();
          this.hitDizzy();
      };
      AnimateManager.prototype.cookLookback = function () {
          var scene = this.scene;
          var makeFrames = function () {
              var arr = [];
              var endIndex = 33; // 到 33 的时候停下来
              for (var idx = 0; idx <= endIndex; idx++) {
                  var keyname = "dogeFrame" + idx;
                  arr.push({
                      key: keyname,
                  });
              }
              return arr;
          };
          // weired !!!
          this.doge = scene.anims.create({
              key: COOK_LOOKBACK_ANIMI,
              frames: makeFrames(),
              frameRate: 1 / 0.04,
          });
      };
      AnimateManager.prototype.cookAgain = function () {
          var scene = this.scene;
          var makeFrames = function () {
              var arr = [];
              var endIndex = 47; // 到 33 的时候停下来
              for (var idx = 33; idx <= endIndex; idx++) {
                  var keyname = "dogeFrame" + idx;
                  arr.push({
                      key: keyname,
                  });
              }
              return arr;
          };
          // weired !!! 动画结束的调用方式很奇怪
          this.doge = scene.anims.create({
              key: COOK_TOCOOK_ANIMI,
              frames: makeFrames(),
              frameRate: 1 / 0.04,
          });
      };
      AnimateManager.prototype.hitDizzy = function () {
          var scene = this.scene;
          this.doge = scene.anims.create({
              key: HIT_DIZZY,
              frames: [
                  { key: 'dizzy1' },
                  { key: 'dizzy2' }
              ],
              frameRate: 1 / 0.4,
              repeat: -1 // 不断重复
          });
      };
      return AnimateManager;
  }());
  //# sourceMappingURL=animate.js.map

  var GameSoundManager = /** @class */ (function () {
      function GameSoundManager() {
      }
      GameSoundManager.initMusic = function (scene) {
          GameSoundManager.scene = scene;
          GameSoundManager.sound = GameSoundManager.scene.sound.add(SOUNDKEY, {
              mute: false,
              volume: 1,
              rate: 1,
              detune: 0,
              seek: 0,
              loop: false,
              delay: 0
          });
          GameSoundManager.bgmusic = GameSoundManager.scene.sound.add(MUSICKEY, {
              mute: false,
              volume: 1,
              rate: 1,
              detune: 0,
              seek: 0,
              loop: true,
              delay: 0
          });
          GameSoundManager.bgmusic.play();
      };
      GameSoundManager.toggleSoundMode = function () {
          GameSoundManager.soundMode = !GameSoundManager.soundMode;
      };
      GameSoundManager.playSound = function () {
          if (GameSoundManager.soundMode && GameSoundManager.sound) {
              GameSoundManager.sound.play();
          }
      };
      GameSoundManager.toogleMusicMode = function () {
          GameSoundManager.musicMode = !GameSoundManager.musicMode;
          if (!GameSoundManager.musicMode) {
              GameSoundManager.bgmusic.pause();
          }
          else {
              GameSoundManager.bgmusic.resume();
          }
      };
      GameSoundManager.soundMode = true;
      GameSoundManager.musicMode = true;
      return GameSoundManager;
  }());
  //# sourceMappingURL=soundManager.js.map

  var Circle$1 = Phaser.Geom.Circle;
  var Point$3 = Phaser.Geom.Point;
  var Rectagle$2 = Phaser.Geom.Rectangle;
  var stageWidth$3 = document.body.clientWidth;
  var stageHeight$3 = document.body.clientWidth / 9 * 16;
  var Demo = /** @class */ (function (_super) {
      __extends(Demo, _super);
      function Demo() {
          var _this = _super.call(this, GAME_SCENE) || this;
          _this.score = 0;
          _this.spSpinSpeed = 1;
          _this.distanceAngle = DISTANCE_ANGLE; //食物和食物之间的间隔(角度)
          _this.tableCapacity = 360 / _this.distanceAngle; //根据间隔计算得到的桌面容量
          _this.foodList = __spreadArrays(Array(_this.tableCapacity)).map(function (_) { return null; });
          // preview 取景器
          _this.previewArea = new Rectagle$2(0, 0, 0, 0);
          _this.frameCounter = 0;
          _this.addCounter = 0;
          _this.messageListener();
          return _this;
      }
      Demo.prototype.preload = function () {
          console.log('game preload');
          this.scene.launch(EF_SCENE);
          this.scene.launch(GAMEUI_SCENE);
      };
      // preload 中的资源都加载完毕之后 才会调用 create
      Demo.prototype.create = function () {
          console.log('game create');
          GameSoundManager.initMusic(this);
          // setTimeout(() => {
          //     this.scene.launch(SETTINGS_SCENE)
          //     setTimeout(  ()=> {
          //         this.scene.sendToBack(SETTINGS_SCENE)
          //     }, 500)
          // }, 500);
          // this.scene.get(UI_SCENE).events.on('afterCreate', ()=> {
          //     (<GameUIScene>this.scene.get(UI_SCENE)).showWelcome()
          // })
          this.timer = this.time.addEvent({
              // delay: 500,                // ms
              // callback: callback,
              //args: [],
              // callbackScope: thisArg,
              loop: true
          });
          this.drawBackground();
          this.addCook();
          this.addFace();
          this.drawWheel();
          // Phaser会根据 add 的先后顺序决定层级.
          this.mouthObj = new Mouth(this);
          this.refreshMouth([], [], [], []);
          this.addText();
          this.uiScene = this.scene.get(GAMEUI_SCENE);
          this.effScene = this.scene.get(EF_SCENE);
          this.animateManager = new AnimateManager(this);
          this.animateManager.registerAnimation();
          this.addScore = this.addScore.bind(this);
          // Main Scene
          this.cameras.main.fadeIn(250);
      };
      Demo.prototype.update = function (time, delta) {
          console.log('game ');
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
          var elapsed = this.timer.getElapsedSeconds();
          this.shouldCookLookBack(elapsed);
          this.fpsText.text = this.game.loop.actualFps + '';
      };
      Demo.prototype.shouldCookLookBack = function (elapsed) {
          if (this.cook) {
              var shouldLookBack = Math.random();
              var isCooking = this.cook.isCooking();
              if (isCooking) {
                  if (this.cook.checkTimeCount == 0) {
                      if (elapsed > FIRST_CHECK_ELAPSE) {
                          this.cook.lookBack();
                      }
                  }
                  else {
                      var isJustChecked = this.cook.ifJustChecked(elapsed);
                      if (!isJustChecked && shouldLookBack < 0.9) {
                          this.cook.lookBack();
                      }
                  }
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
              // 盘子是空的, 且恰好转到一个固定的位置. 就添加食物
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
                  // let rawAngle = this.spinTable.getAngle()
                  // let mathAngle = rawAngle < 0 ? 360 + rawAngle : rawAngle
                  // // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
                  // // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                  // if (Math.abs(mathAngle - i * this.distanceAngle) < 2) {
                  //     let foodTextureKey = `food${i}`
                  //     let food = this.add.image(0, 0, foodTextureKey) as Food
                  //     food.name = `Food${i}`
                  //     food.setScale(2)
                  //     this.foodList[i] = food
                  //     // console.log("angle add", rawAngle, mathAngle, food.name)
                  //     // this.foodList.push(food)
                  // }
                  // 上面的办法虽然对于人类理解比较直观 但是phaser 操作起来却比较复杂 主要是 phaser 的坐标系划分很诡异
                  var spinRad = this.spinTable.getRotation() % (2 * Math.PI);
                  var foodRad = i * this.spinTable.distanceRad;
                  if (Math.abs(spinRad - foodRad) < 0.02) {
                      var foodTextureKey = "food" + i;
                      var food = this.add.image(0, 0, foodTextureKey);
                      food.name = "Food" + i;
                      food.setScale(1);
                      this.foodList[i] = food;
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
              // let foodAngle = this.spinTable.calcFoodIAngle(i) //当前食物在桌上的角度
              // let point = this.spinTable.calcAngleToPoint(foodAngle)
              var foodRad = this.spinTable.calcRadByIdx(i);
              var circle = new Circle$1(this.spinTable.circleCenter.x, this.spinTable.circleCenter.y, this.spinTable.platePosRadius);
              var point = this.spinTable.calcRadToPoint(foodRad, circle);
              food.x = point.x;
              food.y = point.y;
          }
      };
      Demo.prototype.refreshMouth = function (upperTop, upperBottom, lowerTop, lowerBottom) {
          if (this.mouthObj) {
              this.mouthObj.setMouthContourPoints(upperTop, upperBottom, lowerTop, lowerBottom);
          }
          else {
              console.warn('mouth obj has not ready');
          }
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
                      console.log("MSG_TYPE_CAM");
                      _this.setCameraArea(event);
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
      Demo.prototype.setCameraArea = function (event) {
          var _this = this;
          if (this.camFaceCheck) {
              var previewArea = event.data.previewArea;
              this.previewArea = previewArea;
              this.camFaceCheck.setCameraArea(previewArea);
          }
          else {
              console.log("camFaceCheck not defined!!!");
              setTimeout(function () {
                  _this.setCameraArea(event);
              }, 100);
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
                  break;
              }
              // 来到了取景器右边 // 表示miss
              if (food.x > offsetXPreview + previewWidth && food.y < offsetYPreview + previewHeight * 1.2) {
                  console.log('miss');
              }
          }
      };
      Demo.prototype.eatingAnimation = function (food, dest) {
          var _this = this;
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
                  // if not get caught
                  if (_this.cook.isCooking()) {
                      _this.effScene.addCoin(_this.addScore);
                  }
                  else {
                      if (_this.cook.isChecking())
                          _this.caughtAnimation();
                  }
              }
          });
      };
      Demo.prototype.caughtAnimation = function () {
          this.effScene.addHammer(this, this.addScore);
          this.uiScene.createCaughtText(stageWidth$3 / 2, stageHeight$3 / 2, function () { });
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
          this.bg = this.add.graphics();
          this.bgImg = this.add.image(0, 0, 'bgImg');
          var bd = this.bgImg.getBounds();
          this.bgImg.setPosition(0, 0);
          // Phaser 中 Image 的默认 pivot 就是图片的中心点
          this.bgImg.x = stageWidth$3 / 2;
          this.bgImg.y = stageHeight$3 / 2;
          this.bgImg.setScale(stageWidth$3 / bd.width, stageHeight$3 / bd.height);
          if (isPC) {
              this.bgImg.alpha = 0.5;
          }
      };
      Demo.prototype.drawWheel = function () {
          this.spinTable = new SpinTable(this, this.spSpinSpeed);
          this.spinTable.createTable();
      };
      Demo.prototype.addFace = function () {
          this.camFaceCheck = new CamFaceCheck(this);
      };
      Demo.prototype.addText = function () {
          this.fpsText = this.add.text(320, 120, '////////', {
              fontFamily: '"Roboto Condensed"',
              color: '#ffffff'
          });
          // this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
          // this.testText = this.add.text(170, 170, 'Hello World', { fontFamily: '"Roboto Condensed"' });
          // this.scoreText = this.add.text(390, 50, '0', { 
          //     fontFamily: '"Roboto Condensed"',
          //     color: 'red'
          // })
      };
      Demo.prototype.refreshFaceBounds = function (bounds, facePoints) {
          if (!this.camFaceCheck) {
              return;
          }
          this.camFaceCheck.refreshFacePosition(bounds, facePoints);
          this.camFaceCheck.updatePreviewPosByTarget();
          // 脸的矫正都放在客户端做。
          // let rs: FaceInCircle = this.camFaceCheck.checkFacePosition(bounds)
          // if (rs.pass) {
          //     // this.camFaceCheck.setTargetFaceBounds(bounds)
          // }
      };
      Demo.prototype.addCook = function () {
          this.cook = new Cook(this, 120, 390);
          this.cook.setScale(0.7);
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
      Demo.prototype.addScore = function (sc) {
          if (this.score == 0 && sc < 0) {
              return;
          }
          this.score = this.score + sc;
          this.effScene.scoreText.text = '' + this.score;
      };
      return Demo;
  }(Phaser.Scene));
  //# sourceMappingURL=game.js.map

  var UIHelper = /** @class */ (function () {
      function UIHelper() {
      }
      /**
       *
       * @param scene parent scene
       * @param size size of rectangle
       * @param radius
       * @param color mainColor
       * @param borderWidth
       * @param outerColor border Color (little darken than main color)
       */
      UIHelper.drawRoundRect = function (scene, size, radius, color, borderWidth, outerColor) {
          var bg = scene.add.graphics();
          bg.clear();
          bg.beginPath();
          var x = size.x;
          var y = size.y;
          var width = size.width;
          var height = size.height;
          bg.fillStyle(outerColor);
          // graphics 的 origin 是左上角
          bg.fillRoundedRect(x, y, width, height, radius);
          if (borderWidth) {
              var x2 = x + borderWidth;
              var y2 = y + borderWidth;
              bg.fillStyle(color);
              bg.fillRoundedRect(x2, y2, width - 2 * borderWidth, height - 2 * borderWidth, radius - borderWidth);
          }
          return bg;
      };
      UIHelper.createImageButton = function (scene, x, y, texture, callback, noframes) {
          return new ImageButton(scene, x, y, texture, callback, noframes);
      };
      UIHelper.fadeToStartScene = function (newScene, currentScene) {
          currentScene.cameras.main.fadeOut(250);
          currentScene.time.addEvent({
              delay: 250,
              callback: function () {
                  currentScene.scene.start(newScene);
              },
              callbackScope: currentScene
          });
      };
      UIHelper.fadeToAddAnotherScene = function (newScene, currentScene) {
          // 先把目标场景显示
          currentScene.scene.get(newScene).cameras.main.fadeIn(0);
          // 当前场景慢慢淡出
          currentScene.cameras.main.fadeOut(250);
          currentScene.time.addEvent({
              delay: 250,
              callback: function () {
                  if (!currentScene.scene.isActive(newScene) &&
                      !currentScene.scene.isPaused(newScene) &&
                      !currentScene.scene.isSleeping(newScene)) {
                      currentScene.scene.launch(newScene);
                  }
                  else {
                      if (currentScene.scene.isSleeping(newScene)) {
                          currentScene.scene.wake(newScene);
                      }
                  }
              },
              callbackScope: currentScene
          });
      };
      UIHelper.fadeToPrevScene = function (resumeScene, currentScene) {
          currentScene.scene.get(resumeScene).cameras.main.fadeIn(0);
          currentScene.cameras.main.fadeOut(250);
          currentScene.time.addEvent({
              delay: 250,
              callback: function () {
                  currentScene.scene.sleep(currentScene.scene.key);
              },
              callbackScope: currentScene
          });
      };
      return UIHelper;
  }());
  var ImageButton = /** @class */ (function (_super) {
      __extends(ImageButton, _super);
      function ImageButton(scene, x, y, texture, callback, noframes) {
          var _this = _super.call(this, scene, x, y, texture, 0) || this;
          _this.setInteractive({ useHandCursor: true });
          _this.on('pointerup', function () {
              if (!noframes) {
                  this.setFrame(1);
              }
          }, _this);
          _this.on('pointerdown', function () {
              if (!noframes) {
                  this.setFrame(2);
              }
              callback.call(scene);
          }, _this);
          _this.on('pointerover', function () {
              if (!noframes) {
                  this.setFrame(1);
              }
          }, _this);
          _this.on('pointerout', function () {
              if (!noframes) {
                  this.setFrame(0);
              }
          }, _this);
          return _this;
          // scene.add.existing(this);
      }
      return ImageButton;
  }(Phaser.GameObjects.Image));
  //# sourceMappingURL=UIHelper.js.map

  var Point$4 = Phaser.Geom.Point;
  var Rectagle$3 = Phaser.Geom.Rectangle;
  var stageWidth$4 = document.body.clientWidth;
  var stageHeight$4 = document.body.clientWidth / 9 * 16;
  var TopLeftToCenter = function (width, height, topLeftPoint) {
      var halfW = width / 2;
      var halfH = height / 2;
      return new Point$4(topLeftPoint.x - halfW, topLeftPoint.y - halfH);
  };
  var GameUIScene = /** @class */ (function (_super) {
      __extends(GameUIScene, _super);
      function GameUIScene() {
          return _super.call(this, GAMEUI_SCENE) || this;
      }
      GameUIScene.prototype.preload = function () {
          // 用到 rexUI scene 必须加载 scenePlugin
          this.load.scenePlugin({
              key: 'rexuiplugin',
              url: '/rexuiplugin.min.js',
              sceneKey: 'rexUI'
          });
      };
      GameUIScene.prototype.create = function () {
          this.bindEvents();
          this.addUIBtns();
          // this.showWelcome()
          // this.welcome.visible = false
          // this.getCaught = this.createGetCaughtDialog(stageWidth/2, stageHeight/2) 
          // this.testView = this.createDemoDialog(this, 0, 0)
          // this.testView.visible = false
          // this.testGraphic = this.add.graphics()
          // this.testGraphic.lineStyle(10, 0x00bb44)
          // this.testGraphic.strokeLineShape( new Phaser.Geom.Line(200, 300, 250, 300))
          // this.testGraphic.rotation = 2* Math.PI
          this.events.emit('afterCreate');
      };
      GameUIScene.prototype.update = function (time, delta) {
      };
      GameUIScene.prototype.showWelcome = function () {
          this.welcome = this.createWelcomeDialog(this, 300, 500);
          this.welcome.popUp(500);
      };
      GameUIScene.prototype.bindEvents = function () {
          var _this = this;
          this.events.on('wake', function () {
              _this.cameras.main.fadeIn(250);
          }, this);
      };
      GameUIScene.prototype.createWelcomeDialog = function (scene, width, height) {
          var _this = this;
          var makeFixWidthPanel = function (maxwidth, content) {
              var sizer = _this.rexUI.add.fixWidthSizer({
                  // child: makeContentLabel(content),
                  space: {
                      left: 3,
                      right: 3,
                      top: 3,
                      bottom: 3,
                      item: 8,
                      line: 8,
                  }
              });
              return sizer;
          };
          var makeScrollSizer = function (content) {
              // const COLOR_PRIMARY = 0x4e342e;
              // const COLOR_LIGHT = 0x7b5e57;
              // const COLOR_DARK = 0x260e04;
              var scrollPanel = scene.rexUI.add.scrollablePanel({
                  x: width / 2,
                  y: height / 2,
                  width: 240,
                  height: 340,
                  scrollMode: 0,
                  background: _this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xffffff),
                  panel: {
                      // child: makeContentLabel(content),
                      child: makeFixWidthPanel(),
                      mask: {
                          padding: 1
                      },
                  },
                  // slider: {
                  //     track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                  //     thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                  // },
                  space: {
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                      panel: 0,
                  }
              }).layout();
              var insertTextToPanel = function (panel, content) {
                  var sizer = panel.getElement('panel');
                  var scene = panel.scene;
                  sizer.clear(true);
                  var lines = content.split('\n');
                  for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
                      var words = lines[li].split(' ');
                      for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
                          sizer.add(scene.add.text(0, 0, words[wi], {
                              fontSize: 18,
                              color: '#666'
                          })
                          // .setInteractive()
                          // .on('pointerdown', function () {
                          //     this.scene.print.text = this.text;
                          //     this.setTint(Phaser.Math.Between(0, 0xffffff))
                          // })
                          );
                      }
                      if (li < (lcnt - 1)) {
                          sizer.addNewLine();
                      }
                  }
                  panel.layout();
                  return panel;
              };
              insertTextToPanel(scrollPanel, content);
              return scrollPanel;
          };
          // x y 用于定位panel的位置  默认 xy 是panel 的中心点
          var x = stageWidth$4 / 2;
          var y = stageHeight$4 / 2;
          var contentStr = "\u8FD9\u662F\u4E00\u4E2A\u5077\u5403\u6C49\u5821\u7684\u6E38\u620F! \n\n\u26A0\uFE0F\u4F60\u53EA\u53EF\u4EE5\u5403\u6C49\u5821\u85AF\u6761\uFF0C\u559D\u53EF\u4E50\u3002\n\u5176\u4ED6\u7684\u4F60\u90FD\u4E0D\u559C\u6B22\u5403\u3002\n\u53E6\u5916\u4F60\u6CA1\u6709\u94B1\uFF0C\n\u53EA\u80FD\u5728\u53A8\u5E08\u770B\u4E0D\u5230\u4F60\u7684\u65F6\u5019\u5403\u3002\n\n\n\u628A\u6574\u5F20\u8138\u90FD\u653E\u5728\u6846\u5185\uFF0C \u901A\u8FC7\u5F20\u5634\u5C31\u53EF\u4EE5\u5077\u5403\u5566\n";
          // 默认x y 是 Dialog 中心位置   也就是说 Pivot 默认是 center 
          var dialog = scene.rexUI.add.dialog({
              x: x,
              y: y,
              width: width,
              // height: height,
              // background 并不在意大小的
              background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, MAIN_RED),
              title: scene.rexUI.add.label({
                  background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, MAIN_RED_LIGHT),
                  text: scene.add.text(0, 0, 'Eat Burger AR Game', {
                      fontSize: '20px',
                      color: '#FC6158',
                  }),
                  space: {
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10
                  }
              }),
              // content: makeContentLabel(contentStr),
              content: makeScrollSizer(contentStr),
              actions: [
                  this.createRexUIButton(this, 'OK', 0xf57f17),
              ],
              actionsAlign: '  center  ',
              space: {
                  title: 10,
                  action: 45,
                  content: 25,
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
              this.scene.resume(GAME_SCENE);
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
      GameUIScene.prototype.createDemoDialog = function (scene, x, y) {
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
      GameUIScene.prototype.createCaughtText = function (x, y, cb) {
          var _this = this;
          var containerWidth = 400;
          var containerHeight = 100;
          var containerPos = new Point$4(stageWidth$4 / 2, stageHeight$4 / 2 * 1.6);
          var container = this.add.container(containerPos.x, containerPos.y);
          // (250,  50) 这个点是相对于容器左上角而言的
          var toastPos = TopLeftToCenter(400, 100, new Point$4(250, 50));
          var toastText = this.add.text(toastPos.x, toastPos.y, 'You get Caught!!', {
              fontFamily: 'Berlin',
              stroke: '#000',
              fontSize: 30,
              strokeThickness: 4,
              align: 'center'
          });
          // this.hasCaughtToast = true
          // toastText.x = stageWidth / 2
          // toastText.y = stageHeight / 2
          toastText.setOrigin(0.5);
          // let bg = this.rexUI.add.roundRectangle(0, 0, 100, 240, 0, 0x00ccbb)
          // 使用graphics的时候都是从左上角开始画  
          // 而 container 的默认origin 是中心位置， （且无法更改？？）
          // 添加元素的时候也是将子元素的origin 和 父容器的origin 对齐
          // graphic 的 origin 是左上角
          // f9ebe9
          var bg = UIHelper.drawRoundRect(this, new Rectagle$3(-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight), 20, MAIN_RED_LIGHT, 5, MAIN_RED);
          var AlternativeEmoji = ['sad', 'cry', 'sour'];
          var hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji);
          var emojiPos = TopLeftToCenter(400, 100, new Point$4(50, 50));
          var emojiFace = this.add.image(emojiPos.x, emojiPos.y, hitEmoji);
          emojiFace.setScale(0.2);
          container.add([bg, emojiFace, toastText]);
          container.setScale(0);
          this.tweens.add({
              targets: container,
              scale: 1,
              duration: 132,
              x: containerPos.x,
              y: containerPos.y,
              ease: ' Elastic.In',
              onComplete: function () {
                  setTimeout(function () {
                      _this.tweens.add({
                          targets: container,
                          // y: stageHeight * 1.2,
                          x: containerPos.x,
                          y: containerPos.y,
                          scale: 0,
                          duration: 132,
                          ease: ' Elastic.Out',
                          onComplete: function () {
                              container.destroy();
                          }
                      });
                  }, 532);
              }
          });
          return container;
      };
      GameUIScene.prototype.createGetCaughtDialog = function (x, y) {
          var scene = this;
          scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63);
          // 你被抓住了 计划从左移动到右 这样的形式进入屏幕 显示
          // 然后发现做不到  Dialog 一定会在屏幕区域内显示
          var popup = scene.rexUI.add.dialog({
              x: 0,
              y: 0,
              background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),
              content: scene.rexUI.add.label({
                  background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                  text: scene.add.text(0, 0, '\nYou get Caught!!\n', {
                      fontSize: '30px'
                  }),
                  space: {
                      left: 15,
                      right: 15,
                      top: 10,
                      bottom: 10
                  }
              }),
              // title: scene.rexUI.add.label({
              //     background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
              //     text: scene.add.text(0, 0, 'Pick a color', {
              //         fontSize: '20px'
              //     }),
              //     space: {
              //         left: 15,
              //         right: 15,
              //         top: 10,
              //         bottom: 10
              //     }
              // }),
              // actions: [
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
              //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
              // ],
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
              .pushIntoBounds();
          //.drawBounds(this.add.graphics(), 0xff0000)
          // .popUp(500);
          // this.tweens.add({
          //     targets: popup,
          //     x: stageWidth/2,
          //     y: stageHeight/2,
          //     duration: 400,
          //     ease: 'Power3',
          //     yoyo: true,
          //     onComplete: () => {
          //     }
          // })
          return popup;
      };
      GameUIScene.prototype.createRexUIButton = function (scene, text, color, space) {
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
      GameUIScene.prototype.addUIBtns = function () {
          var _this = this;
          var settingsClick = function (e) {
              UIHelper.fadeToAddAnotherScene(SETTINGS_SCENE, _this);
              // this.scene.get(SETTINGS_SCENE).cameras.main.fadeIn(0)
              // this.cameras.main.fadeOut(250);
              // if (!this.scene.isActive(SETTINGS_SCENE) &&
              //     !this.scene.isPaused(SETTINGS_SCENE) &&
              //     !this.scene.isSleeping(SETTINGS_SCENE)
              // ) {
              //     this.scene.launch(SETTINGS_SCENE)
              // } else {
              //     if (this.scene.isSleeping(SETTINGS_SCENE)) {
              //         this.scene.wake(SETTINGS_SCENE);
              //     }
              // }
          };
          settingsClick.bind(this);
          this.settingsBtn = new ImageButton(this, 50, 50, 'button-settings', settingsClick);
          this.add.existing(this.settingsBtn);
      };
      return GameUIScene;
  }(Phaser.Scene));
  //# sourceMappingURL=GameUIScene.js.map

  var Point$5 = Phaser.Geom.Point;
  var Rectagle$4 = Phaser.Geom.Rectangle;
  var stageWidth$5 = document.body.clientWidth;
  var stageHeight$5 = document.body.clientWidth / 9 * 16;
  var coinScorePos = new Point$5(210, 50);
  var coinSize = 25;
  var originCoinScale = coinSize / 512;
  var EffectScene = /** @class */ (function (_super) {
      __extends(EffectScene, _super);
      function EffectScene() {
          var _this = _super.call(this, EF_SCENE) || this;
          _this.animationPlaying = {
              hammer: false,
              dropCoin: false,
              addCoin: false,
          };
          return _this;
      }
      EffectScene.prototype.preload = function () {
          // this.load.scenePlugin({
          //     key: 'rexuiplugin',
          //     url: '/rexuiplugin.min.js',
          //     sceneKey: 'rexUI'
          // });
          // this.load.image('coin', 'assets/coin.png');
          // this.load.image('hammer', 'assets/hammer.png');
          // this.load.image('dizzy1', 'assets/dizzy1.png');
          // this.load.image('dizzy2', 'assets/dizzy2.png');
      };
      EffectScene.prototype.create = function () {
          this.createScoreArea();
          this.droppingCoins = [];
          var ground = this.matter.add.image(stageWidth$5 / 2, stageHeight$5, 'ground');
          ground.setStatic(true);
          ground.setScale(2, 0.2);
          // ground.setAngle(10);
          ground.setFriction(0.005);
      };
      EffectScene.prototype.update = function () {
          var _loop_1 = function (idx) {
              var dropCoin = this_1.droppingCoins[idx];
              if (dropCoin && Math.abs(dropCoin.y + coinSize - stageHeight$5) < 15) {
                  // console.log('drop Coin', idx)
                  this_1.droppingCoins.splice(idx--, 1);
                  setTimeout(function () {
                      dropCoin.destroy();
                  }, 632);
              }
              out_idx_1 = idx;
          };
          var this_1 = this, out_idx_1;
          for (var idx = 0; idx < this.droppingCoins.length; idx++) {
              _loop_1(idx);
              idx = out_idx_1;
          }
      };
      EffectScene.prototype.addCoin = function (addScoreCount) {
          var _this = this;
          var coin = this.add.image(stageWidth$5 / 2, stageHeight$5 / 2, 'coin');
          // this.coin.displayWidth = 64
          // this.coin.displayHeight = 64
          // scale 是根据原图的大小而言的。
          coin.setScale(originCoinScale);
          this.animationPlaying.addCoin = true;
          this.tweens.add({
              targets: coin,
              scale: 0.2,
              duration: 132,
              ease: 'Power4',
              onComplete: function () {
                  // cb()
                  _this.tweens.add({
                      targets: coin,
                      x: coinScorePos.x,
                      y: coinScorePos.y,
                      scale: originCoinScale,
                      duration: 332,
                      ease: 'Circ',
                      onComplete: function () {
                          addScoreCount(1);
                          coin.destroy();
                          _this.animationPlaying.addCoin = false;
                      }
                  });
              }
          });
      };
      EffectScene.prototype.addHammer = function (gameScene, addScoreCount) {
          var _this = this;
          if (this.animationPlaying.hammer) {
              return;
          }
          this.animationPlaying.hammer = true;
          var hammerPos = new Point$5(258, 327);
          var dizzyPos = new Point$5(284, 389);
          var AlternativeEmoji = ['sad', 'cry', 'sour'];
          var hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji);
          this.hammer = this.add.image(hammerPos.x, hammerPos.y, 'hammer');
          // this.emojiFace = this.add.image(285,520, hitEmoji)
          // this.emojiFace.setScale(0.3)
          this.hammer.setScale(0.3);
          this.hammer.rotation = 1;
          this.addDizzy(dizzyPos).play(HIT_DIZZY);
          var animationDuration = 232;
          var holdDuration = 332;
          setTimeout(function () {
              gameScene.cameras.main.shake(100, 0.01, true);
              addScoreCount(-1);
              _this.dropACoin();
          }, 332);
          this.tweens.add({
              targets: this.hammer,
              rotation: 1.5,
              duration: animationDuration,
              hold: holdDuration,
              yoyo: true,
              ease: 'Power3',
              onComplete: function () {
                  _this.hammer.destroy();
                  _this.dizzy.destroy();
                  // this.emojiFace.destroy()
                  _this.animationPlaying.hammer = false;
              },
          });
      };
      EffectScene.prototype.addDizzy = function (dizzyPos) {
          this.dizzy = this.add.sprite(dizzyPos.x, dizzyPos.y, 'dizzy1');
          return this.dizzy;
      };
      // 原本这个是放在 UIScene 中的  但是因为addCoin 动画要表现在这里
      // 如果放在 UIScene (UIScene 在层级上最高) Coin会被UIScene 遮住
      EffectScene.prototype.createScoreArea = function () {
          var scoreAreaCenter = new Point$5(stageWidth$5 / 2 + 100, 50);
          var graphicsTopLeft = new Point$5(0 - scoreAreaCenter.x, 0 - scoreAreaCenter.y);
          this.scoreArea = this.add.container(scoreAreaCenter.x, scoreAreaCenter.y);
          var bg = this.add.graphics();
          bg.beginPath();
          bg.fillStyle(MAIN_RED); //yellow
          bg.fillRect(graphicsTopLeft.x, graphicsTopLeft.y, stageWidth$5, 100);
          bg.closePath();
          var scoreBoxWidth = 300;
          var scoreBoxHeight = 66;
          var scoreBoxRadius = scoreBoxHeight / 2;
          var scoreBoxBorder = 10;
          var scoreBoxRectagle = new Rectagle$4((scoreAreaCenter.x - scoreBoxWidth / 2) - scoreAreaCenter.x, (scoreAreaCenter.y - scoreBoxHeight / 2) - scoreAreaCenter.y, scoreBoxWidth, scoreBoxHeight);
          var scoreBox = UIHelper.drawRoundRect(this, scoreBoxRectagle, scoreBoxRadius, MAIN_RED, scoreBoxBorder, MAIN_RED_LIGHT);
          var scoreTitlePos = new Point$5(scoreAreaCenter.x - 50, scoreAreaCenter.y);
          var scoreTitle = this.add.text(scoreTitlePos.x - scoreAreaCenter.x, scoreTitlePos.y - scoreAreaCenter.y, 'score:', { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' });
          scoreTitle.setOrigin(0.5);
          var scorePos = new Point$5(scoreAreaCenter.x + 0, scoreAreaCenter.y);
          var scoreText = this.scoreText = this.add.text(scorePos.x - scoreAreaCenter.x, scorePos.y - scoreAreaCenter.y, '0', { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' });
          scoreText.setOrigin(0.5);
          this.scoreArea.add([bg, scoreBox, scoreTitle, scoreText]);
          var coinIcon = this.add.image(coinScorePos.x, coinScorePos.y, 'coin');
          coinIcon.setScale(originCoinScale);
          return this.scoreArea;
      };
      EffectScene.prototype.dropACoin = function () {
          var dropCoin = this.matter.add.image(coinScorePos.x, coinScorePos.y, 'coin');
          dropCoin.setScale(originCoinScale);
          this.droppingCoins.push(dropCoin);
          dropCoin.setCircle(coinSize / 2);
          dropCoin.setFriction(0.005);
          dropCoin.setBounce(0.6);
          dropCoin.setVelocityX(1);
          dropCoin.setAngularVelocity(0.15);
      };
      return EffectScene;
  }(Phaser.Scene));
  //# sourceMappingURL=EffectScene.js.map

  var stageWidth$6 = document.body.clientWidth;
  var stageHeight$6 = document.body.clientWidth / 9 * 16;
  var BaseScene = /** @class */ (function (_super) {
      __extends(BaseScene, _super);
      function BaseScene() {
          return _super.call(this, BASE_SCENE) || this;
      }
      BaseScene.prototype.init = function () {
      };
      BaseScene.prototype.preload = function () {
          // this.load.scenePlugin({
          //     key: 'rexuiplugin',
          //     url: '/rexuiplugin.min.js',
          //     sceneKey: 'rexUI'
          // });
          window.WebFont.load({ custom: { families: ['Berlin'], urls: ['assets/fonts/BRLNSDB.css'] } });
          this.scene.start(ASSETS_SCENE);
      };
      BaseScene.prototype.create = function () {
          // this.scene.launch(UI_SCENE).start();
          // this.scene.launch(EF_SCENE);        
          // this.scene.launch(UI_SCENE)
          // this.scene.launch(UI_SCENE).start();
          // this.scene.launch(EF_SCENE);
          // this.dialogScene.showWelcome()
          // this.effScene.addHammer()
          // this.dialogScene = this.scene.get(UI_SCENE) as UIScene
          // this.effScene = this.scene.get(EF_SCENE) as EffectScene
          // 此刻调用提示 rexUI undefined
          // this.dialogScene.createGetCaughtDialog(stageWidth/2, stageHeight/2) 
      };
      return BaseScene;
  }(Phaser.Scene));
  //# sourceMappingURL=BaseScene.js.map

  // import { DOGCOOK } from "../constants";
  var AssetsScene = /** @class */ (function (_super) {
      __extends(AssetsScene, _super);
      function AssetsScene() {
          return _super.call(this, ASSETS_SCENE) || this;
      }
      AssetsScene.prototype.preload = function () {
          var _this = this;
          this.addLoadingProgressUI();
          this.load.on('progress', function (value) {
              value = value.toFixed(2);
              _this.percentText.setText(value * 100 + '%');
              _this.progressBar.clear();
              _this.progressBar.fillStyle(0xffde00, 1);
              _this.progressBar.fillRect(stageWidth / 2 - 150, stageHeight / 2, 300 * value, 30);
          });
          // not work
          this.load.on('fileprogress', function (file, value) {
              _this.assetText.setText('Loading asset: ' + file.key);
          });
          this.load.on('complete', function () {
              _this.progressBar.destroy();
              // this.progressBox.destroy();
              _this.loadingText.destroy();
              _this.percentText.destroy();
              _this.assetText.destroy();
          });
          this.loadUIAssets();
          this.loadPics();
          this.loadEmojiAssets();
          this.loadDogeAnimationAssets();
          this.loadMusic();
      };
      AssetsScene.prototype.create = function () {
          // 这些逻辑不能放在 index.ts 中  因为他们需要资源加载完成之后才能加载      
          this.scene["switch"](GAME_SCENE);
      };
      AssetsScene.prototype.addLoadingProgressUI = function () {
          this.bgColor = this.add.graphics();
          this.bgColor.beginPath();
          // this.bgColor.strokeRoundedRect(0, 0, stageWidth, stageHeight, 20)
          this.bgColor.fillStyle(0xeeeeee);
          this.bgColor.fillRoundedRect(0, 0, stageWidth, stageHeight, 20);
          this.bgColor.closePath();
          this.progressBar = this.add.graphics();
          this.loadingText = this.make.text({
              x: stageWidth / 2 - 50,
              y: stageHeight / 2 - 50,
              text: 'Loading... ',
              style: {
                  font: '18px monospace',
                  fill: '#666666'
              }
          }).setOrigin(0.5);
          this.percentText = this.make.text({
              x: stageWidth / 2 + 50,
              y: stageHeight / 2 - 50,
              text: '0%',
              style: {
                  font: '18px monospace',
                  fill: '#666666'
              }
          }).setOrigin(0.5);
          this.assetText = this.make.text({
              x: stageWidth / 2,
              y: stageHeight / 2 + 150,
              text: '',
              style: {
                  font: '18px monospace',
                  fill: '#666666'
              }
          }).setOrigin(0.5);
      };
      AssetsScene.prototype.loadPics = function () {
          var scene = this;
          // yarn run dev 的时候 这个资源也还是从 dist 中读取的
          scene.load.image('bgImg', 'assets/kitchen.png');
          scene.load.image('table', 'assets/table.png');
          scene.load.image('light', 'assets/light.png');
          scene.load.image('food0', 'assets/food/010-grapes.png');
          scene.load.image('food1', 'assets/food/001-burger.png');
          scene.load.image('food2', 'assets/food/001-ice-cream.png');
          scene.load.image('food3', 'assets/food/002-burger-1.png');
          scene.load.image('food4', 'assets/food/002-ice-cream-1.png');
          scene.load.image('food5', 'assets/food/003-french-fries.png');
          scene.load.image('food6', 'assets/food/003-ice-cream-2.png');
          scene.load.image('food7', 'assets/food/004-fried-egg.png');
          scene.load.image('food8', 'assets/food/004-ice-cream-stick.png');
          scene.load.image('food9', 'assets/food/005-bottle.png');
          scene.load.image('food10', 'assets/food/006-banana.png');
          scene.load.image('food11', 'assets/food/007-orange.png');
          scene.load.image('food12', 'assets/food/008-orange-1.png');
          scene.load.image('food13', 'assets/food/009-apple.png');
          scene.load.image('plate', 'assets/plate.png');
          scene.load.image('coin', 'assets/coin.png');
          scene.load.image('hammer', 'assets/hammer.png');
          scene.load.image('dizzy1', 'assets/dizzy1.png');
          scene.load.image('dizzy2', 'assets/dizzy2.png');
          scene.load.image('ground', 'assets/ground.png');
          // // 应当使用 gif 中的某一帧
          // // scene.load.image('dogcook', 'assets/back.png');
          scene.load.image(DOGCOOK, "assets/dogeFrame/frame_00_delay-0.04s.gif");
      };
      AssetsScene.prototype.loadDogeAnimationAssets = function () {
          var scene = this;
          var endIndex = 47;
          for (var idx = 0; idx <= endIndex; idx++) {
              var idxStr = (idx < 10) ? '0' + idx : '' + idx;
              var fname = "assets/dogeFrame/frame_" + idxStr + "_delay-0.04s.gif";
              var keyname = "dogeFrame" + idx;
              scene.load.image(keyname, fname);
          }
      };
      AssetsScene.prototype.loadEmojiAssets = function () {
          var scene = this;
          scene.load.image('sad', "assets/sad.png");
          scene.load.image('cry', "assets/cry.png");
          scene.load.image('sour', "assets/sour.png");
      };
      AssetsScene.prototype.loadUIAssets = function () {
          var scene = this;
          // let loadFn = scene.load.spritesheet
          // loadFn.apply(scene.load, ['button-sound-on', `assets/UI/button-sound-on.png`, { frameWidth: 80, frameHeight: 80 }])
          // loadFn.apply(scene.load, ['button-sound-off', `assets/UI/button-sound-off.png`, { frameWidth: 80, frameHeight: 80 }])
          // loadFn.apply(scene.load, ['button-settings', `assets/UI/button-settings.png`, { frameWidth: 80, frameHeight: 80 }])
          scene.load.image('background', 'assets/UI/background.png');
          scene.load.spritesheet('button-sound-on', "assets/UI/button-sound-on.png", { frameWidth: 80, frameHeight: 80 });
          scene.load.spritesheet('button-sound-off', "assets/UI/button-sound-off.png", { frameWidth: 80, frameHeight: 80 });
          scene.load.spritesheet('button-music-on', "assets/UI/button-music-on.png", { frameWidth: 80, frameHeight: 80 });
          scene.load.spritesheet('button-music-off', "assets/UI/button-music-off.png", { frameWidth: 80, frameHeight: 80 });
          scene.load.spritesheet('button-back', "assets/UI/button-back.png", { frameWidth: 70, frameHeight: 70 });
          scene.load.spritesheet('button-settings', "assets/UI/button-settings.png", { frameWidth: 80, frameHeight: 80 });
      };
      AssetsScene.prototype.loadMusic = function () {
          var scene = this;
          scene.load.audio(SOUNDKEY, ['assets/audio/audio-button.m4a', 'assets/audio/audio-button.mp3', 'assets/audio/audio-button.ogg']);
          scene.load.audio(MUSICKEY, ['assets/audio/music-bitsnbites-liver.m4a', 'assets/audio/music-bitsnbites-liver.mp3', 'assets/audio/music-bitsnbites-liver.ogg']);
      };
      return AssetsScene;
  }(phaser.Scene));
  //# sourceMappingURL=AssetsScene.js.map

  var fontTitleStyle = { font: '46px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 7, align: 'center' };
  var fontSettingsStyle = { font: '38px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 5, align: 'center' };
  var frameHeight = 80;
  var settingsLeft = stageWidth / 2 - 120;
  var SettingsScene = /** @class */ (function (_super) {
      __extends(SettingsScene, _super);
      function SettingsScene() {
          return _super.call(this, SETTINGS_SCENE) || this;
      }
      SettingsScene.prototype.preload = function () {
      };
      SettingsScene.prototype.create = function () {
          this.cameras.main.fadeIn(0);
          this.bindEvents();
          this.createBackground();
          this.createTitle();
          this.createSoundBtn();
          this.createMusicBtn();
          this.createBackBtn();
      };
      SettingsScene.prototype.bindEvents = function () {
          var _this = this;
          this.events.on('wake', function () {
              _this.cameras.main.fadeIn(0);
          }, this);
      };
      SettingsScene.prototype.createBackground = function () {
          this.add.sprite(0, 0, BACKGROUND).setOrigin(0, 0);
      };
      SettingsScene.prototype.createTitle = function () {
          // text 的默认origin 是 0 0
          var settingsText = this.add.text(stageWidth / 2, 50, 'settings', fontTitleStyle);
          settingsText.setOrigin(0.5, 0.5);
      };
      SettingsScene.prototype.createBackBtn = function () {
          var _this = this;
          var backClick = function () {
              GameSoundManager.playSound();
              UIHelper.fadeToPrevScene(GAMEUI_SCENE, _this);
              // this.scene.get(UI_SCENE).cameras.main.fadeIn(0)
              // this.cameras.main.fadeOut(250);
              // this.time.addEvent({
              //     delay: 250,
              //     callback: function () {
              //         this.scene.sleep(SETTINGS_SCENE);
              //     },
              //     callbackScope: this                    
              // })
          };
          this.backBtn = new ImageButton(this, 50, 50, 'button-back', backClick);
          this.add.existing(this.backBtn);
      };
      SettingsScene.prototype.createSoundBtn = function () {
          var _this = this;
          var clickSound = function () {
              GameSoundManager.toggleSoundMode();
              if (GameSoundManager.soundMode) {
                  _this.textSound.text = 'Sound: OFF';
              }
              else {
                  _this.textSound.text = 'Sound: ON!';
              }
          };
          var soundHeight = 150;
          this.soundBtn = new ImageButton(this, settingsLeft, soundHeight, 'button-sound-on', clickSound);
          this.textSound = this.add.text(settingsLeft + frameHeight / 2, soundHeight, 'Sound: ON!', fontSettingsStyle);
          this.textSound.setOrigin(0, 0.5);
          this.add.existing(this.soundBtn);
      };
      SettingsScene.prototype.createMusicBtn = function () {
          var _this = this;
          var clickMusic = function () {
              GameSoundManager.toogleMusicMode();
              if (!GameSoundManager.musicMode) {
                  _this.textMusic.text = 'Music: OFF';
              }
              else {
                  _this.textMusic.text = 'Music: ON!';
              }
          };
          var musicHeight = 250;
          this.musicBtn = new ImageButton(this, settingsLeft, musicHeight, 'button-music-on', clickMusic);
          this.textMusic = this.add.text(settingsLeft + frameHeight / 2, musicHeight, 'Music: ON!', fontSettingsStyle);
          this.textMusic.setOrigin(0, 0.5);
          this.add.existing(this.musicBtn);
      };
      return SettingsScene;
  }(Phaser.Scene));

  console.log(Phaser.AUTO);
  console.log(Phaser.AUTO);
  // import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
  var canvasELlem = document.querySelector('#gameCanvas');
  var stageWidth$7 = document.body.clientWidth;
  var stageHeight$7 = document.body.clientWidth / 9 * 16;
  var documentWidth = document.body.clientWidth;
  var documentHeight = document.body.clientHeight;
  canvasELlem.style.top = (documentHeight - stageHeight$7) / 2 + "px";
  var config = {
      canvas: canvasELlem,
      type: Phaser.WEBGL,
      // parent: 'phaser-example',
      width: stageWidth$7,
      height: stageHeight$7,
      scene: [BaseScene, AssetsScene, Demo, EffectScene, GameUIScene, SettingsScene],
      transparent: true,
      physics: {
          "default": 'matter',
          matter: {
              debug: false,
              enableSleeping: true
          }
      },
  };
  var game = new Phaser.Game(config);
  console.log(game.scene.isSleeping(BASE_SCENE));
  changeMouth();
  setPreview();
  testClickEvent(game);
  //# sourceMappingURL=index.js.map

}(Phaser));
//# sourceMappingURL=game.js.map
