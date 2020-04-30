

import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import { Bounds } from "@root/faceData";
import { Scene } from "phaser";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;


export default class CamFaceCheck {
    public camPreviewArea:Rectagle = new Rectagle(0,0,0,0)
    public faceRect: Graphics
    public previewRect: Graphics
    public facePosText: PhaserText

    public scene: Scene
    constructor(scene?: Scene){
        this.scene = scene
        this.faceRect = scene.add.graphics()
        this.previewRect = scene.add.graphics()
        this.facePosText = scene.add.text(stageWidth - 100, 50, 'Hello World', { fontFamily: '"Roboto Condensed"' });        
    }

    // check if face is in the center of preview
    checkFacePosition(faceBounds: Bounds) {
        if (faceBounds) {
            let minFaceX = faceBounds.origin.x
            let maxFaceX = faceBounds.origin.x + faceBounds.size.width

            let minFaceY = faceBounds.origin.y
            let maxFaceY = faceBounds.origin.y + faceBounds.size.height
            
            this.drawFaceBounds(faceBounds)
            this.drawPreviewBounds(this.camPreviewArea)
            let minPreviewX = this.camPreviewArea.x
            let maxPreviewX = this.camPreviewArea.x + this.camPreviewArea.width            
            let minPreviewY = this.camPreviewArea.y
            let maxPreviewY = this.camPreviewArea.y + this.camPreviewArea.height



            let paddingLeft = minFaceX - minPreviewX
            let paddingRight = maxPreviewX - maxFaceX
            let paddingTop = maxFaceX - minPreviewX
            let paddingBottom = maxPreviewY - maxFaceY

            // this.facePosText.text = `${paddingLeft.toFixed(2)} --- ${paddingRight.toFixed(2)}`
            if (paddingLeft/paddingRight > 1.5) {
                this.facePosText.text = 'to right slightly'
            } else if (paddingRight/paddingLeft > 1.5) {
                this.facePosText.text = 'to right slightly'
            } else {
                this.facePosText.text = 'Hold your phone!'
            }

        }

    }

    drawPreviewBounds(previewRect: Rectagle) {
        this.previewRect.clear()
        this.previewRect.lineStyle(5, 0x00FFFF, 1.0);
        this.previewRect.beginPath();        

        let minPreviewX = previewRect.x
        let maxPreviewX = previewRect.x + previewRect.width
        let minPreviewY = previewRect.y
        let maxPreviewY = previewRect.y + previewRect.height

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
        this.previewRect.closePath();
        this.previewRect.strokePath();   
    }
    drawFaceBounds(faceBounds: Bounds){
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
        for (let p of points ) {
            if (idx == 0) {
                this.faceRect.moveTo(p.x, p.y);
            } else {
                this.faceRect.lineTo(p.x, p.y);
            }
            idx++
        }
        this.faceRect.closePath();
        this.faceRect.strokePath();        

    }
    setCameraArea(camPreviewArea: Rectagle){
        this.camPreviewArea = camPreviewArea
    }
}
