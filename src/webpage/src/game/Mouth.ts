
import * as PIXI from 'pixi.js'
import { Vector2 } from '@game/Vector'
import { FaceData } from '@root/faceData';


const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;



class Mouth extends PIXI.Graphics {
    // 适用于特征点
    leftPos: Vector2 = new Vector2(0, 0)
    rightPos: Vector2 = new Vector2(0, 0)
    bottomPos: Vector2 = new Vector2(0, 0)

    // 适用于轮廓线
    lowerLipBottom: Vector2[] = []
    lowerLipTop: Vector2[] = []
    upperLipTop: Vector2[] = [] // 上嘴唇有 11 个点  其他都是 9个点
    upperLipBottom: Vector2[] = []

    mouthRect: PIXI.Rectangle

    openThreshold: number = 90

    points: Vector2[]

    // constructor(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2) {
    //     super()
    //     this.leftPos = leftPos
    //     this.rightPos = rightPos
    //     this.bottomPos = bottomPos
    // }
    constructor(points: Vector2[]) {
        super()
        this.points = points

        if (window.navigator.userAgent.indexOf("ONEPLUS") == -1) {
            this.openThreshold = 0

        }
    }


    refreshByNewContours(face: FaceData) {
        this.clear()
        this.lowerLipBottom = face.lowerLipBottom
        this.lowerLipTop = face.lowerLipTop
        this.upperLipTop = face.upperLipTop
        this.upperLipBottom = face.upperLipBottom


        this.points = [...face.lowerLipBottom, ...face.lowerLipTop, ...face.upperLipTop, ...face.upperLipBottom]
        // this.beginFill(0xFF0000, 1);
        this.lineStyle(5, 0xFF0000, 1);

        let idx = 0;
        for (let p of this.points) {
            if (idx == 0) {
                this.moveTo(p.x, p.y)
            }
            this.lineTo(p.x, p.y);
            idx++
        }
        this.calcMouthRect()
        // this.endFill();
    }

    refreshByNewPoint(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2) {
        this.clear()
        this.leftPos = leftPos
        this.rightPos = rightPos
        this.bottomPos = bottomPos
        this.beginFill(0xFF0000, 1);
        this.lineStyle(0, 0xFF0000, 1);
        this.moveTo(rightPos.x, rightPos.y);
        this.lineTo(leftPos.x, leftPos.y);
        this.lineTo(bottomPos.x, bottomPos.y);


        //draw Top Line & bottom Line
        this.beginFill(0x00FF00, 1)
        this.lineStyle(3, 0x00FF00, 1);
        this.moveTo(rightPos.x, rightPos.y - 100)
        this.lineTo(rightPos.x, rightPos.y + 100)

        this.endFill();
    }

    calcMouthRect() {
        let topY = 0
        let bottomY = 0
        let upperY = this.upperLipTop.map((v: Vector2) => {
            return v.y
        })

        let lowerY = this.lowerLipBottom.map((v: Vector2) => {
            return v.y
        })

        topY = Math.min(...upperY)
        bottomY = Math.max(...lowerY)

        let top = topY
        let left = this.upperLipTop[0].x
        let right = this.upperLipTop[10].x
        let width = right - left;
        let height = bottomY - topY


        this.mouthRect = new PIXI.Rectangle(left, top, width, height)
        topY = Math.min(...upperY) - 100
        return topY
    }

    getMouthRect(): PIXI.Rectangle {
        return this.mouthRect
    }


    // https://firebase.google.com/docs/ml-kit/images/examples/face_contours.svg
    getMouthCenter() {
        if (this.upperLipTop.length == 0) {
            return
        }
        const avg = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

        let x = avg([this.upperLipTop[4].x, this.upperLipTop[5].x, this.upperLipTop[6].x])
        let y = avg([this.upperLipTop[5].y, this.upperLipBottom[4].y, this.lowerLipTop[4].y, this.lowerLipBottom[4].y])
        return new Vector2(x, y)
    }

    checkOpenRs() {
        let bottomY = Math.max(Math.max(this.leftPos.y, this.rightPos.y), this.bottomPos.y)
        let topY = Math.min(this.leftPos.y, this.rightPos.y)
        return {
            rs: bottomY - topY > this.openThreshold,
            val: bottomY - topY
        }
    }

    checkMouthOpenByContour() {
        if (!this.mouthRect) {
            return {
                rs: false
            }
        }


        return {
            rs: this.mouthRect.height > this.openThreshold,
            // rs: true,
            val: this.mouthRect.height
        }
    }

    isNearMouth(food: Vector2) {
        let rect = this.mouthRect
        if ((food.y < rect.top + rect.height + 100) && (food.y > rect.top - 100)) {
            return true
        } else {
            return false
        }
    }

    missedFood(food: Vector2) {
        let rect = this.mouthRect
        return (food.y > rect.top + rect.height + 100)
    }
}

export default Mouth