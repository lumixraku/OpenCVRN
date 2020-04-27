import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import VConsole from "vconsole";
import { FaceData } from "./faceData";

// 使用 namespace 定义的类型可以直接用
import Coco = MyName.Coco

// 使用 module 定义的一定要 import 才能用
import { PIPI } from "./types/myModule";

// 测试嘴巴位置
export default function changeMouth(game: Phaser.Game) {

  //contours sample data
  window.addEventListener("load", () => {

    let movingDown= (points: Point[]) => {
      for( let p of points) {
        p.y = p.y += 1
      }
    }


    fetch('/assets/sampleContours.json').then(resp => {
      return resp.json()
    }).then(data => {
      new VConsole();


      // 在PC上调试
      if (window.navigator.userAgent.indexOf("ONEPLUS") == -1) {
        let oneFace: FaceData = data[0]
        let i = 0
        setInterval(() => {
          movingDown(oneFace.lowerLipBottom)
          movingDown(oneFace.lowerLipTop)
          movingDown(oneFace.upperLipBottom)
          movingDown(oneFace.upperLipTop)
          window.postMessage(oneFace, "*")

        }, 100)
      }


    })
  }, false)

  // let points = [{x:100, y:500}, {x:200, y:600}, {x:100, y:600}, {x:200, y:600}]


}