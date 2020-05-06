import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import VConsole from "vconsole";
import { FaceData, Bounds } from "./faceData";
import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW } from '@root/constants';

// 使用 namespace 定义的类型可以直接用
import Coco = MyName.Coco

// 使用 module 定义的一定要 import 才能用
import { PIPI } from "./types/myModule";

var offsetXPreview = 170
var offsetYPreview = 250
var previewWidth = 198
var previewHeight = previewWidth * 16 / 9

export { changeMouth, setPreview }

// 给坐标加上取景器的偏移信息
// 原本的坐标信息是人脸相对取景器的位置
// 现在坐标信息变为相对整个画布的位置
function addOffsetForFaceData(target) {
  const checkedType = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
  //判断拷贝的数据类型
  //初始化变量result 成为最终克隆的数据
  let result
  let targetType = checkedType(target)
  if (targetType === 'Object') {
    result = {}
  } else if (targetType === 'Array') {
    result = []
  } else {
    return target
  }
  //遍历目标数据
  for (let [key, value] of Object.entries(target)) {
    //获取遍历数据结构的每一项值。
    // let value = target[key]
    //判断目标结构里的每一值是否存在对象/数组
    if (checkedType(value) === 'Object' ||
      checkedType(value) === 'Array') { //对象/数组里嵌套了对象/数组
      //继续遍历获取到value值
      result[key] = addOffsetForFaceData(value)
    } else { //获取到value值是基本的数据类型或者是函数。

      if (key == "x") {
        result[key] = offsetXPreview + (value as number)

      } else if (key == "y") {
        result[key] = offsetYPreview + (value as number)

      } else {
        result[key] = value;

      }
    }
  }
  return result
}
// set preview area

function setPreview() {

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.postMessage({
        messageType: MSG_TYPE_CAM,
        previewArea: {
          y: offsetYPreview,
          x: offsetXPreview,
          width: previewWidth,
          height: previewHeight
        },
      }, "*")
    }, 100)

  }, false)


}


// 测试嘴巴位置
function changeMouth(game: Phaser.Game) {

  //contours sample data
  window.addEventListener("load", () => {
    let offsetSpeed = 3


    let movingFaceBounds = (bounds: Bounds, dir: number) => {
      let offset = 0
      // dir 0下 1左 2上 3右

      if (dir == 0 || dir == 2) {
        offset = dir == 2 ? -offsetSpeed : offsetSpeed
        bounds.origin.y = bounds.origin.y + offset
      } else {
        offset = dir == 1 ? -offsetSpeed : offsetSpeed
        bounds.origin.x = bounds.origin.x + offset
      }
    }
    let movingYPoints = (points: Point[], dir) => {
      // dir 0下 1左 2上 3右

      let offset = 0
      if (dir == 2) {
        offset = -offsetSpeed
      } else {
        offset = offsetSpeed
      }

      for (let p of points) {
        p.y = p.y + offset
      }
    }

    let movingXPoints = (points: Point[], dir) => {
      let offset = 0
      if (dir == 1) {
        offset = -offsetSpeed
      } else {
        offset = offsetSpeed
      }


      for (let p of points) {
        p.x = p.x + offset
      }
    }

    let moveFace = (oneFace: FaceData, dir: number) => {
      // dir 0下 1左 2上 3右
      if (dir == 0 || dir == 2) {
        movingYPoints(oneFace.lowerLipBottom, dir)
        movingYPoints(oneFace.lowerLipTop, dir)
        movingYPoints(oneFace.upperLipBottom, dir)
        movingYPoints(oneFace.upperLipTop, dir)
        movingFaceBounds(oneFace.bounds, dir)
      } else {
        movingXPoints(oneFace.lowerLipBottom, dir)
        movingXPoints(oneFace.lowerLipTop, dir)
        movingXPoints(oneFace.upperLipBottom, dir)
        movingXPoints(oneFace.upperLipTop, dir)
        movingFaceBounds(oneFace.bounds, dir)
      }
    }


    // 这个数据是和取景器大小有关的数据 
    // 当 RN 的部分设置了取景器大小的时候, 返回的脸的位置也根据 RN 这里的实际尺寸有所压缩
    // 但是和取景器的位移无关  毕竟安卓端也不知道取景器的相对位置
    fetch('/assets/sampleContours.json').then(resp => {
      return resp.json()
    }).then(data => {
      new VConsole();


      // 在PC上调试
      if (window.navigator.userAgent.indexOf("ONEPLUS") == -1) {
        let oneFace: FaceData = data[0]
        let i = 0

        let changeDir = 0  // 0下 1上 2左 3右
        setInterval(() => {
          if (i++ == 2) {
            i = 0
            changeDir = (++changeDir) % 4
          }

          moveFace(oneFace, changeDir)
          let afterOffsetForFaceData = addOffsetForFaceData(oneFace)

          window.postMessage({
            messageType: 'face',
            faceData: afterOffsetForFaceData
          }, "*")

        }, 100)
      }


    })
  }, false)


  // let points = [{x:100, y:500}, {x:200, y:600}, {x:100, y:600}, {x:200, y:600}]


}
