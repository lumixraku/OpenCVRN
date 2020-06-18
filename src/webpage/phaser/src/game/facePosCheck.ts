

import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Vector2 = Phaser.Math.Vector2;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import { Bounds } from "@root/faceData";
import { Scene, Tilemaps } from "phaser";
import { MSG_TYPE_FACE_TARGET_POS } from "@root/constants";

import {stageWidth, stageHeight} from '@root/constants';

interface FaceInCircle {
    pass: boolean
    bounds: Bounds
}
export { FaceInCircle }

export default class CamFaceCheck {
    public facePoint: Point[]
    public faceBounds: Bounds
    public faceRect: Graphics


    public camPreviewArea: Rectagle
    public firstSetCamPreviewArea: Rectagle
    public previewRect: Graphics
    
    
    public facePosText: PhaserText


    // 第一次被认为 OK 的脸部位置
    // 之后人脸应该试图保持在这个位置
    public targetFaceBounds: Bounds
    public faceCenterPos: Vector2

    public scene: Scene
    constructor(scene?: Scene) {
        this.scene = scene
        this.faceRect = scene.add.graphics()
        this.previewRect = scene.add.graphics()
        this.facePosText = scene.add.text(stageWidth - 100, 250, '', { fontFamily: '"Roboto Condensed"' });
    }

    refreshFacePosition(faceBounds: Bounds, facePoints: Point[]) {
        this.faceBounds = faceBounds 

        let centerX = faceBounds.origin.x + faceBounds.size.width/2
        let centerY = faceBounds.origin.y + faceBounds.size.height/2

        this.faceCenterPos = new Vector2(centerX, centerY)
    }

    // check if face is in the center of preview
    // private 
    checkFacePosition(faceBounds: Bounds) {
        let rs: FaceInCircle = {
            pass: false,
            bounds: null
        }
        if (!this.camPreviewArea) {
            return rs
        }        
        if (faceBounds) {
            let minFaceX = faceBounds.origin.x
            let maxFaceX = faceBounds.origin.x + faceBounds.size.width

            let minFaceY = faceBounds.origin.y
            let maxFaceY = faceBounds.origin.y + faceBounds.size.height

            this.drawFaceBounds(faceBounds)
            // this.drawPreviewBounds(this.camPreviewArea)
            let minPreviewX = this.camPreviewArea.x
            let maxPreviewX = this.camPreviewArea.x + this.camPreviewArea.width
            let minPreviewY = this.camPreviewArea.y
            let maxPreviewY = this.camPreviewArea.y + this.camPreviewArea.height

            let paddingLeft = minFaceX - minPreviewX
            let paddingRight = maxPreviewX - maxFaceX
            let paddingTop = maxFaceX - minPreviewX
            let paddingBottom = maxPreviewY - maxFaceY

            // this.facePosText.text = `${paddingLeft.toFixed(2)} --- ${paddingRight.toFixed(2)}`

            if (paddingLeft / paddingRight > 2) {
                this.facePosText.text = 'to right slightly'
            } else if (paddingRight / paddingLeft > 2) {  
                this.facePosText.text = 'to left slightly'
            } else {
                this.facePosText.text = 'Hold your phone!'
                return {
                    pass: true,
                    bounds: faceBounds
                }
            }


        }
        return rs

    }

    drawPreviewBounds(previewCamArea: Rectagle) {
        if (!previewCamArea) {
            return
        }

        this.previewRect.clear()
        this.previewRect.lineStyle(5, 0x00FFFF, 1.0);
        this.previewRect.beginPath();

        let minPreviewX = previewCamArea.x
        let maxPreviewX = previewCamArea.x + previewCamArea.width
        let minPreviewY = previewCamArea.y
        let maxPreviewY = previewCamArea.y + previewCamArea.height

        let points = [
            new Point(minPreviewX, minPreviewY), new Point(maxPreviewX, minPreviewY),
            new Point(maxPreviewX, maxPreviewY), new Point(minPreviewX, maxPreviewY)
        ]


        let idx = 0
        for (let p of points) {
            if (idx == 0) {
                this.previewRect.moveTo(p.x, p.y);
            } else {
                this.previewRect.lineTo(p.x, p.y);
            }
            idx++
        }

        let centerX = previewCamArea.x + previewCamArea.width/2
        let centerY = previewCamArea.y + previewCamArea.height/2
        this.previewRect.fillStyle(0x00FFFF)
        this.previewRect.fillRect(centerX,centerY,10,10); 

        this.previewRect.closePath();
        this.previewRect.strokePath();
    }



    drawFaceBounds(faceBounds: Bounds) {
        this.faceRect.clear()
        this.faceRect.lineStyle(5, 0xFF00FF, 1.0);
        this.faceRect.beginPath();

        let minFaceX = faceBounds.origin.x
        let maxFaceX = faceBounds.origin.x + faceBounds.size.width

        let minFaceY = faceBounds.origin.y
        let maxFaceY = faceBounds.origin.y + faceBounds.size.height
        let points = [
            new Point(minFaceX, minFaceY), new Point(maxFaceX, minFaceY),
            new Point(maxFaceX, maxFaceY), new Point(minFaceX, maxFaceY)
        ]
        let idx = 0
        for (let p of points) {
            if (idx == 0) {
                this.faceRect.moveTo(p.x, p.y);
            } else {
                this.faceRect.lineTo(p.x, p.y);
            }
            idx++
        }

        let centerX = faceBounds.origin.x + faceBounds.size.width/2
        let centerY = faceBounds.origin.y + faceBounds.size.height/2

        this.faceRect.fillStyle(0xFF00FF)
        this.faceRect.fillRect(centerX,centerY,10,10); 

        this.faceRect.closePath();
        this.faceRect.strokePath();

    }
    setCameraArea(camPreviewArea: Rectagle) {
        this.camPreviewArea = camPreviewArea
        if (!this.firstSetCamPreviewArea) {
            this.firstSetCamPreviewArea = new Rectagle(0,0,0,0)
            this.firstSetCamPreviewArea.x = this.camPreviewArea.x
            this.firstSetCamPreviewArea.y = this.camPreviewArea.y
            this.firstSetCamPreviewArea.width = this.camPreviewArea.width
            this.firstSetCamPreviewArea.height = this.camPreviewArea.height
        }
    }


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

    getTargetFaceBounds(): Bounds {
        return this.faceBounds
    }

    updatePreviewPosByTarget(){
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

    }
}
