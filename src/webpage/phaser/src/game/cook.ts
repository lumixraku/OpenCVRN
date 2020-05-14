
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import { DOGLOOK, DOGCOOK, CHECKING_INTERVAL, COOK_LOOKBACK_ANIMI, COOK_TOCOOK_ANIMI } from '@root/constants'
// import { DOGLOOK, DOGCOOK, CHECKING_INTERVAL, COOK_LOOKBACK_ANIMI, COOK_TOCOOK_ANIMI } from '../constants'


// Phaser.Sprite 中可以 play 动画
// 但是 Phaser.Image 不行
export default class Cook extends Sprite {
    private image: Image;



    private checking: boolean;  // 已经完成回头  正在观察
    private cooking: boolean = true; //做饭  
    //PS  存在时间差 当cooking false checking也是false 的时候表示在扭头的过程中


    private startCheckingTime: number = 0
    private endCheckingTime: number = 0 //
    public checkTimeCount: number = 0 //回头检查次数

    constructor(scene: Phaser.Scene, x: number, y: number,) {
        super(scene, x, y, DOGCOOK, 0)
        // scene.add.image(0, 0, 'dog', 0)
        // let img = new Image(scene,x,y,texture);
        // scene.children.add(this);
        scene.add.existing(this)
        this.addAnimationListener()
    }

    setOriginToTopLeft() {
        this.setOrigin(0, 0)
    }

    addAnimationListener() {
        this.on('animationcomplete', (e) => {
            console.log("animationcomplete", e)
            let eventKey = e.key // lookback ....

            switch (eventKey) {
                // 回头继续做饭动画结束  又开始做饭了
                case COOK_TOCOOK_ANIMI:
                    this.endCheckingTime = +new Date
                    console.log("looking back", this.endCheckingTime - this.startCheckingTime)
                    this.checkTimeCount++
                    this.cooking = true

                    break;
                case COOK_LOOKBACK_ANIMI:
                    // this.startWatchingTime
                    this.checkIfEatingAnimation()
                default:
                    break;
            }
        })
    }


    lookBack() {
        // this.setTexture('doglook', 0)
        this.cooking = false
        this.startCheckingTime = +new Date
        this.play(COOK_LOOKBACK_ANIMI)
    }

    // 厨师回头检查的时间在 1S-2S范围内
    checkIfEatingAnimation() {
        this.checking = true
        let duration = Math.random() * 1500 + 1000
        setTimeout(() => {
            this.cookAgain()
        }, duration)
    }


    cookAgain() {
        // this.setTexture('dogcook', 0)
        this.checking = false
        // this.cooking = true  应该时动画结束的时候才开始 cooking  转头有一个过程
         
        // endCheckingTime 会在动画结束的时候计算
        this.play(COOK_TOCOOK_ANIMI)
    }

    isCooking(): boolean {
        return this.cooking
    }
    isChecking(): boolean {
        return this.checking
    }
    isTurning(): boolean {
        return !this.checking && !this.cooking
    }


    //是否刚刚回头过
    ifJustChecked(elapsed: number): boolean {
        if (this.endCheckingTime != 0 && this.endCheckingTime > this.startCheckingTime) {
            let timeGap = +new Date - this.endCheckingTime
            return (timeGap < CHECKING_INTERVAL)
        }
        return true
    }

}