
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;

import { DOGLOOK, DOGCOOK, CHECKING_INTERVAL, DOG_LOOKBACK_ANIMI } from '@root/constants'


// Phaser.Sprite 中可以 play 动画
// 但是 Phaser.Image 不行
export default class Cook extends Sprite  {
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
        this.play(DOG_LOOKBACK_ANIMI)
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

    // createAnimate() {
    //     this.anims.create({
    //         key: 'snooze',
    //         frames: [
    //             { key: 'cat1' },
    //             { key: 'cat2' },
    //             { key: 'cat3' },
    //             { key: 'cat4', duration: 50 }
    //         ],
    //         frameRate: 8,
    //         repeat: -1
    //     });


    // }
}