
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;

import { DOGLOOK, DOGCOOK, CHECKING_INTERVAL } from '@root/constants'

export default class Cook extends Image  {
    checking: boolean;  //回头观察
    private cooking: boolean = true;
    image: Image;
    constructor(scene: Phaser.Scene, x: number, y: number, ) {
        super(scene, x, y, DOGCOOK, 0)
        // scene.add.image(0, 0, 'dog', 0)
        // let img = new Image(scene,x,y,texture);
        // scene.children.add(this);
        scene.add.existing(this)
        
    }   
    
    setOriginToTopLeft(){
        this.setOrigin(0,0)
    }

    
    private startCheckingTime: number
    private endCheckingTime: number
    lookBack() {
        this.setTexture('doglook', 0)
        this.checking = true
        this.cooking = false
        this.startCheckingTime = +new Date
    }




    cookAgain() {
        this.setTexture('dogcook', 0)
        this.checking = false
        this.cooking = true
        this.endCheckingTime =+new Date
        console.log("looking back", this.endCheckingTime - this.startCheckingTime )
    }
    
    isCooking(): boolean {
        return this.cooking
    }

    //是否刚刚回头过
    ifJustChecked(): boolean {
        
        let timeGap = +new Date - this.endCheckingTime
        return (timeGap < CHECKING_INTERVAL) 
    }
}