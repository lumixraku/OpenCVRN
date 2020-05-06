
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;


export default class Cook extends Image {
    checking: boolean  //回头观察

    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame)
    }   

    setOriginToTopLeft(){
        this.setOrigin(0,0)
    }

    

    lookBack() {
        this.setTexture('dogback', 0)
        this.checking = true
    }

    cookAgain() {
        this.setTexture('dog', 0)
        this.checking = false
    }
    
    isCookChecking(): boolean {
        return this.checking
    }
}