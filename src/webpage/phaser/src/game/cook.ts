
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;

import { DOGLOOK, DOGCOOK } from '@root/constants'

export default class Cook extends Image  {
    checking: boolean  //回头观察
    cooking: boolean
    image: Image
    constructor(scene: Phaser.Scene, x: number, y: number, ) {
        let textureName = DOGCOOK
        super(scene, x, y, textureName, 0)
        // scene.add.image(this)
        // let img = new Image(scene,x,y,texture);
        scene.children.add(this);
    }   

    setOriginToTopLeft(){
        this.setOrigin(0,0)
    }

    

    lookBack() {
        this.setTexture('doglook', 0)
        this.checking = true
        this.cooking = false
    }

    cookAgain() {
        this.setTexture('dogcook', 0)
        this.checking = false
        this.cooking = true
    }
    
    isCooking(): boolean {
        return this.cooking
    }
}